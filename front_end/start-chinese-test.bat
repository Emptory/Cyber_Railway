@echo off
chcp 65001 >nul
title �ǻ���·ϵͳ - Cyber Railway System
echo.
echo =====================================================
echo           �ǻ���·ϵͳ - Cyber Railway System
echo =====================================================
echo.
echo ������������������...
echo Starting development server...
echo.
cd /d "d:\Git\repository\Cyber_Railway\front_end"
echo ��ǰĿ¼: %CD%
echo.
echo ��� Node.js �汾:
node --version
echo.
echo ��� NPM �汾:
npm --version
echo.
echo ���� Vite ����������...
npm run dev
echo.
echo ��������˳�...
pause >nul
