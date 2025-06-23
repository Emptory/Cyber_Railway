# Cyber Railway - 数据传输服务

## 项目简介

Cyber Railway 是一个数据传输服务，用于从队友的 Python 模型服务获取数据，并可靠地传输到阿里云服务器。

### 架构设计

```
┌─────────────────┐    HTTP/API    ┌─────────────────┐    HTTPS     ┌─────────────────┐
│   队友模型服务   │  ────────────> │  数据传输服务    │  ──────────> │   阿里云服务器   │
│                │                │  (本项目)       │              │                │
└─────────────────┘                └─────────────────┘              └─────────────────┘
```

## 功能特性

- ? **自动数据获取**: 定时从模型服务拉取数据
- ? **数据验证处理**: 格式验证、数据清洗、标准化
- ? **可靠上传**: 重试机制、错误处理
- ? **配置管理**: YAML配置文件 + 环境变量
- ? **日志监控**: 详细的日志记录和错误追踪
- ? **健康检查**: 服务状态监控

## 快速开始

### 1. 环境准备

```bash
# 安装Python依赖
pip install -r requirements.txt
```

### 2. 配置设置

1. 复制并编辑环境变量文件：
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，填入你的阿里云凭证：
```env
ALIYUN_ACCESS_KEY_ID=your_access_key_id
ALIYUN_ACCESS_KEY_SECRET=your_access_key_secret
```

3. 编辑 `src/config/config.yaml`，配置服务地址：
```yaml
model_service:
  base_url: "http://localhost:8080"  # 队友模型服务地址

alibaba_cloud:
  server_url: "https://your-server.aliyun.com"  # 阿里云服务器地址
```

### 3. 运行服务

```bash
cd src
python main.py
```

## 配置说明

### 模型服务配置

```yaml
model_service:
  base_url: "http://localhost:8080"
  api_endpoints:
    get_data: "/api/model/data"      # 数据获取接口
    health_check: "/api/health"      # 健康检查接口
  timeout: 30
  retry_times: 3
```

### 阿里云配置

```yaml
alibaba_cloud:
  server_url: "https://your-server.aliyun.com"
  api_endpoints:
    upload_data: "/api/v1/data/upload"
  timeout: 60
  retry_times: 5
```

### 调度配置

```yaml
scheduler:
  fetch_interval: 60          # 数据获取间隔（秒）
  run_immediately: true       # 启动时立即执行一次
  max_workers: 3             # 最大并发任务数
```

## API 接口规范

### 队友模型服务需要提供的接口

#### 1. 数据获取接口
```http
GET /api/model/data
```

**响应格式：**
```json
{
  "timestamp": "2025-06-24T10:00:00Z",
  "data": {
    // 模型输出数据
  },
  "status": "success"
}
```

#### 2. 健康检查接口
```http
GET /api/health
```

**响应：**
```json
{
  "status": "healthy"
}
```

### 阿里云服务器接口

#### 数据上传接口
```http
POST /api/v1/data/upload
Content-Type: application/json
```

**请求格式：**
```json
{
  "timestamp": "2025-06-24T10:00:00Z",
  "data": {
    // 处理后的数据
  },
  "metadata": {
    "source": "cyber_railway_transfer",
    "version": "1.0",
    "data_size": 1024
  }
}
```

## 部署建议

### AidLux 部署

1. **环境准备**：
```bash
# 在 AidLux 终端中安装依赖
pip install -r requirements.txt
```

2. **后台运行**：
```bash
# 使用 nohup 后台运行
nohup python src/main.py > logs/app.log 2>&1 &
```

3. **开机自启**：
创建系统服务或使用 crontab：
```bash
@reboot cd /path/to/Cyber_Railway && python src/main.py
```

### 系统监控

- 日志文件位置：`logs/app.log`
- 错误日志：`logs/error.log`
- 进程监控：`ps aux | grep main.py`

## 故障排除

### 常见问题

1. **连接模型服务失败**
   - 检查 `config.yaml` 中的模型服务地址
   - 确认模型服务已启动且可访问

2. **上传阿里云失败**
   - 检查 `.env` 文件中的阿里云凭证
   - 确认网络连接正常
   - 查看错误日志获取详细信息

3. **数据验证失败**
   - 检查模型数据格式是否符合要求
   - 查看日志中的具体验证错误信息

### 日志级别

- `INFO`: 正常运行信息
- `WARNING`: 警告信息（不影响运行）
- `ERROR`: 错误信息（影响功能）
- `DEBUG`: 调试信息（详细）

## 开发说明

### 项目结构

```
src/
├── main.py                 # 主程序入口
├── config/                 # 配置模块
├── data_transfer/          # 数据传输模块
├── scheduler/              # 任务调度模块
└── utils/                  # 工具模块
```

### 扩展开发

1. **添加新的数据处理逻辑**：修改 `data_transfer/data_processor.py`
2. **修改调度策略**：修改 `scheduler/task_scheduler.py`
3. **添加新的客户端**：在 `data_transfer/` 目录下添加新的客户端类

## 许可证

MIT License