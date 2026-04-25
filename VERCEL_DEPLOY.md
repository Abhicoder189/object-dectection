# Deploy IMAGE CLASSIFIER on Vercel

## 1) Push project to GitHub

From project root:

```powershell
git add .
git commit -m "Prepare Vercel deployment"
git push
```

## 2) Create project in Vercel

1. Open Vercel Dashboard.
2. Click **Add New -> Project**.
3. Import your GitHub repository.
4. Keep **Root Directory** as project root (do not set it to `frontend`).
5. Leave build settings as detected from `vercel.json`.

## 3) Environment variables (required when backend is on Render)

In your Vercel project settings, add:
- `REACT_APP_API_BASE_URL` = `https://<your-render-service>.onrender.com`

Notes:
- Do not add a trailing slash.
- Example: `https://image-classifier-api.onrender.com`

## 4) Deploy

Click **Deploy**.

## 5) Verify

After deployment:
1. Open your Vercel URL.
2. Upload an image.
3. Click **Detect**.
4. Confirm the result image appears.

## Notes

- Frontend API requests go directly to your Render backend URL from `REACT_APP_API_BASE_URL`.
- If you update the env var, trigger a new Vercel deployment so the React build picks up the new value.
- If deployment fails due to model/runtime limits, keep inference on Render and use Vercel only for frontend hosting.
