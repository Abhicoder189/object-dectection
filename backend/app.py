"""
Hugging Face Space app for YOLOv8 Object Detection
Deploy this to: https://huggingface.co/spaces
"""

import gradio as gr
from ultralytics import YOLO
from PIL import Image
import numpy as np
import os

# Load YOLOv8 model (auto-downloads if not available)
print("Loading YOLOv8 model...")
model = YOLO("yolov8n.pt")
print("✅ Model loaded successfully!")

def detect_objects(image: Image.Image, conf_threshold: float = 0.5) -> Image.Image:
    """
    Run YOLOv8 detection on an image
    
    Args:
        image: PIL Image
        conf_threshold: Confidence threshold (0.0 to 1.0)
    
    Returns:
        PIL Image with detections plotted
    """
    if image is None:
        raise ValueError("No image provided")
    
    try:
        # Ensure image is RGB
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Run detection
        results = model(image, conf=conf_threshold, verbose=False)
        
        # Get plotted image with bounding boxes
        plotted = results[0].plot()
        
        # Convert numpy array to PIL Image
        output_image = Image.fromarray(plotted)
        
        return output_image
    
    except Exception as e:
        print(f"Detection error: {str(e)}")
        raise gr.Error(f"Detection failed: {str(e)}")


# Create Gradio Interface (with automatic API support)
demo = gr.Interface(
    fn=detect_objects,
    inputs=[
        gr.Image(
            type="pil",
            label="Upload Image",
            sources=["upload", "webcam"]
        ),
        gr.Slider(
            minimum=0.0,
            maximum=1.0,
            value=0.5,
            step=0.05,
            label="Confidence Threshold"
        )
    ],
    outputs=gr.Image(
        type="pil",
        label="Detections"
    ),
    title="🎯 YOLOv8 Object Detection",
    description="Upload an image to detect objects using YOLOv8 nano model."
)

if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=7860)

