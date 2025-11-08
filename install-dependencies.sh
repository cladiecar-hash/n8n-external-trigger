#!/bin/bash
# ========================================
#  Install Python Dependencies
# ========================================

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  📦 Installing Python Dependencies...                   ║"
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

echo "Current Python version:"
python3 --version
echo ""

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ ERROR: pip3 is not installed"
    echo ""
    echo "Please install pip3:"
    echo "  - Ubuntu/Debian: sudo apt install python3-pip"
    echo "  - Mac: pip should be included with Python"
    echo ""
    exit 1
fi

echo "Current pip version:"
pip3 --version
echo ""

# Check if requirements.txt exists
if [ ! -f "requirements.txt" ]; then
    echo "❌ ERROR: requirements.txt not found"
    exit 1
fi

echo "Installing packages from requirements.txt..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

pip3 install -r requirements.txt

if [ $? -ne 0 ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "❌ Installation failed"
    echo ""
    echo "Try running with sudo or check your internet connection"
    exit 1
else
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "✅ All dependencies installed successfully!"
    echo ""
    echo "Installed packages:"
    pip3 list | grep -i "flask\|cors"
    echo ""
fi
