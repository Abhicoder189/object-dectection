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

## 3) Environment variables (optional)

The frontend already auto-selects API URL:
- Local: `http://localhost:8000`
- Vercel: `/api`

If you want to override it, add this variable in Vercel:
- `REACT_APP_API_BASE_URL` = `/api`

## 4) Deploy

Click **Deploy**.

## 5) Verify

After deployment:
1. Open your Vercel URL.
2. Upload an image.
3. Click **Detect**.
4. Confirm the result image appears.

## Notes

- API requests route through `/api/*` to `api/index.py`, which exports your FastAPI app from `backend/main.py`.
- If deployment fails due to model/runtime limits, use a smaller model or move inference to a dedicated backend service and keep Vercel for frontend only.
