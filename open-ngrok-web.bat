@echo off
REM ========================================
REM  Open ngrok Web Interface
REM ========================================

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║  🌐 Opening ngrok Web Interface...                      ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

echo Opening http://127.0.0.1:4040 in your browser...
echo.

start http://127.0.0.1:4040

echo.
echo ✅ ngrok web interface opened!
echo.
echo 📝 This interface shows:
echo    - All HTTP requests received via ngrok
echo    - Request/response details
echo    - Timing information
echo.
echo ⚠️  If the page doesn't load:
echo    - Make sure ngrok is running (run start-ngrok.bat)
echo    - ngrok must be active for the web interface to work
echo.

timeout /t 3 /nobreak >nul
