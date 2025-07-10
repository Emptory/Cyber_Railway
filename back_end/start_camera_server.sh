#!/bin/bash

echo "================================================"
echo "    Network Railway System - Backend Camera Server"
echo "================================================"
echo ""
echo "Version: 1.0.0 - Local Camera Access Service"
echo "Supported Devices: /dev/video0, /dev/video1, /dev/video2..."
echo ""

# 切换到脚本目录
cd "$(dirname "$0")"

echo "Current Directory: $(pwd)"
echo ""

# 检查Python依赖
echo "Checking Python Environment and Dependencies..."
if ! command -v python3 &> /dev/null; then
    echo "Error: Python3 Not Found"
    exit 1
fi

# 检查是否有虚拟环境
if [ ! -d "venv" ]; then
    echo "Creating Python Virtual Environment..."
    python3 -m venv venv
fi

# 激活虚拟环境
echo "Activating Virtual Environment..."
source venv/bin/activate

# 安装依赖
echo "Installing Python Dependencies..."
pip install -r requirements.txt

echo ""
echo "Checking Camera Devices..."
ls -la /dev/video* 2>/dev/null || echo "Warning: No Video Devices Found"

echo ""
echo "Starting Camera Server..."
echo "API Address: http://localhost:8888"
echo "Frontend Connection: http://localhost:9999"
echo ""
echo "Press Ctrl+C to Stop Server"
echo "================================================"

# 启动服务器
python3 camera_server.py
