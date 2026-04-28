# YOLOv8 Object Detection - Hugging Face Space

This is a Hugging Face Space deployment for YOLOv8 object detection.

## Deployment Steps

### 1. Create a Hugging Face Account
- Go to https://huggingface.co
- Sign up and create an account (or log in)

### 2. Create a New Space
- Go to https://huggingface.co/spaces
- Click "Create new Space"
- Fill in the form:
  - **Space name**: `yolov8-detector` (or your preferred name)
  - **License**: Choose appropriate license
  - **Space SDK**: Select **Gradio**
  - **Visibility**: Public (or Private)

### 3. Upload Files
- Clone or upload the following to your Space repository:
  - `app.py` - Main application
  - `requirements_hf.txt` - Rename to `requirements.txt`
  - `yolov8n.pt` - Pre-trained model weights (if available)

### 4. Deploy
- Push/upload files to the Space
- Hugging Face will automatically build and deploy
- Your Space will be available at: `https://huggingface.co/spaces/YOUR_USERNAME/SPACE_NAME`

## Local Testing

```bash
# Install dependencies
pip install -r requirements_hf.txt

# Run locally
python app.py
```

Then visit: http://localhost:7860

## API Endpoint (for frontend integration)

Once deployed, use this endpoint:
```
https://huggingface.co/spaces/YOUR_USERNAME/SPACE_NAME/api/predict/
```

## Environment Variables

If you need authentication:
- Set `HF_TOKEN` as an environment variable with your Hugging Face API token

## Notes

- Model auto-downloads on first run (~50MB)
- GPU acceleration available on Hugging Face Pro
- Space restarts if idle for 48 hours (on free tier)
