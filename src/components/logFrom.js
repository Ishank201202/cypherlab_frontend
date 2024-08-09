import React, { useState } from "react";
import styles from "../components/logFrom.module.css";

export default function LogFrom() {
    const [input, setInput] = useState("");
    const [key, setKey] = useState("");
    const [cipher, setCipher] = useState("");
    const [logs, setLogs] = useState([]);
    const [message, setMessage] = useState("");
    const [output, setOutput] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = { input, key, cipher };

        try {
            const response = await fetch('http://localhost:5000/api/logs/decipher', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            if (response.ok) {
                setMessage(result.message);
                setOutput(result.log.output);
                fetchLogs(); // Fetch logs after successful submission
            } else {
                setMessage(result.error);
                setOutput("");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setMessage("An error occurred while submitting the form.");
            setOutput("");
        }
    };

    const fetchLogs = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/logs/getlogs');
            const logs = await response.json();
            setLogs(logs);
        } catch (error) {
            console.error("Error fetching logs:", error);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Decipher Form</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Input:</label>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Key:</label>
                    <input
                        type="text"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                    />
                </div>
                <div>
                    <label>Cipher:</label>
                    <input
                        type="text"
                        value={cipher}
                        onChange={(e) => setCipher(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
            </form>

            {message && <p>{message}</p>}

            {output && (
                <div className={styles.outputContainer}>
                    <h3>Output:</h3>
                    <p>{output}</p>
                </div>
            )}

            <h2>Logs</h2>
            <button onClick={fetchLogs}>Fetch Logs</button>
            <ul>
                {logs.map((log, index) => (
                    <li key={index}>
                        Input: {log.input}, Key: {log.key}, Cipher: {log.cipher}, Output: {log.output}
                    </li>
                ))}
            </ul>
        </div>
    );
}
