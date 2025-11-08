@echo off
REM ========================================
REM  Start Flask Server + ngrok
REM ========================================

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║  🚀 Starting Flask Server and ngrok...                  ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

REM Navigate to script directory
cd /d "%~dp0"

echo Starting Flask server in a new window...
start "Flask Server - Google Drive PDF Webhook" cmd /k start-server.bat

echo Waiting 3 seconds for server to start...
timeout /t 3 /nobreak >nul

echo Starting ngrok in a new window...
start "ngrok - Expose Localhost" cmd /k start-ngrok.bat

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo ✅ Both services started in separate windows!
echo.
echo 📝 Next steps:
echo    1. Check the ngrok window for the HTTPS URL
echo    2. Copy the URL (e.g., https://abc123.ngrok-free.app)
echo    3. Open http://localhost:8000 in your browser
echo    4. Go to Settings and configure:
echo       - Callback URL: https://abc123.ngrok-free.app/api/callback
echo       - Save configuration
echo.
echo 🌐 Open ngrok web interface: http://127.0.0.1:4040
echo 🌐 Open app: http://localhost:8000
echo.
echo 🛑 Close both windows when you're done
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

pause
