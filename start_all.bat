@echo off
echo Starting Cyber Railway Detection System...

echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d server && python image_server.py"

echo.
echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend Development Server...
start "Frontend Server" cmd /k "cd /d front_end && npm run dev"

echo.
echo System Started!
echo Backend API: http://localhost:8081
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause >nul
