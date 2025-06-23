#!/bin/bash

# Cyber Railway 阿里云服务器部署脚本

set -e

echo "开始部署 Cyber Railway 服务器端..."

# 1. 检查 Python 环境
if ! command -v python3 &> /dev/null; then
    echo "? Python3 未安装，请先安装 Python3"
    exit 1
fi

# 2. 创建虚拟环境
echo "? 创建 Python 虚拟环境..."
python3 -m venv venv
source venv/bin/activate

# 3. 升级 pip
echo "? 升级 pip..."
pip install --upgrade pip

# 4. 安装依赖
echo "? 安装项目依赖..."
pip install -r requirements.txt

# 5. 创建必要目录
echo "? 创建必要目录..."
mkdir -p logs
mkdir -p migrations

# 6. 检查环境变量文件
if [ ! -f ".env" ]; then
    echo "?? .env 文件不存在，请先配置环境变量"
    echo "复制 .env.example 到 .env 并填写配置"
    exit 1
fi

# 7. 初始化数据库
echo "?? 初始化数据库..."
export FLASK_APP=app.py
flask db init || echo "数据库已初始化"
flask db migrate -m "Initial migration" || echo "迁移文件已存在"
flask db upgrade

# 8. 测试配置
echo "? 测试服务器配置..."
python -c "
import app
with app.app.app_context():
    app.db.create_all()
    print('? 数据库连接成功')
"

# 9. 创建系统服务文件（可选）
echo "? 创建系统服务文件..."
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

echo "? 部署完成！"
echo ""
echo "启动服务："
echo "  开发模式: python app.py"
echo "  生产模式: gunicorn --config gunicorn.conf.py app:app"
echo ""
echo "安装系统服务（可选）："
echo "  sudo cp cyber-railway.service /etc/systemd/system/"
echo "  sudo systemctl enable cyber-railway"
echo "  sudo systemctl start cyber-railway"
echo ""
echo "查看日志："
echo "  tail -f logs/server.log"
