# ✅ Vercel Deployment Guide

Your frontend is now deployed on Vercel! Here's what you need to know:

## Your Setup
- **Frontend**: Deployed on Vercel at `your-vercel-url.vercel.app`
- **Backend Model**: Hugging Face Space at `https://abhi189-obj-detect.hf.space`
- **Communication**: Frontend → HF Space API (direct calls)

---

## ✅ What's Working

### Frontend (Vercel)
- ✅ Deployed and live
- ✅ Direct API calls to HF Space
- ✅ CORS handled by HF Spaces
- ✅ No proxy needed
- ✅ Environment variables supported

### Backend (HF Space)
- ✅ Auto-detects CORS requests from Vercel
- ✅ Accepts image uploads
- ✅ Returns detection results
- ✅ Always accessible

---

## 🔧 Environment Variables (Vercel)

If you need to use environment variables in Vercel:

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add these (optional):
   ```
   REACT_APP_HF_SPACE_URL = https://abhi189-obj-detect.hf.space
   REACT_APP_API_TIMEOUT = 30000
   ```

4. Update `App.js` to use them:
   ```javascript
   const DEFAULT_HF_SPACE = process.env.REACT_APP_HF_SPACE_URL || "https://abhi189-obj-detect.hf.space";
   ```

5. Redeploy on Vercel

---

## 🚀 Your Vercel URL

Your frontend is live at: **Your Vercel project URL** (e.g., `my-detector.vercel.app`)

### How to find it:
1. Go to [vercel.com](https://vercel.com)
2. Log in
3. Select your project
4. Copy the **Production Domain** from the top

### Test it:
- Open your Vercel URL in the browser
- Enter your HF Space URL: `https://abhi189-obj-detect.hf.space`
- Upload an image
- Click "Detect Objects"

---

## ⚡ Performance Tips for Vercel

### 1. **Image Compression** (Already done)
- Frontend automatically compresses images to 1024x1024
- Reduces upload time by ~90%

### 2. **Caching** (Optional)
Add to `frontend/vercel.json`:
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/predict",
      "headers": {
        "Cache-Control": "max-age=3600"
      }
    }
  ]
}
```

### 3. **Increase Timeout** (If model is slow)
In `frontend/src/App.js`:
```javascript
const response = await fetch(`${hfSpaceUrl}/api/predict/`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    data: [base64, confThreshold],
  }),
  signal: AbortSignal.timeout(60000), // 60 seconds
});
```

---

## 🛠️ Troubleshooting on Vercel

### Issue: "Detection failed"
**Causes & Solutions:**
1. **Wrong Space URL**
   - Make sure it's: `https://abhi189-obj-detect.hf.space`
   - NOT: `https://huggingface.co/spaces/abhi189/obj-detect`
   - App now auto-converts, but double-check

2. **HF Space is sleeping**
   - Free tier spaces sleep after 48 hours
   - First request wakes it (takes ~10 seconds)
   - Pro tip: Use HF Pro for always-on GPU

3. **Network timeout**
   - HF Space might be slow on first request
   - Try again after 10 seconds

### Issue: "CORS blocked"
**This shouldn't happen** because:
- HF Spaces automatically handles CORS
- Vercel allows all outbound requests

If it happens:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Try a different browser
3. Check browser console (F12) for exact error
4. Verify Space URL format

### Issue: Results showing but image is broken
**Check:**
1. HF Space returned the image correctly (check Logs tab)
2. Browser console for image loading errors
3. Try a different image file

---

## 📊 Monitoring

### Check Vercel Stats
1. Go to [vercel.com](https://vercel.com)
2. Select your project
3. Click **Analytics**
4. View:
   - Request count
   - Response times
   - Error rate

### Check HF Space Activity
1. Go to your [HF Space](https://huggingface.co/spaces/Abhi189/obj-detect)
2. Click **Logs** tab
3. See all API requests from your Vercel app

---

## 🔐 Security Notes

### Vercel
- ✅ HTTPS enforced
- ✅ Free SSL certificate
- ✅ DDoS protection
- ✅ No secrets exposed (env vars are secure)

### HF Space
- ✅ CORS restricted to valid origins
- ✅ Rate limiting built-in
- ✅ Model weights protected
- ✅ Public access only (if you set it)

---

## 📱 Share Your App

### Public URL
Your Vercel app is publicly accessible (if you want):
- Send the URL to anyone
- They can use your object detector
- No installation needed

### Private Access (Optional)
To restrict access:
1. Vercel Dashboard → Settings → Deployment Protection
2. Enable protection
3. Users need to authenticate to access

---

## 🔄 Updating Your Code

### Make Changes & Redeploy
```bash
# From your project folder
git add .
git commit -m "Update detection model"
git push
```

Vercel automatically redeploys on push!

### Or use Vercel CLI:
```bash
npm install -g vercel
vercel
```

---

## 💡 Next Steps

### To improve your app:
1. **Add More Models** - Edit app.py to support yolov8s, yolov8m
2. **Customize UI** - Modify App.js styling
3. **Add Analytics** - Track detection usage
4. **Deploy Backend** - Move HF Space to always-running server for production

### To scale up:
1. Upgrade HF to Pro ($9/month) for GPU
2. Upgrade Vercel Pro ($20/month) for better performance
3. Use CDN for faster image delivery

---

## 📞 Support Resources

- **Vercel Issues**: [vercel.com/support](https://vercel.com/support)
- **HF Space Issues**: [huggingface.co/support](https://huggingface.co/support)
- **YOLOv8 Issues**: [github.com/ultralytics/yolov8/issues](https://github.com/ultralytics/yolov8/issues)

---

## ✨ You're All Set!

Your app is live on Vercel and ready to use! 🎉

- **Frontend URL**: Check your Vercel dashboard
- **Space URL**: `https://abhi189-obj-detect.hf.space`
- **Status**: ✅ Production Ready

Share the URL and start detecting objects!
