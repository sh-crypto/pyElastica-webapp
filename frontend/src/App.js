import { useState } from "react";
import axios from "axios";
import RodViewer from "./RodViewer";

function App() {
    const [length, setLength] = useState(1.0);
    const [radius, setRadius] = useState(0.05);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("http://127.0.0.1:5000/simulate", {
                length,
                radius,
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
                <label style={styles.label}>Rod Length:</label>
                <input 
                    type="number" 
                    value={length} 
                    onChange={(e) => setLength(parseFloat(e.target.value))} 
                    step="0.1"
                    style={styles.input}
                />
                <label style={styles.label}>Rod Radius:</label>
                <input 
                    type="number" 
                    value={radius} 
                    onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        setRadius(value);
                        console.log(value);
                    }}
                    step="0.01"
                    style={styles.input}
                />
                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? "Running..." : "Run Simulation"}
                </button>
            </form>

            {result && result.rod_position && (
                <div style={{ marginTop: "40px" }}>
                    <h2>3D Rod Visualization</h2>
                    <RodViewer rodPosition={result.rod_position} />
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        textAlign: "center",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh"
    },
    title: {
        fontSize: "2.5em",
        marginBottom: "30px",
        color: "#333"
    },
    form: {
        display: "inline-block",
        textAlign: "left",
        padding: "20px",
        borderRadius: "8px",
        backgroundColor: "#fff",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
    label: {
        display: "block",
        marginBottom: "8px",
        fontWeight: "bold",
        color: "#555"
    },
    input: {
        width: "100%",
        padding: "8px",
        marginBottom: "16px",
        border: "1px solid #ccc",
        borderRadius: "4px"
    },
    button: {
        width: "100%",
        padding: "10px",
        backgroundColor: "#007BFF",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontWeight: "bold"
    },
    resultBox: {
        marginTop: "30px",
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        maxWidth: "600px",
        marginLeft: "auto",
        marginRight: "auto",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
    },
    resultText: {
        textAlign: "left",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word"
    }
};

export default App;
