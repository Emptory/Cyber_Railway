@echo off
chcp 65001 >nul
echo Starting Cyber Railway React Development Server with UTF-8 encoding...
echo.
echo If Chinese characters appear as question marks, please ensure:
echo 1. Your terminal/command prompt supports UTF-8
echo 2. Your browser is set to UTF-8 encoding
echo 3. All source files are saved as UTF-8 without BOM
echo.
npm run dev
pause
