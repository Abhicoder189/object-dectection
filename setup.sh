#!/bin/bash

# YOLOv8 Deployment Setup Script
# This script prepares your project for Hugging Face deployment

echo "🚀 YOLOv8 Deployment Setup Script"
echo "=================================="

# Check if required files exist
echo ""
echo "Checking files..."

if [ -f "backend/app.py" ]; then
    echo "✅ backend/app.py found"
else
    echo "❌ backend/app.py not found"
fi

if [ -f "backend/requirements_hf.txt" ]; then
    echo "✅ backend/requirements_hf.txt found"
else
    echo "❌ backend/requirements_hf.txt not found"
fi

if [ -f "backend/yolov8n.pt" ]; then
    echo "✅ backend/yolov8n.pt found"
else
    echo "⚠️  backend/yolov8n.pt not found (will be auto-downloaded)"
fi

# Show configuration instructions
echo ""
echo "📋 Next Steps:"
echo "1. Go to https://huggingface.co/spaces"
echo "2. Click 'Create new Space'"
echo "3. Choose 'Gradio' SDK"
echo "4. Upload app.py and requirements.txt"
echo "5. Get your Space URL (format: https://username-spacename.hf.space)"
echo "6. Update frontend/src/App.js with your Space URL"
echo ""
echo "For detailed instructions, see DEPLOYMENT_GUIDE.md or QUICK_START.md"
echo ""
echo "✅ Setup complete!"
