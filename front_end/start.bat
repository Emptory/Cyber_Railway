@echo off
title Cyber Railway System - Frontend Server
color 0A
echo.
echo ================================================
echo        CYBER RAILWAY SYSTEM FRONTEND
echo ================================================
echo.
echo Version: 2.0.0
echo Compatibility: GB2312 Safe - No Encoding Issues
echo.
echo Starting development server...
echo Server will be available at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
echo ================================================

cd /d "%~dp0"

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

echo Starting Vite development server...
npm run dev

pause
