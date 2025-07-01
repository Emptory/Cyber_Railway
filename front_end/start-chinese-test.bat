@echo off
chcp 65001 >nul
title 智慧铁路系统 - Cyber Railway System
echo.
echo =====================================================
echo           智慧铁路系统 - Cyber Railway System
echo =====================================================
echo.
echo 正在启动开发服务器...
echo Starting development server...
echo.
cd /d "d:\Git\repository\Cyber_Railway\front_end"
echo 当前目录: %CD%
echo.
echo 检查 Node.js 版本:
node --version
echo.
echo 检查 NPM 版本:
npm --version
echo.
echo 启动 Vite 开发服务器...
npm run dev
echo.
echo 按任意键退出...
pause >nul
