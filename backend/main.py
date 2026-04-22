from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
from pathlib import Path
import io, base64

app = FastAPI()

# -----------------------------
# CORS
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# LOAD YOLO MODEL
# -----------------------------
MODEL_PATH = Path(__file__).resolve().parent / "yolov8n.pt"
model = YOLO(str(MODEL_PATH))

# -----------------------------
# ROOT
# -----------------------------
@app.get("/")
def root():
    return {"message": "YOLOv8 API running"}

# -----------------------------
# DETECT
# -----------------------------
@app.post("/detect")
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