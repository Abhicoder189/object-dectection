"""
Hugging Face Space app for YOLOv8 Object Detection
Deploy this to: https://huggingface.co/spaces
"""

import gradio as gr
from ultralytics import YOLO
from PIL import Image
import numpy as np

# Load YOLOv8 model (auto-downloads if not available)
model = YOLO("yolov8n.pt")

def detect_objects(image: Image.Image, conf_threshold: float = 0.5) -> Image.Image:
    """
    Run YOLOv8 detection on an image
    
    Args:
        image: PIL Image
        conf_threshold: Confidence threshold (0.0 to 1.0)
    
    Returns:
        PIL Image with detections plotted
    """
    try:
        # Run detection
        results = model(image, conf=conf_threshold)
        
        # Get plotted image with bounding boxes
        plotted = results[0].plot()
        
        # Convert numpy array to PIL Image
        output_image = Image.fromarray(plotted)
        
        return output_image
    
    except Exception as e:
        raise gr.Error(f"Detection failed: {str(e)}")


# Create Gradio interface
with gr.Blocks(title="YOLOv8 Object Detection") as demo:
    gr.Markdown("""
    # 🎯 YOLOv8 Object Detection
    
    Upload an image to detect objects using YOLOv8 nano model.
    """)
    
    with gr.Row():
        with gr.Column():
            input_image = gr.Image(
                type="pil",
                label="Upload Image",
                sources=["upload", "webcam"]
            )
            confidence = gr.Slider(
                minimum=0.0,
                maximum=1.0,
                value=0.5,
                step=0.05,
                label="Confidence Threshold"
            )
            submit_btn = gr.Button("Detect Objects", variant="primary")
        
        with gr.Column():
            output_image = gr.Image(
                type="pil",
                label="Detections"
            )
    
    submit_btn.click(
        fn=detect_objects,
        inputs=[input_image, confidence],
        outputs=output_image
    )
    
    gr.Examples(
        examples=["examples/image1.jpg", "examples/image2.jpg"],
        inputs=input_image,
        outputs=output_image,
        fn=detect_objects,
        cache_examples=False,
    )


if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=7860)
