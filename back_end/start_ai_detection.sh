#!/bin/bash

# AI检测服务器启动脚本

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$SCRIPT_DIR/ai_detection.log"

echo "启动AI检测服务器..."
echo "日志文件: $LOG_FILE"

# 切换到脚本目录
cd "$SCRIPT_DIR"

# 检查Python环境
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "错误: 未找到Python环境"
    exit 1
fi

echo "使用Python命令: $PYTHON_CMD"

# 安装依赖
echo "检查并安装依赖..."
$PYTHON_CMD -m pip install flask flask-cors opencv-python pillow numpy torch torchvision

# 启动服务器
echo "启动AI检测服务器 (端口: 5001)..."
$PYTHON_CMD ai_detection_server.py 2>&1 | tee -a "$LOG_FILE"
