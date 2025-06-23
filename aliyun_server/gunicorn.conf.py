bind = "0.0.0.0:5000"
workers = 4
worker_class = "sync"
worker_connections = 1000
timeout = 60
keepalive = 2
max_requests = 1000
max_requests_jitter = 100

# 日志配置
accesslog = "logs/access.log"
errorlog = "logs/error.log"
loglevel = "info"

# 进程管理
preload_app = True
daemon = False
pidfile = "gunicorn.pid"

# 资源限制
worker_tmp_dir = "/dev/shm"  # 使用内存文件系统
tmp_upload_dir = None
