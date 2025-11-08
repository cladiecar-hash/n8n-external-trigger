@echo off
REM ========================================
REM  Open App in Browser
REM ========================================

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║  🌐 Opening app in browser...                           ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

REM Check if server is running
curl -s http://localhost:8000/api/health >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Server is not running
    echo.
    echo Starting server first...
    echo.
    start "Flask Server" cmd /k start-server.bat
    echo Waiting 5 seconds for server to start...
    timeout /t 5 /nobreak >nul
)

echo Opening http://localhost:8000 in your default browser...
echo.

start http://localhost:8000

echo.
echo ✅ App opened!
echo.
echo 📝 If the server is not running, run start-server.bat first
echo.

timeout /t 3 /nobreak >nul
