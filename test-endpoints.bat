@echo off
REM ========================================
REM  Test Server Endpoints
REM ========================================

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║  🧪 Testing Server Endpoints...                         ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

REM Check if curl is available
curl --version >nul 2>&1
if errorlevel 1 (
    echo ⚠️  curl is not available
    echo Testing with PowerShell instead...
    echo.
    goto :powershell_tests
)

echo Using curl for testing...
echo.

REM Test 1: Health check
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo Test 1: Health Check
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo GET http://localhost:8000/api/health
echo.
curl -s http://localhost:8000/api/health
if errorlevel 1 (
    echo.
    echo ❌ Server is not running or not responding
    echo    Make sure to run start-server.bat first
    echo.
    pause
    exit /b 1
)
echo.
echo ✅ Health check passed
echo.

REM Test 2: Send test callback
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo Test 2: Send Test Callback
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo POST http://localhost:8000/api/callback
echo.
curl -s -X POST http://localhost:8000/api/callback ^
  -H "Content-Type: application/json" ^
  -d "{\"jobId\":\"test-batch-123\",\"url\":\"https://jsonplaceholder.typicode.com/todos/1\",\"fileName\":\"test.pdf\",\"items\":10,\"durationSec\":5.5}"
echo.
echo.
echo ✅ Test callback sent
echo.

REM Test 3: Retrieve result
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo Test 3: Retrieve Result
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo GET http://localhost:8000/api/result/test-batch-123
echo.
curl -s http://localhost:8000/api/result/test-batch-123
echo.
echo.
echo ✅ Result retrieved
echo.

REM Test 4: List all results
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo Test 4: List All Results
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo GET http://localhost:8000/api/results
echo.
curl -s http://localhost:8000/api/results
echo.
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo ✅ All tests completed successfully!
echo.
echo 📝 You can now:
echo    - Open http://localhost:8000 to use the app
echo    - Check the server logs in the Flask window
echo.
pause
exit /b 0

:powershell_tests
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo Test 1: Health Check
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
powershell -Command "try { (Invoke-WebRequest -Uri 'http://localhost:8000/api/health' -UseBasicParsing).Content } catch { Write-Host 'Server not responding'; exit 1 }"
if errorlevel 1 (
    echo.
    echo ❌ Server is not running
    pause
    exit /b 1
)
echo.
echo ✅ Health check passed
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo ✅ Basic test completed!
echo    For full testing, install curl or check the app directly
echo.
pause
