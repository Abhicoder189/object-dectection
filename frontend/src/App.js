import React, { useState } from "react";
import axios from "axios";

// ✅ Correct way: use env var or default to same-origin `/api`
const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL?.replace(/\/$/, "")) || (window.location.origin + "/api");

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  };

  const handleDetect = async () => {
    if (!file) {
      alert("Upload image first");
      return;
    }

    if (!API_BASE_URL) {
      alert("API URL not configured");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_BASE_URL}/detect`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // ✅ Proper base64 handling
      if (res.data?.image) {
        setResult(`data:image/png;base64,${res.data.image}`);
      } else {
        throw new Error("Invalid response from backend");
      }

    } catch (err) {
      console.error("API Error:", err);

      const errorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        err?.message ||
        "Backend error";

      alert(`Backend error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>YOLO Object Detection</h2>

      <input type="file" onChange={handleUpload} />
      <br /><br />

      <button onClick={handleDetect} disabled={loading}>
        {loading ? "Processing..." : "Detect"}
      </button>

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