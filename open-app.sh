#!/bin/bash
# ========================================
#  Open App in Browser
# ========================================

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  🌐 Opening app in browser...                           ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

echo "Opening http://localhost:8000 in your default browser..."
echo ""

# Detect OS and open browser
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open http://localhost:8000
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:8000
    elif command -v gnome-open &> /dev/null; then
        gnome-open http://localhost:8000
    else
        echo "⚠️  Could not detect browser opener"
        echo "Please open http://localhost:8000 manually in your browser"
    fi
else
    echo "⚠️  Unknown OS"
    echo "Please open http://localhost:8000 manually in your browser"
fi

echo ""
echo "✅ App should open shortly!"
echo ""
echo "📝 If the server is not running, run ./start-server.sh first"
echo ""
