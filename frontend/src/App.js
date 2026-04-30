import React, { useState, useRef, useEffect } from "react";

// ⚠️ UPDATE THIS WITH YOUR ACTUAL HUGGING FACE SPACE URL
// Direct format (recommended): https://username-spacename.hf.space
// Page format will be auto-converted: https://huggingface.co/spaces/username/spacename
const DEFAULT_HF_SPACE = "https://abhi189-obj-detect.hf.space";

// Helper function to normalize HF Space URLs
const normalizeHFSpaceUrl = (rawUrl) => {
  if (!rawUrl) return "";

  const input = rawUrl.trim();
  const withProtocol = /^https?:\/\//i.test(input) ? input : `https://${input}`;

  try {
    const parsed = new URL(withProtocol);
    const host = parsed.hostname.toLowerCase();
    const pathParts = parsed.pathname.split("/").filter(Boolean);

    // Direct runtime host format: https://username-spacename.hf.space
    if (host.endsWith(".hf.space")) {
      return `${parsed.protocol}//${parsed.hostname}`;
    }

    // Convert page format to runtime host:
    // https://huggingface.co/spaces/username/spacename[/anything]
    if (host === "huggingface.co" && pathParts[0] === "spaces" && pathParts.length >= 3) {
      const username = pathParts[1];
      const spacename = pathParts[2];
      return `https://${username}-${spacename}.hf.space`;
    }

    return `${parsed.protocol}//${parsed.hostname}`;
  } catch {
    return input.replace(/\/$/, "");
  }
};

