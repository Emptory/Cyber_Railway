#!/bin/bash

echo "================================================"
echo "    Network Railway System - Backend Camera Server"
echo "================================================"
echo ""
echo "Version: 1.0.0 - Local Camera Access Service"
echo "Supported Devices: /dev/video0, /dev/video1, /dev/video2..."
echo ""

# �л����ű�Ŀ¼
cd "$(dirname "$0")"

echo "Current Directory: $(pwd)"
echo ""

# ���Python����
echo "Checking Python Environment and Dependencies..."
if ! command -v python3 &> /dev/null; then
    echo "Error: Python3 Not Found"
    exit 1
fi

# ����Ƿ������⻷��
if [ ! -d "venv" ]; then
    echo "Creating Python Virtual Environment..."
    python3 -m venv venv
fi

# �������⻷��
echo "Activating Virtual Environment..."
source venv/bin/activate

# ��װ����
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

# ����������
python3 camera_server.py
