@echo off
echo.
echo ========================================
echo   Google Drive PDF to n8n - Server
echo ========================================
echo.
echo Avvio server locale...
echo.

REM Verifica Python 3
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Python trovato!
    echo.
    echo Server avviato su: http://localhost:8000
    echo.
    echo Apri il browser e vai su: http://localhost:8000
    echo.
    echo Per fermare il server: premi CTRL+C
    echo.
    python -m http.server 8000
) else (
    echo Python non trovato!
    echo.
    echo Scarica Python da: https://www.python.org/downloads/
    echo Durante l'installazione, spunta "Add Python to PATH"
    echo.
    echo Oppure apri index.html con doppio click
    echo.
    pause
)
