#!/bin/bash
# ========================================
#  Start ngrok
# ========================================

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  🌐 Starting ngrok...                                    ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "❌ ERROR: ngrok is not installed"
    echo ""
    echo "Please install ngrok:"
    echo "  - Download from https://ngrok.com/download"
    echo "  - Or use package manager:"
    echo "    - Mac: brew install ngrok/ngrok/ngrok"
    echo "    - Linux: See NGROK-SETUP.md for instructions"
    echo ""
    exit 1
fi

echo ""
echo "✅ Starting ngrok tunnel to http://localhost:8000"
echo ""
echo "📝 IMPORTANT:"
echo "   1. Copy the HTTPS URL from ngrok (e.g., https://abc123.ngrok-free.app)"
echo "   2. Go to app Settings and paste it in \"Callback URL\""
echo "   3. Add /api/callback at the end"
echo "   4. Example: https://abc123.ngrok-free.app/api/callback"
echo ""
echo "🌐 ngrok Web Interface: http://127.0.0.1:4040"
echo "   Open this in your browser to monitor requests"
echo ""
echo "🛑 Press CTRL+C to stop ngrok"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start ngrok
ngrok http 8000
