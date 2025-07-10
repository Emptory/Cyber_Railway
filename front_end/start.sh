#!/bin/bash

echo "================================================"
echo "        Network Railway System - Frontend"
echo "================================================"
echo ""
echo "Version: 3.0.0 - Frontend Website (HTML/CSS/JS)"
echo "Compatibility: No Node.js required, runs directly"
echo ""
echo "Starting Web Server..."
echo "Server Address: http://localhost:9999"
echo ""
echo "Press Ctrl+C to Stop Server"
echo ""
echo "================================================"

# 切换到脚本目录
cd "$(dirname "$0")"

echo "Current Directory: $(pwd)"
echo "File List:"
ls -la

echo ""
echo "Starting Python HTTP Server (Port 9999)..."

# 检查Python版本并启动服务器
if command -v python3 &> /dev/null; then
    echo "Using Python 3..."
    python3 -m http.server 9999
elif command -v python &> /dev/null; then
    echo "Using Python 2..."
    python -m SimpleHTTPServer 9999
else
    echo "Error: Python Not Found"
    echo "Please install Python or open index.html directly in browser"
    echo ""
    echo "Or use other web servers:"
    echo "  - If Node.js installed: npx serve ."
    echo "  - If PHP installed: php -S localhost:9999"
    echo ""
    read -p "Press Enter to exit..."
    exit 1
fi
