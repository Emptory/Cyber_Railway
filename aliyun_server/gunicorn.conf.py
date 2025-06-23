bind = "0.0.0.0:5000"
workers = 4
worker_class = "sync"
worker_connections = 1000
timeout = 60
keepalive = 2
max_requests = 1000
max_requests_jitter = 100

# ��־����
accesslog = "logs/access.log"
errorlog = "logs/error.log"
loglevel = "info"

# ���̹���
preload_app = True
daemon = False
pidfile = "gunicorn.pid"

# ��Դ����
worker_tmp_dir = "/dev/shm"  # ʹ���ڴ��ļ�ϵͳ
tmp_upload_dir = None
