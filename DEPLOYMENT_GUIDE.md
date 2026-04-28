# 🚀 Complete Deployment Guide: YOLOv8 on Hugging Face + Frontend Integration

## Overview
This guide walks you through deploying your YOLOv8 object detection model to Hugging Face Spaces and integrating it with your React frontend.

---

## Part 1: Prepare Your Files

### Files needed in `backend/` folder:
- ✅ `app.py` - Gradio application (already created)
- ✅ `requirements_hf.txt` - Dependencies (already created)
- ✅ `yolov8n.pt` - Your pre-trained model (already in folder)

---

## Part 2: Deploy to Hugging Face Spaces

### Step 1: Create Hugging Face Account
1. Go to [huggingface.co](https://huggingface.co)
2. Sign up or log in with your account
3. Note your **username** (you'll need it)

### Step 2: Create a New Space
1. Go to [huggingface.co/spaces](https://huggingface.co/spaces)
2. Click **"Create new Space"** button
3. Fill in the form:
   - **Space name**: `yolov8-detector` (you can use any name)
   - **License**: Choose "Apache 2.0" or preferred license
   - **Space SDK**: Select **Gradio**
   - **Visibility**: Public (anyone can use it) or Private (only you)
4. Click **"Create Space"**

### Step 3: Upload Your Files
You have two options:

#### Option A: Via Web UI (Easiest)
1. In your new Space, click the folder/file icon
2. Upload `app.py` from `backend/`
3. Upload `requirements_hf.txt` and rename it to `requirements.txt`
4. If your model isn't auto-downloaded, upload `yolov8n.pt`

#### Option B: Via Git (Recommended for future updates)
```bash
# Clone your space
git clone https://huggingface.co/spaces/YOUR_USERNAME/yolov8-detector
cd yolov8-detector

# Copy your files
cp ../IMAGE\ CLASSIFIER/backend/app.py .
cp ../IMAGE\ CLASSIFIER/backend/requirements_hf.txt ./requirements.txt
cp ../IMAGE\ CLASSIFIER/backend/yolov8n.pt .

# Push to HF
git add -A
git commit -m "Initial YOLOv8 deployment"
git push
```

### Step 4: Wait for Deployment
- Hugging Face will automatically build and deploy your Space
- Check the "Build logs" tab for progress
- This takes 2-5 minutes typically
- Once done, you'll see a green ✅ status

### Step 5: Get Your Space URL
Your deployed model is now live at:
```
https://YOUR_USERNAME-yolov8-detector.hf.space
```

Example: `https://john-yolov8-detector.hf.space`

---

## Part 3: Update Frontend Configuration

### Step 1: Update App.js
In `frontend/src/App.js`, locate this line:
```javascript
const DEFAULT_HF_SPACE = "https://YOUR_USERNAME-yolov8-detector.hf.space";
```

Replace with your actual Space URL:
```javascript
const DEFAULT_HF_SPACE = "https://john-yolov8-detector.hf.space";
```

### Step 2: Test Locally
```bash
cd frontend
npm start
```

1. Open http://localhost:3000
2. In the **Configuration** section, paste your Hugging Face Space URL
3. Upload an image and click **"Detect Objects"**
4. You should see detections with bounding boxes!

---

## Part 4: Deploy Frontend (Optional)

### Option A: Deploy to Vercel (Recommended)
```bash
cd frontend
npm install -g vercel
vercel
```
Follow prompts and your frontend will be live at a Vercel URL.

### Option B: Deploy to Netlify
```bash
cd frontend
npm run build
# Then drag & drop the 'build' folder to netlify.com
```

### Option C: Deploy to GitHub Pages
```bash
# Update package.json homepage field
npm run build
npm install gh-pages --save-dev
npm run deploy
```

---

## Part 5: Troubleshooting

### Frontend shows "Detection failed" error
**Problem**: Space URL not configured correctly
**Solution**: 
- Double-check the URL format: `https://username-spacename.hf.space`
- Make sure there's no trailing slash
- Test the URL directly in browser - you should see the Gradio UI

### Model takes too long to load
**Problem**: First request is slow
**Solution**: 
- This is normal - model is being loaded
- Subsequent requests are faster
- On HF free tier, Space might go to sleep after 48 hours

### CORS error
**Problem**: "Cross-Origin Request Blocked"
**Solution**:
- This shouldn't happen with HF Spaces (they support CORS)
- Check browser console for exact error message
- Try in a different browser

### Image not uploading
**Problem**: File size too large
**Solution**:
- Frontend compresses images to max 1024x1024
- Should work for most cases
- Check browser console for error details

---

## Part 6: Monitor Your Space

### View Logs
1. Go to your Space on Hugging Face
2. Click the "Logs" tab
3. See request history and any errors

### Check Space Status
- Green ✅ = Running normally
- Orange ⚠️ = Building or sleeping
- Red ❌ = Error

### Set up Notifications
1. Click Settings in your Space
2. Enable email notifications for builds

---

## Part 7: Advanced Options

### Add More Models
Update `app.py` to support multiple models:
```python
MODEL_CHOICE = gr.Radio(["yolov8n", "yolov8s", "yolov8m"], 
                         value="yolov8n", 
                         label="Model Size")
```

### Increase Performance
- Use GPU: Requires HF Pro subscription
- Reduce image size for faster processing
- Use a smaller model (yolov8n is already small)

### Add Authentication
```python
import os
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
demo = gr.Interface(..., auth=lambda u, p: p == ADMIN_PASSWORD)
```

### Custom Styling
Update the Gradio theme in `app.py`:
```python
demo = gr.Blocks(theme=gr.themes.Soft())
```

---

## Part 8: Cost & Limitations

### Free Tier
- ✅ Up to 1 Space
- ✅ Runs 24/7 while in use
- ⚠️ Space sleeps after 48 hours of inactivity
- ❌ No GPU

### Pro Tier ($9/month)
- ✅ Unlimited Spaces
- ✅ GPU acceleration
- ✅ Priority support
- ❌ Still sleeps after inactivity

### Always Running (Premium)
- For production use
- Contact Hugging Face for pricing

---

## Final Checklist

- [ ] YOLOv8 model deployed to HF Space
- [ ] Space is showing green ✅ status
- [ ] Frontend updated with correct Space URL
- [ ] Frontend runs locally without errors
- [ ] Can upload image and get detections
- [ ] Bounding boxes display correctly
- [ ] (Optional) Frontend deployed to Vercel/Netlify

---

## Useful Links

- 🤗 [Hugging Face Spaces](https://huggingface.co/spaces)
- 📚 [Gradio Documentation](https://www.gradio.app)
- 🚀 [YOLOv8 Documentation](https://docs.ultralytics.com)
- ⚡ [Vercel Deployment](https://vercel.com)
- 🎨 [Netlify Deployment](https://netlify.com)

---

## Support

If you encounter issues:
1. Check the Space Logs on Hugging Face
2. Check browser console for frontend errors (F12)
3. Verify API endpoint is reachable
4. Try accessing the Space URL directly

Happy detecting! 🎯
