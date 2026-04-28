# 🚀 Quick Start: Deploy in 5 Minutes

## TL;DR - Fastest Path

### 1. Create Hugging Face Account
- Go to [huggingface.co](https://huggingface.co) and sign up
- Remember your **username**

### 2. Create New Space
- Go to [huggingface.co/spaces](https://huggingface.co/spaces)
- Click "Create new Space"
- Choose "Gradio" SDK, click Create

### 3. Upload Files
Upload these files to your Space:
- `backend/app.py`
- `backend/requirements_hf.txt` (rename to `requirements.txt`)
- `backend/yolov8n.pt`

### 4. Update Frontend
Edit `frontend/src/App.js`, line ~3:
```javascript
// Change this:
const DEFAULT_HF_SPACE = "https://YOUR_USERNAME-yolov8-detector.hf.space";

// To your actual URL:
const DEFAULT_HF_SPACE = "https://john-yolov8-detector.hf.space";
```

### 5. Run Frontend
```bash
cd frontend
npm start
```

### 6. Test It!
1. Go to http://localhost:3000
2. Paste your Space URL in Configuration
3. Upload an image
4. Click "Detect Objects"
5. Done! ✅

---

## Your Space URL Format
```
https://YOUR_USERNAME-yolov8-detector.hf.space
```

Example:
```
https://john-smith-yolov8-detector.hf.space
```

**Find it**: In your Space settings, it's shown as the "Direct URL"

---

## Next Steps
- Deploy frontend to Vercel for a full production setup
- Add more models by editing `app.py`
- Enable GPU for faster processing (HF Pro)

See `DEPLOYMENT_GUIDE.md` for detailed instructions!
