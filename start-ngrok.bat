@echo off
REM ========================================
REM  Start ngrok
REM ========================================

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║  🌐 Starting ngrok...                                    ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

REM Check if ngrok is installed
ngrok version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: ngrok is not installed or not in PATH
    echo.
    echo Please install ngrok:
    echo 1. Go to https://ngrok.com/download
    echo 2. Download ngrok for Windows
    echo 3. Extract ngrok.exe to a folder (e.g., C:\ngrok\)
    echo 4. Add that folder to your PATH environment variable
    echo.
    echo Or download and extract ngrok.exe to this folder
    pause
    exit /b 1
)

REM Check if ngrok is authenticated
ngrok config check >nul 2>&1
if errorlevel 1 (
    echo.
    echo ⚠️  ngrok is not authenticated
    echo.
    echo Please authenticate ngrok:
    echo 1. Go to https://dashboard.ngrok.com/get-started/your-authtoken
    echo 2. Copy your authtoken
    echo 3. Run: ngrok config add-authtoken YOUR_TOKEN_HERE
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Starting ngrok tunnel to http://localhost:8000
echo.
echo 📝 IMPORTANT:
echo    1. Copy the HTTPS URL from ngrok (e.g., https://abc123.ngrok-free.app)
echo    2. Go to app Settings and paste it in "Callback URL"
echo    3. Add /api/callback at the end
echo    4. Example: https://abc123.ngrok-free.app/api/callback
echo.
echo 🌐 ngrok Web Interface: http://127.0.0.1:4040
echo    Open this in your browser to monitor requests
echo.
echo 🛑 Press CTRL+C to stop ngrok
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Start ngrok
ngrok http 8000

pause
