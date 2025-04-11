import numpy as np
from elastica import *
from elastica.boundary_conditions import FreeRod, FixedConstraint

class RodSimulator(BaseSystemCollection, Constraints, Forcing, Damping, CallBacks):
    pass

def run_simulation(params):
    simulator = RodSimulator()
    
    n_elements = 50
    rod_length = params.get("length", 1.0)
    rod_radius = params.get("radius", 0.05)
    print(f"Rod Length: {rod_length}, Rod Radius: {rod_radius}")
    rod = CosseratRod.straight_rod(
        n_elements,
        start=np.array([0.0, 0.0, 0.0]),
        direction=np.array([1.0, 0.0, 0.0]),
        normal=np.array([0.0, 1.0, 0.0]),
        base_length=rod_length,
        base_radius=rod_radius,
        density=1000,
        youngs_modulus=1e6,
        shear_modulus=1e5
    )
    simulator.append(rod)

    simulator.constrain(rod).using(FixedConstraint, constrained_position_idx=(0,), constrained_director_idx=(0,))

    time_stepper = PositionVerlet()  
    simulator.time_stepper = time_stepper  

    simulator.finalize()  

    timestep = 1e-4
    total_time = 1.0
    total_steps = int(total_time / timestep)

    integrate(time_stepper, simulator, final_time=total_time, total_steps=total_steps)

    return {"message": "Simulation complete", "rod_position": rod.position_collection.tolist()}
