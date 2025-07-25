@echo off
:: Bulldog Stream Platform - Development Setup Script (Windows)
:: This script helps you get started quickly with development on Windows

title Bulldog Stream Platform - Development Setup

echo.
echo ============================================
echo 🎬 Bulldog Stream Platform - Development Setup
echo ============================================
echo.

:: Check if Node.js is installed
echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js 16+ from https://nodejs.org/
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✅ Node.js found: %NODE_VERSION%
)

:: Check if npm is installed
echo Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm not found. Please install npm
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo ✅ npm found: %NPM_VERSION%
)

echo.
echo Installing project dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
) else (
    echo ✅ Dependencies installed successfully
)

echo.
echo Setting up environment configuration...
if not exist ".env" (
    copy ".env.example" ".env" >nul
    echo ✅ Environment file created from template
    echo ⚠️  Please edit .env file with your actual configuration values
) else (
    echo ✅ Environment file already exists
)

echo.
echo Creating necessary directories...
if not exist "logs" mkdir logs
if not exist "uploads" mkdir uploads
if not exist "uploads\videos" mkdir uploads\videos
if not exist "uploads\images" mkdir uploads\images
if not exist "dist" mkdir dist
echo ✅ Directories created

echo.
echo ============================================
echo 🎯 Database Setup Instructions
echo ============================================
echo.
echo 1. Go to https://supabase.com and create a free account
echo 2. Create a new project
echo 3. Go to Settings ^> API to get your project URL and keys
echo 4. Go to SQL Editor and run the contents of database-schema.sql
echo 5. Update your .env file with the credentials
echo.

echo ============================================
echo 🚀 Next Steps
echo ============================================
echo.
echo 1. Configure your database (see instructions above)
echo 2. Edit .env file with your actual values
echo 3. Run: npm run dev
echo 4. Open: http://localhost:3000
echo.
echo ✅ Setup complete! Happy coding! 🎬
echo.

pause
