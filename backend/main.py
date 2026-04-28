from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from ultralytics import YOLO
from PIL import Image
from pathlib import Path
import io, base64, os
import requests

app = FastAPI()

# -----------------------------
# CORS
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# LOAD YOLO MODEL
# -----------------------------
MODEL_PATH = Path(__file__).resolve().parent / "yolov8n.pt"
model = YOLO(str(MODEL_PATH))

# -----------------------------
# SERVE FRONTEND (if built)
# -----------------------------
BUILD_DIR = Path(__file__).resolve().parent.parent / "frontend" / "build"
if BUILD_DIR.exists():
    app.mount("/", StaticFiles(directory=str(BUILD_DIR), html=True), name="frontend")


# -----------------------------
# ROOT (API)
# -----------------------------
@app.get("/api")
def root():
    return {"message": "YOLOv8 API running"}

# -----------------------------
# DETECT
# -----------------------------
@app.post("/api/detect")
async def detect(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        # 🔥 run detection (LOW threshold)
        results = model(image, conf=0.1)

        # 🔥 use YOLO built-in plotting
        plotted = results[0].plot()

        # convert numpy → PIL
        output_image = Image.fromarray(plotted)

        buf = io.BytesIO()
        output_image.save(buf, format="PNG")

        return {
            "image": base64.b64encode(buf.getvalue()).decode()
        }

    except Exception as e:
        print("ERROR:", e)
        return {"error": str(e)}


# -----------------------------
# HUGGING FACE INFERENCE
# -----------------------------
@app.post("/api/hf-classify")
async def hf_classify(file: UploadFile = File(...), model_id: str = "google/vit-base-patch16-224"):
    try:
        hf_token = os.getenv("HF_TOKEN")
        if not hf_token:
            return {"error": "HF_TOKEN environment variable is not set"}

        image_bytes = await file.read()

        headers = {"Authorization": f"Bearer {hf_token}", "Accept": "application/json"}
        url = f"https://api-inference.huggingface.co/models/{model_id}"

        resp = requests.post(url, headers=headers, data=image_bytes, timeout=30)
        resp.raise_for_status()

        return resp.json()

    except Exception as e:
        print("HF ERROR:", e)
        return {"error": str(e)}


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)