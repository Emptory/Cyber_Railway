#!/bin/bash

# AI�������������ű�

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$SCRIPT_DIR/ai_detection.log"

echo "����AI��������..."
echo "��־�ļ�: $LOG_FILE"

# �л����ű�Ŀ¼
cd "$SCRIPT_DIR"

# ���Python����
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "����: δ�ҵ�Python����"
    exit 1
fi

echo "ʹ��Python����: $PYTHON_CMD"

# ��װ����
echo "��鲢��װ����..."
$PYTHON_CMD -m pip install flask flask-cors opencv-python pillow numpy torch torchvision

# ����������
echo "����AI�������� (�˿�: 5001)..."
$PYTHON_CMD ai_detection_server.py 2>&1 | tee -a "$LOG_FILE"