export default function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [error, setError] = useState(null);
  const [hfSpaceUrl, setHfSpaceUrl] = useState(() => {
    const stored = localStorage.getItem("hfSpaceUrl");
    return normalizeHFSpaceUrl(stored || DEFAULT_HF_SPACE);
  });
  const [confThreshold, setConfThreshold] = useState(() => 
    parseFloat(localStorage.getItem("confThreshold")) || 0.5
  );
  const normalizedSpaceUrl = normalizeHFSpaceUrl(hfSpaceUrl);

  const canvasRef = useRef(null);
  const imgRef = useRef(new Image());

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    setError(null);
    setPredictions(null);
    const f = e.target.files && e.target.files[0];
    if (!f) return;

    if (!f.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    imgRef.current.onload = () => drawCanvas(imgRef.current, null);
    imgRef.current.src = url;
  };

  async function imageFileToBlob(file, maxWidth = 1024, quality = 0.8) {
    const img = await new Promise((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = URL.createObjectURL(file);
    });

    const scale = Math.min(1, maxWidth / img.width);
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);

    return await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", quality)
    );
  }

  async function handleSubmit() {
    setError(null);
    setPredictions(null);

    if (!file) {
      setError("No file selected.");
      return;
    }

    const spaceBaseUrl = normalizeHFSpaceUrl(hfSpaceUrl);

    if (!spaceBaseUrl || spaceBaseUrl.includes("YOUR_USERNAME") || spaceBaseUrl.includes("username-spacename")) {
      setError("❌ Please configure your Hugging Face Space URL first!");
      return;
    }

    setLoading(true);

    try {
      // Convert image to base64
      const blob = await imageFileToBlob(file, 1024, 0.8);
      const reader = new FileReader();
      
      const base64 = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // Try Gradio Interface API endpoint (works with gr.Interface)
      const endpoints = [
        `${spaceBaseUrl}/api/predict/`,
        `${spaceBaseUrl}/run/predict`,
        `${spaceBaseUrl}/api/predict`,
        `${spaceBaseUrl}/call/predict`,
      ];

      let response = null;
      let lastError = null;

      for (const endpoint of endpoints) {
        try {
          console.log("Trying endpoint:", endpoint);
          response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              data: [base64, confThreshold],
            }),
          });

          if (response.ok) {
            console.log("✅ Success with endpoint:", endpoint);
            break;
          } else {
            lastError = `${response.status}: ${response.statusText}`;
          }
        } catch (err) {
          lastError = err.message;
          console.warn(`Failed with ${endpoint}:`, err.message);
        }
      }

      if (!response || !response.ok) {
        throw new Error(
          `Could not reach Space API. Tried endpoints: ${endpoints.join(", ")}. ` +
          `Last error: ${lastError}. ` +
          `Space may still be starting - wait 30 seconds and try again.`
        );
      }

      const json = await response.json();
      console.log("API Response:", json);
      
      // Handle Gradio response format
      if (json?.data && Array.isArray(json.data) && json.data[0]) {
        // The output image from Gradio
        const outputImagePath = json.data[0];
        console.log("Output image:", outputImagePath);

        const resolvedOutputImageUrl =
          typeof outputImagePath === "string" && outputImagePath.startsWith("http")
            ? outputImagePath
            : typeof outputImagePath === "string" && outputImagePath.startsWith("data:")
              ? outputImagePath
              : `${spaceBaseUrl}${String(outputImagePath).startsWith("/") ? "" : "/"}${outputImagePath}`;
        
        // Create an image from the URL
        const img = new Image();
        img.onload = () => {
          // Update canvas with the output image
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext("2d");
          
          const maxDisplayWidth = 800;
          const scale = Math.min(1, maxDisplayWidth / img.width);
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.onerror = () => {
          setError("Failed to load result image from Space");
        };
        img.src = resolvedOutputImageUrl;
        
        setPredictions({ image: resolvedOutputImageUrl, message: "✅ Detection completed!" });
      } else if (json?.error) {
        throw new Error(json.error);
      } else {
        console.log("Unexpected response format:", json);
        setPredictions(json);
      }
    } catch (err) {
      console.error("Detection error:", err);
      setError(err.message || "Detection failed. Check browser console for details.");
    } finally {
      setLoading(false);
    }
  }

  async function drawCanvas(img, preds) {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");

    const maxDisplayWidth = 800;
    const scale = Math.min(1, maxDisplayWidth / img.width);
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    if (!preds || !Array.isArray(preds)) return;

    ctx.lineWidth = Math.max(2, Math.round(canvas.width / 300));
    ctx.font = `${Math.max(12, Math.round(canvas.width / 60))}px sans-serif`;

    preds.forEach((p, i) => {
      const label = p.label || p.name || p.entity?.value || "object";
      const score = p.score ?? p.confidence ?? null;
      let box = p.box ?? p.bounding_box ?? p.bbox ?? p.coordinates ?? null;

      if (!box) return;

      let x0, y0, x1, y1;
      if (Array.isArray(box) && box.length >= 4) [x0, y0, x1, y1] = box;
      else if (typeof box === "object") {
        x0 = box.xmin ?? box.left ?? box.x0 ?? box.x;
        y0 = box.ymin ?? box.top ?? box.y0 ?? box.y;
        x1 = box.xmax ?? box.right ?? box.x1 ?? (box.x != null && box.width != null ? box.x + box.width : null);
        y1 = box.ymax ?? box.bottom ?? box.y1 ?? (box.y != null && box.height != null ? box.y + box.height : null);
        if ((box.left || box.top) && (box.width || box.height) && x1 == null) {
          x1 = x0 + (box.width || 0);
          y1 = y0 + (box.height || 0);
        }
      } else return;

      const normalized = [x0, y0, x1, y1].every(v => v >= 0 && v <= 1);
      if (normalized) {
        x0 *= img.width; x1 *= img.width; y0 *= img.height; y1 *= img.height;
      }

      const sx = canvas.width / img.width;
      const sy = canvas.height / img.height;
      const rx = x0 * sx;
      const ry = y0 * sy;
      const rw = (x1 - x0) * sx;
      const rh = (y1 - y0) * sy;

      ctx.strokeStyle = `hsl(${(i * 60) % 360} 80% 50%)`;
      ctx.fillStyle = ctx.strokeStyle;
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.stroke();

      const labelText = score != null ? `${label} ${(score * 100).toFixed(1)}%` : label;
      const textWidth = ctx.measureText(labelText).width;
      const padding = 4;
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(rx, ry - (parseInt(ctx.font) + padding), textWidth + padding * 2, parseInt(ctx.font) + padding);

      ctx.fillStyle = "#fff";
      ctx.fillText(labelText, rx + padding, ry - padding);
    });
  }

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", fontFamily: "sans-serif" }}>
      <h1>🎯 YOLOv8 Object Detection</h1>
      <p style={{ color: "#666" }}>
        Powered by Hugging Face Spaces & YOLOv8
      </p>

      {/* Configuration Section */}
      <div style={{ 
        background: "#f0f0f0", 
        padding: "15px", 
        borderRadius: "8px", 
        marginBottom: "20px",
        border: "1px solid #ddd"
      }}>
        <h3>⚙️ Configuration</h3>
        
        <div style={{ marginBottom: "10px" }}>
          <label><strong>Hugging Face Space URL:</strong></label>
          <input
            type="text"
            value={hfSpaceUrl}
            onChange={(e) => {
              const normalized = normalizeHFSpaceUrl(e.target.value);
              setHfSpaceUrl(normalized);
              localStorage.setItem("hfSpaceUrl", normalized);
            }}
            placeholder="https://username-spacename.hf.space"
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              boxSizing: "border-box",
              borderRadius: "4px",
              border: "1px solid #ccc"
            }}
          />
          <p style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
            Get this from: <a href="https://huggingface.co/spaces" target="_blank" rel="noopener noreferrer">
              huggingface.co/spaces
            </a>
          </p>
        </div>

        <div>
          <label><strong>Confidence Threshold: {(confThreshold * 100).toFixed(0)}%</strong></label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={confThreshold}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setConfThreshold(val);
              localStorage.setItem("confThreshold", val);
            }}
            style={{ width: "100%", marginTop: "5px" }}
          />
          <p style={{ fontSize: "12px", color: "#666" }}>
            Higher = fewer detections, lower = more detections
          </p>
        </div>
      </div>

      {/* File Upload Section */}
      <div style={{ marginBottom: "20px", padding: "15px", background: "#f9f9f9", borderRadius: "8px" }}>
        <h3>📤 Upload Image</h3>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button 
          onClick={handleSubmit} 
          disabled={loading || !normalizedSpaceUrl.includes("hf.space")}
          style={{ 
            marginLeft: "8px",
            padding: "8px 16px",
            background: loading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "14px"
          }}
        >
          {loading ? "🔄 Detecting..." : "🚀 Detect Objects"}
        </button>
        
        <button 
          onClick={async () => {
            const statusEndpoints = [
              `${normalizedSpaceUrl}/config`,
              `${normalizedSpaceUrl}/api/predict/`,
              `${normalizedSpaceUrl}/run/predict`,
              `${normalizedSpaceUrl}/api/predict`,
            ];
            
            let results = [];
            for (const ep of statusEndpoints) {
              try {
                const res = await fetch(ep, { method: 'HEAD' }).catch(() => 
                  fetch(ep, { method: 'GET' })
                );
                results.push(`${ep}: ${res?.status || 'ERR'}`);
              } catch (e) {
                results.push(`${ep}: Failed`);
              }
            }
            alert(`Space Status:\n\n${results.join('\n')}\n\nIf all show 404 or Failed, Space may not be deployed yet.`);
          }}
          style={{ 
            marginLeft: "8px",
            padding: "8px 16px",
            background: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px"
          }}
        >
          🔍 Diagnose Space Status
        </button>
      </div>

      {/* Error Section */}
      {error && (
        <div style={{ 
          color: "white", 
          background: "#e74c3c", 
          padding: "12px", 
          borderRadius: "4px",
          marginBottom: "20px"
        }}>
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}

      {/* Results Section */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={{ flex: 1 }}>
          <h3>🖼️ Input Image</h3>
          {previewUrl ? (
            <img src={previewUrl} alt="preview" style={{ maxWidth: "100%", borderRadius: "4px", border: "1px solid #ddd" }} />
          ) : (
            <div style={{ 
              width: "100%", 
              height: "250px", 
              border: "2px dashed #ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#999",
              borderRadius: "4px",
              background: "#f9f9f9"
            }}>
              No image selected
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <h3>🎯 Detected Objects</h3>
          <canvas 
            ref={canvasRef} 
            style={{ 
              border: "1px solid #ddd", 
              maxWidth: "100%",
              borderRadius: "4px",
              background: "#f9f9f9",
              display: "block"
            }} 
          />
          {!predictions && !loading && (
            <p style={{ color: "#999", textAlign: "center", marginTop: "10px" }}>
              Upload an image and click "Detect Objects"
            </p>
          )}
        </div>
      </div>

      {/* Predictions Section */}
      {predictions && (
        <div style={{ marginTop: "20px", padding: "15px", background: "#f0f8ff", borderRadius: "8px", border: "1px solid #b3d9ff" }}>
          <h3>✅ Results</h3>
          <pre style={{ 
            maxHeight: "300px", 
            overflow: "auto", 
            background: "#ffffff", 
            padding: "12px",
            borderRadius: "4px",
            border: "1px solid #ddd",
            fontSize: "12px"
          }}>
            {JSON.stringify(predictions, null, 2)}
          </pre>
        </div>
      )}

      {/* Instructions Section */}
      <div style={{ marginTop: "30px", padding: "20px", background: "#fffacd", borderRadius: "8px", border: "1px solid #f0e68c" }}>
        <h3>📋 How to Deploy Your Model</h3>
        <ol>
          <li>Go to <a href="https://huggingface.co/spaces" target="_blank" rel="noopener noreferrer">Hugging Face Spaces</a></li>
          <li>Click "Create new Space" → Choose "Gradio" SDK</li>
          <li>Upload <code>app.py</code> and <code>requirements.txt</code> from the backend folder</li>
          <li>Once deployed, copy your Space URL (e.g., <code>https://username-yolov8.hf.space</code>)</li>
          <li>Paste it in the Configuration section above</li>
          <li>Start detecting objects! 🎉</li>
        </ol>
      </div>
    </div>
  );
}