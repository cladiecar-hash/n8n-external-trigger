#!/bin/bash
# ========================================
#  Start Flask Server
# ========================================

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  🚀 Starting Flask Server...                            ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Navigate to script directory
cd "$(dirname "$0")"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ ERROR: Python 3 is not installed"
    echo ""
    echo "Please install Python 3:"
    echo "  - Ubuntu/Debian: sudo apt install python3 python3-pip"
    echo "  - Mac: brew install python3"
    echo ""
    exit 1
fi

# Check if server.py exists
if [ ! -f "server.py" ]; then
    echo "❌ ERROR: server.py not found"
    echo "Make sure you're in the correct directory"
    exit 1
fi

# Check if dependencies are installed
if ! python3 -c "import flask" &> /dev/null; then
    echo ""
    echo "⚠️  Flask is not installed"
    echo "Installing dependencies..."
    echo ""
    pip3 install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo ""
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

echo ""
echo "✅ Starting Flask server on http://localhost:8000"
echo ""
echo "📝 Keep this terminal open while using the app"
echo "🛑 Press CTRL+C to stop the server"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start the server
python3 server.py
