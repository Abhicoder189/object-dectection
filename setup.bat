@echo off
REM YOLOv8 Deployment Setup Script for Windows

echo.
echo 🚀 YOLOv8 Deployment Setup Script
echo ==================================
echo.

REM Check if required files exist
echo Checking files...

if exist "backend\app.py" (
    echo ✅ backend\app.py found
) else (
    echo ❌ backend\app.py not found
)

if exist "backend\requirements_hf.txt" (
    echo ✅ backend\requirements_hf.txt found
) else (
    echo ❌ backend\requirements_hf.txt not found
)

if exist "backend\yolov8n.pt" (
    echo ✅ backend\yolov8n.pt found
) else (
    echo ⚠️  backend\yolov8n.pt not found - will be auto-downloaded
)

echo.
echo 📋 Next Steps:
echo 1. Go to https://huggingface.co/spaces
echo 2. Click 'Create new Space'
echo 3. Choose 'Gradio' SDK
echo 4. Upload app.py and requirements.txt
echo 5. Get your Space URL (format: https://username-spacename.hf.space)
echo 6. Update frontend\src\App.js with your Space URL
echo.
echo For detailed instructions, see DEPLOYMENT_GUIDE.md or QUICK_START.md
echo.
echo ✅ Setup complete!
echo.
pause
