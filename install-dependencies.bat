@echo off
REM ========================================
REM  Install Python Dependencies
REM ========================================

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║  📦 Installing Python Dependencies...                   ║
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

echo Current Python version:
python --version
echo.

REM Check if pip is installed
pip --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: pip is not installed
    echo.
    echo Please reinstall Python with pip included
    pause
    exit /b 1
)

echo Current pip version:
pip --version
echo.

REM Check if requirements.txt exists
if not exist "requirements.txt" (
    echo ❌ ERROR: requirements.txt not found
    pause
    exit /b 1
)

echo Installing packages from requirements.txt...
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

pip install -r requirements.txt

if errorlevel 1 (
    echo.
    echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    echo.
    echo ❌ Installation failed
    echo.
    echo Try running as Administrator or check your internet connection
    pause
    exit /b 1
) else (
    echo.
    echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    echo.
    echo ✅ All dependencies installed successfully!
    echo.
    echo Installed packages:
    pip list | findstr "Flask flask-cors"
    echo.
)

pause
