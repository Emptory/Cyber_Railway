#!/bin/bash

# Cyber Railway �����Ʒ���������ű�

set -e

echo "��ʼ���� Cyber Railway ��������..."

# 1. ��� Python ����
if ! command -v python3 &> /dev/null; then
    echo "? Python3 δ��װ�����Ȱ�װ Python3"
    exit 1
fi

# 2. �������⻷��
echo "? ���� Python ���⻷��..."
python3 -m venv venv
source venv/bin/activate

# 3. ���� pip
echo "? ���� pip..."
pip install --upgrade pip

# 4. ��װ����
echo "? ��װ��Ŀ����..."
pip install -r requirements.txt

# 5. ������ҪĿ¼
echo "? ������ҪĿ¼..."
mkdir -p logs
mkdir -p migrations

# 6. ��黷�������ļ�
if [ ! -f ".env" ]; then
    echo "?? .env �ļ������ڣ��������û�������"
    echo "���� .env.example �� .env ����д����"
    exit 1
fi

# 7. ��ʼ�����ݿ�
echo "?? ��ʼ�����ݿ�..."
export FLASK_APP=app.py
flask db init || echo "���ݿ��ѳ�ʼ��"
flask db migrate -m "Initial migration" || echo "Ǩ���ļ��Ѵ���"
flask db upgrade

# 8. ��������
echo "? ���Է���������..."
python -c "
import app
with app.app.app_context():
    app.db.create_all()
    print('? ���ݿ����ӳɹ�')
"

# 9. ����ϵͳ�����ļ�����ѡ��
echo "? ����ϵͳ�����ļ�..."
cat > cyber-railway.service << EOF
[Unit]
Description=Cyber Railway Data Server
After=network.target

[Service]
Type=notify
User=www-data
Group=www-data
WorkingDirectory=$(pwd)
Environment=PATH=$(pwd)/venv/bin
ExecStart=$(pwd)/venv/bin/gunicorn --config gunicorn.conf.py app:app
ExecReload=/bin/kill -s HUP \$MAINPID
Restart=always

[Install]
WantedBy=multi-user.target
EOF

echo "? ������ɣ�"
echo ""
echo "��������"
echo "  ����ģʽ: python app.py"
echo "  ����ģʽ: gunicorn --config gunicorn.conf.py app:app"
echo ""
echo "��װϵͳ���񣨿�ѡ����"
echo "  sudo cp cyber-railway.service /etc/systemd/system/"
echo "  sudo systemctl enable cyber-railway"
echo "  sudo systemctl start cyber-railway"
echo ""
echo "�鿴��־��"
echo "  tail -f logs/server.log"
