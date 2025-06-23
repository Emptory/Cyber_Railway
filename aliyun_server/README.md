# Cyber Railway 阿里云服务器端

## 概述

这是 Cyber Railway 项目的阿里云服务器端，用于接收、存储和管理从 AidLux 客户端传输过来的模型数据。

## 技术栈

- **Web框架**: Flask 3.0
- **数据库**: MySQL (阿里云RDS)
- **ORM**: SQLAlchemy
- **Web服务器**: Gunicorn + Nginx
- **日志**: Loguru

## 功能特性

- ? **数据接收**: REST API接收模型数据
- ? **数据存储**: MySQL数据库持久化存储
- ? **数据查询**: 支持分页、筛选、统计
- ? **日志记录**: 详细的操作和错误日志
- ? **健康检查**: 服务状态监控接口
- ? **高可用**: Gunicorn多进程 + Nginx反向代理

## API 接口

### 1. 健康检查
```http
GET /api/health
```

**响应:**
```json
{
  "status": "healthy",
  "timestamp": "2025-06-24T10:00:00Z",
  "version": "1.0"
}
```

### 2. 数据上传
```http
POST /api/v1/data/upload
Content-Type: application/json
```

**请求体:**
```json
{
  "timestamp": "2025-06-24T10:00:00Z",
  "data": {
    "id": "data_20250624_100000",
    "model_output": {...},
    "confidence": 0.95
  },
  "metadata": {
    "source": "cyber_railway_transfer",
    "version": "1.0"
  }
}
```

**响应:**
```json
{
  "success": true,
  "message": "数据上传成功",
  "data_id": "data_20250624_100000",
  "received_at": "2025-06-24T10:00:01Z"
}
```

### 3. 数据查询
```http
GET /api/v1/data?page=1&per_page=20&status=received
```

### 4. 数据详情
```http
GET /api/v1/data/{data_id}
```

### 5. 统计信息
```http
GET /api/v1/stats
```

## 数据库设计

### model_data 表
| 字段 | 类型 | 说明 |
|-----|------|------|
| id | INT | 主键ID |
| data_id | VARCHAR(255) | 数据唯一标识 |
| source | VARCHAR(100) | 数据来源 |
| original_timestamp | DATETIME | 原始时间戳 |
| received_timestamp | DATETIME | 接收时间戳 |
| raw_data | JSON | 原始数据 |
| processed_data | JSON | 处理后数据 |
| metadata | JSON | 元数据 |
| status | VARCHAR(50) | 状态 |
| data_size | INT | 数据大小 |

### upload_logs 表
| 字段 | 类型 | 说明 |
|-----|------|------|
| id | INT | 主键ID |
| data_id | VARCHAR(255) | 关联数据ID |
| ip_address | VARCHAR(45) | 客户端IP |
| user_agent | VARCHAR(500) | 用户代理 |
| upload_time | DATETIME | 上传时间 |
| status | VARCHAR(50) | 上传状态 |
| error_message | TEXT | 错误信息 |

## 部署指南

### 1. 阿里云资源准备

#### ECS 实例
- **配置**: 2核4GB（推荐 4核8GB）
- **操作系统**: Ubuntu 20.04 LTS
- **网络**: 配置安全组开放80、443端口

#### RDS 数据库
- **引擎**: MySQL 8.0
- **配置**: 2核4GB（基础版）
- **存储**: 20GB SSD

#### 域名和SSL证书
- 在阿里云申请域名
- 申请免费SSL证书

### 2. 服务器环境配置

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装Python和必要工具
sudo apt install python3 python3-pip python3-venv nginx -y

# 安装MySQL客户端
sudo apt install mysql-client -y
```

### 3. 项目部署

```bash
# 1. 克隆代码
git clone <your-repo-url>
cd Cyber_Railway/aliyun_server

# 2. 运行部署脚本
chmod +x deploy.sh
./deploy.sh

# 3. 配置环境变量
vim .env
# 填写数据库连接信息和阿里云配置

# 4. 启动服务
gunicorn --config gunicorn.conf.py app:app
```

### 4. Nginx 配置

```bash
# 复制配置文件
sudo cp nginx.conf /etc/nginx/sites-available/cyber-railway
sudo ln -s /etc/nginx/sites-available/cyber-railway /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

### 5. 系统服务配置

```bash
# 安装系统服务
sudo cp cyber-railway.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable cyber-railway
sudo systemctl start cyber-railway

# 查看服务状态
sudo systemctl status cyber-railway
```

## 监控和维护

### 日志查看
```bash
# 应用日志
tail -f logs/server.log

# Gunicorn日志
tail -f logs/access.log
tail -f logs/error.log

# 系统服务日志
sudo journalctl -u cyber-railway -f
```

### 数据库维护
```bash
# 连接数据库
mysql -h your-rds-endpoint -u username -p

# 查看数据统计
USE cyber_railway;
SELECT COUNT(*) FROM model_data;
SELECT status, COUNT(*) FROM model_data GROUP BY status;
```

### 性能监控
- 使用阿里云监控查看ECS和RDS性能指标
- 配置告警规则监控异常情况
- 定期检查磁盘空间和日志文件大小

## 扩展建议

### 高可用部署
1. **多实例部署**: 使用SLB负载均衡多个ECS实例
2. **数据库高可用**: RDS主从模式
3. **Redis缓存**: 减轻数据库压力

### 数据备份
1. **RDS自动备份**: 配置每日自动备份
2. **OSS备份**: 定期备份日志文件到OSS

### 安全加固
1. **WAF防护**: 配置Web应用防火墙
2. **API限流**: 实现请求频率限制
3. **访问控制**: 配置IP白名单

## 成本估算

| 资源 | 配置 | 月费用（大约） |
|-----|------|-------------|
| ECS | 2核4GB | ?100-200 |
| RDS | 2核4GB基础版 | ?200-300 |
| 带宽 | 5Mbps | ?50-100 |
| **总计** | | **?350-600** |

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查RDS安全组配置
   - 验证数据库用户名密码
   - 确认ECS与RDS网络连通性

2. **Nginx 502错误**
   - 检查Gunicorn进程是否正常运行
   - 查看应用日志排查错误

3. **上传数据失败**
   - 检查请求格式是否正确
   - 查看服务器日志获取详细错误信息

### 联系支持
如有问题，请查看日志文件或联系运维人员。
