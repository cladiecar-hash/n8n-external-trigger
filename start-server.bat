@echo off
REM ========================================
REM  Start Flask Server
REM ========================================

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║  🚀 Starting Flask Server...                            ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

REM Navigate to script directory
cd /d "%~dp0"

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Python is not installed or not in PATH
    echo.
    echo Please install Python from https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

REM Check if server.py exists
if not exist "server.py" (
    echo ❌ ERROR: server.py not found
    echo Make sure you're in the correct directory
    pause
    exit /b 1
)

REM Check if dependencies are installed
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo.
    echo ⚠️  Flask is not installed
    echo Installing dependencies...
    echo.
    pip install -r requirements.txt
    if errorlevel 1 (
        echo.
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo ✅ Starting Flask server on http://localhost:8000
echo.
echo 📝 Keep this window open while using the app
echo 🛑 Press CTRL+C to stop the server
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Start the server
python server.py

pause
