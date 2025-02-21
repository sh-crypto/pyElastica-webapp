import numpy as np
from elastica import *
from elastica.boundary_conditions import FreeRod, FixedConstraint

class RodSimulator(BaseSystemCollection, Constraints, Forcing, Damping, CallBacks):
    pass

def run_simulation(params):
    simulator = RodSimulator()
    
    # Create a rod
    n_elements = 50
    rod_length = params.get("length", 1.0)
    rod_radius = params.get("radius", 0.05)
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

    # Apply constraints and forces
    simulator.constrain(rod).using(FixedConstraint, constrained_position_idx=(0,), constrained_director_idx=(0,))
    simulator.finalize()

    # Run simulation
    timestep = 1e-4
    total_time = 1.0
    for _ in range(int(total_time / timestep)):
        simulator.time_stepper.do_step(simulator, dt=timestep)

    return {"message": "Simulation complete", "rod_position": rod.position.tolist()}
