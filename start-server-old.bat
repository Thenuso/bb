@echo off
echo ========================================
echo    Bulldog Stream - Local Server
echo ========================================
echo.
echo Starting local server on port 8000...
echo.
echo Open your browser and go to:
echo http://localhost:8000/home.htm
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

cd /d "%~dp0"

REM Try Python 3 first, then Python 2
python --version >nul 2>&1
if %errorlevel% == 0 (
    python -m http.server 8000
) else (
    python2 --version >nul 2>&1
    if %errorlevel% == 0 (
        python2 -m SimpleHTTPServer 8000
    ) else (
        echo Python is not installed or not in PATH
        echo Please install Python or open home.htm directly in your browser
        pause
    )
)

pause
