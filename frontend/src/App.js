import React, { useState } from "react";
import axios from "axios";

const isLocalhost = window.location.hostname === "localhost";
const rawApiBaseUrl =
  process.env.REACT_APP_API_BASE_URL ||
  (isLocalhost ? "http://localhost:8000" : "");
const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, "");

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);

  const handleUpload = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  };

  const handleDetect = async () => {
    if (!file) return alert("Upload image first");
    if (!API_BASE_URL) {
      alert(
        "Backend URL not configured. Set REACT_APP_API_BASE_URL in Vercel to your Render backend URL (for example: https://your-service.onrender.com)."
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/detect`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // 🔥 IMPORTANT
      setResult(`data:image/png;base64,${res.data.image}`);

    } catch (err) {
      console.error("API Error:", err);
      const errorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        err?.message ||
        "Backend error";
      alert(`Backend error: ${errorMessage}`);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>YOLO Object Detection</h2>

      <input type="file" onChange={handleUpload} />
      <br /><br />

      <button onClick={handleDetect}>Detect</button>

      <br /><br />

      {/* ORIGINAL IMAGE */}
      {preview && (
        <div>
          <h4>Original</h4>
          <img src={preview} width="300" alt="preview" />
        </div>
      )}

      <br />

      {/* RESULT IMAGE */}
      {result && (
        <div>
          <h4>Detected</h4>
          <img src={result} width="300" alt="result" />
        </div>
      )}
    </div>
  );
}

export default App;