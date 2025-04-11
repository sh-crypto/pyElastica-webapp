import { useState } from "react";
import axios from "axios";
import RodViewer from "./RodViewer";

function App() {
    const [length, setLength] = useState(1.0);
    const [radius, setRadius] = useState(0.05);
    const [density, setDensity] = useState(2000);
    const [youngsModulus, setYoungsModulus] = useState(1e6);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("http://127.0.0.1:5000/simulate", {
                length,
                radius,
                density,
                youngs_modulus: youngsModulus,
            });
            setResult(response.data);
        } catch (error) {
            console.error("Error running simulation:", error);
            setResult({ message: "An error occurred." });
        }
        setLoading(false);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>PyElastica Web App</h1>

            <form onSubmit={handleSubmit} style={styles.form}>
                {/* Inputs */}
                {[
                    { label: "Rod Length:", value: length, setValue: setLength, step: 0.1 },
                    { label: "Rod Radius:", value: radius, setValue: setRadius, step: 0.01 },
                    { label: "Density:", value: density, setValue: setDensity, step: 100 },
                    { label: "Young's Modulus:", value: youngsModulus, setValue: setYoungsModulus, step: 10000 },
                ].map(({ label, value, setValue, step }) => (
                    <>
                        <label style={styles.label}>{label}</label>
                        <input type="number" value={value} onChange={(e) => setValue(parseFloat(e.target.value))} step={step} style={styles.input} />
                    </>
                ))}

                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? "Running..." : "Run Simulation"}
                </button>
            </form>

            {result && result.rod_position && (
                <div style={styles.resultContainer}>
                    <h2>3D Rod Visualization</h2>
                    <RodViewer rodPosition={result.rod_position} rodRadius={radius} />
                    <div style={styles.statsBox}>
                        <h3>Simulation Stats</h3>
                        <p>Length: {length} m</p>
                        <p>Radius: {radius} m</p>
                        <p>Density: {density} kg/m³</p>
                        <p>Young's Modulus: {youngsModulus}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: { display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh", backgroundColor: "#f0f2f5", padding: "20px" },
    title: { fontSize: "2.5em", marginBottom: "20px" },
    form: { display: "flex", flexDirection: "column", gap: "10px", padding: "30px", borderRadius: "12px", backgroundColor: "#fff", boxShadow: "0 8px 20px rgba(0,0,0,0.1)", minWidth: "280px", maxWidth: "320px" },
    label: { fontWeight: "bold" },
    input: { padding: "10px", border: "1px solid #ccc", borderRadius: "6px" },
    button: { padding: "12px", backgroundColor: "#007BFF", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" },
    resultContainer: { marginTop: "40px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" },
    statsBox: { marginTop: "20px", padding: "20px", backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" },
};

export default App;
