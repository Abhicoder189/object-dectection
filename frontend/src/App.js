import React, { useState } from "react";
import axios from "axios";

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

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:8000/detect",
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
      alert("Backend error");
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