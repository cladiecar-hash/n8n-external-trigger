@echo off
REM ========================================
REM  Stop All Services
REM ========================================

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║  🛑 Stopping all services...                            ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

echo Stopping Flask server...
taskkill /FI "WINDOWTITLE eq Flask Server*" /T /F >nul 2>&1
if errorlevel 1 (
    echo ⚠️  No Flask server window found
) else (
    echo ✅ Flask server stopped
)

echo.
echo Stopping ngrok...
taskkill /FI "WINDOWTITLE eq ngrok*" /T /F >nul 2>&1
if errorlevel 1 (
    echo ⚠️  No ngrok window found
) else (
    echo ✅ ngrok stopped
)

echo.
echo Stopping any Python processes running server.py...
taskkill /FI "IMAGENAME eq python.exe" /FI "WINDOWTITLE eq *server*" /T /F >nul 2>&1

echo.
echo Stopping any ngrok processes...
taskkill /IM ngrok.exe /F >nul 2>&1

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo ✅ Cleanup completed!
echo.
echo All services should be stopped now.
echo You can safely close this window.
echo.

timeout /t 3 /nobreak >nul
