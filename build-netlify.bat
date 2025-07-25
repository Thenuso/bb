@echo off
:: Netlify Build Script for Bulldog Stream Platform (Windows)
echo 🎬 Building Bulldog Stream Platform for Netlify...

:: Create dist directory
if not exist "dist" mkdir dist

:: Copy HTML files
echo 📄 Copying HTML files...
copy "index-production.html" "dist\index.html" >nul
copy "admin.htm" "dist\admin.html" >nul

:: Copy CSS files
echo 🎨 Copying CSS files...
copy "style-production.css" "dist\style.css" >nul
copy "style.css" "dist\style-legacy.css" >nul

:: Copy JavaScript files
echo ⚡ Copying JavaScript files...
copy "app-production.js" "dist\app.js" >nul
copy "backend.js" "dist\backend-legacy.js" >nul

:: Copy other assets
echo 📁 Copying assets...
copy "manifest.json" "dist\" >nul
copy "sw.js" "dist\" >nul

:: Create serverless functions directory
if not exist "netlify" mkdir netlify
if not exist "netlify\functions" mkdir netlify\functions

:: Create a simple API function for health check
echo Creating serverless functions...
(
echo exports.handler = async ^(event, context^) =^> {
echo   return {
echo     statusCode: 200,
echo     headers: {
echo       "Content-Type": "application/json",
echo       "Access-Control-Allow-Origin": "*"
echo     },
echo     body: JSON.stringify^({
echo       success: true,
echo       status: "healthy",
echo       message: "Bulldog Stream Platform API is running on Netlify",
echo       timestamp: new Date^(^).toISOString^(^),
echo       platform: "netlify"
echo     }^)
echo   };
echo };
) > "netlify\functions\health.js"

:: Create package.json for serverless functions
(
echo {
echo   "name": "netlify-functions",
echo   "version": "1.0.0",
echo   "dependencies": {
echo     "@supabase/supabase-js": "^2.39.0"
echo   }
echo }
) > "netlify\functions\package.json"

echo ✅ Build completed successfully!
echo 📦 Files ready for Netlify deployment in dist\ directory
echo.
echo 🚀 Deploy to Netlify:
echo    1. Drag and drop the dist\ folder to netlify.com
echo    2. Or connect your GitHub repo for auto-deployment
echo    3. Set environment variables in Netlify dashboard
echo.
pause
