# Cyber Railway �����Ʒ�������

## ����

���� Cyber Railway ��Ŀ�İ����Ʒ������ˣ����ڽ��ա��洢�͹���� AidLux �ͻ��˴��������ģ�����ݡ�

## ����ջ

- **Web���**: Flask 3.0
- **���ݿ�**: MySQL (������RDS)
- **ORM**: SQLAlchemy
- **Web������**: Gunicorn + Nginx
- **��־**: Loguru

## ��������

- ? **���ݽ���**: REST API����ģ������
- ? **���ݴ洢**: MySQL���ݿ�־û��洢
- ? **���ݲ�ѯ**: ֧�ַ�ҳ��ɸѡ��ͳ��
- ? **��־��¼**: ��ϸ�Ĳ����ʹ�����־
- ? **�������**: ����״̬��ؽӿ�
- ? **�߿���**: Gunicorn����� + Nginx�������

## API �ӿ�

### 1. �������
```http
GET /api/health
```

**��Ӧ:**
```json
{
  "status": "healthy",
  "timestamp": "2025-06-24T10:00:00Z",
  "version": "1.0"
}
```

### 2. �����ϴ�
```http
POST /api/v1/data/upload
Content-Type: application/json
```

**������:**
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

**��Ӧ:**
```json
{
  "success": true,
  "message": "�����ϴ��ɹ�",
  "data_id": "data_20250624_100000",
  "received_at": "2025-06-24T10:00:01Z"
}
```

### 3. ���ݲ�ѯ
```http
GET /api/v1/data?page=1&per_page=20&status=received
```

### 4. ��������
```http
GET /api/v1/data/{data_id}
```

### 5. ͳ����Ϣ
```http
GET /api/v1/stats
```

## ���ݿ����

### model_data ��
| �ֶ� | ���� | ˵�� |
|-----|------|------|
| id | INT | ����ID |
| data_id | VARCHAR(255) | ����Ψһ��ʶ |
| source | VARCHAR(100) | ������Դ |
| original_timestamp | DATETIME | ԭʼʱ��� |
| received_timestamp | DATETIME | ����ʱ��� |
| raw_data | JSON | ԭʼ���� |
| processed_data | JSON | ��������� |
| metadata | JSON | Ԫ���� |
| status | VARCHAR(50) | ״̬ |
| data_size | INT | ���ݴ�С |

### upload_logs ��
| �ֶ� | ���� | ˵�� |
|-----|------|------|
| id | INT | ����ID |
| data_id | VARCHAR(255) | ��������ID |
| ip_address | VARCHAR(45) | �ͻ���IP |
| user_agent | VARCHAR(500) | �û����� |
| upload_time | DATETIME | �ϴ�ʱ�� |
| status | VARCHAR(50) | �ϴ�״̬ |
| error_message | TEXT | ������Ϣ |

## ����ָ��

### 1. ��������Դ׼��

#### ECS ʵ��
- **����**: 2��4GB���Ƽ� 4��8GB��
- **����ϵͳ**: Ubuntu 20.04 LTS
- **����**: ���ð�ȫ�鿪��80��443�˿�

#### RDS ���ݿ�
- **����**: MySQL 8.0
- **����**: 2��4GB�������棩
- **�洢**: 20GB SSD

#### ������SSL֤��
- �ڰ�������������
- �������SSL֤��

### 2. ��������������

```bash
# ����ϵͳ
sudo apt update && sudo apt upgrade -y

# ��װPython�ͱ�Ҫ����
sudo apt install python3 python3-pip python3-venv nginx -y

# ��װMySQL�ͻ���
sudo apt install mysql-client -y
```

### 3. ��Ŀ����

```bash
# 1. ��¡����
git clone <your-repo-url>
cd Cyber_Railway/aliyun_server

# 2. ���в���ű�
chmod +x deploy.sh
./deploy.sh

# 3. ���û�������
vim .env
# ��д���ݿ�������Ϣ�Ͱ���������

# 4. ��������
gunicorn --config gunicorn.conf.py app:app
```

### 4. Nginx ����

```bash
# ���������ļ�
sudo cp nginx.conf /etc/nginx/sites-available/cyber-railway
sudo ln -s /etc/nginx/sites-available/cyber-railway /etc/nginx/sites-enabled/

# ��������
sudo nginx -t

# ����Nginx
sudo systemctl restart nginx
```

### 5. ϵͳ��������

```bash
# ��װϵͳ����
sudo cp cyber-railway.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable cyber-railway
sudo systemctl start cyber-railway

# �鿴����״̬
sudo systemctl status cyber-railway
```

## ��غ�ά��

### ��־�鿴
```bash
# Ӧ����־
tail -f logs/server.log

# Gunicorn��־
tail -f logs/access.log
tail -f logs/error.log

# ϵͳ������־
sudo journalctl -u cyber-railway -f
```

### ���ݿ�ά��
```bash
# �������ݿ�
mysql -h your-rds-endpoint -u username -p

# �鿴����ͳ��
USE cyber_railway;
SELECT COUNT(*) FROM model_data;
SELECT status, COUNT(*) FROM model_data GROUP BY status;
```

### ���ܼ��
- ʹ�ð����Ƽ�ز鿴ECS��RDS����ָ��
- ���ø澯�������쳣���
- ���ڼ����̿ռ����־�ļ���С

## ��չ����

### �߿��ò���
1. **��ʵ������**: ʹ��SLB���ؾ�����ECSʵ��
2. **���ݿ�߿���**: RDS����ģʽ
3. **Redis����**: �������ݿ�ѹ��

### ���ݱ���
1. **RDS�Զ�����**: ����ÿ���Զ�����
2. **OSS����**: ���ڱ�����־�ļ���OSS

### ��ȫ�ӹ�
1. **WAF����**: ����WebӦ�÷���ǽ
2. **API����**: ʵ������Ƶ������
3. **���ʿ���**: ����IP������

## �ɱ�����

| ��Դ | ���� | �·��ã���Լ�� |
|-----|------|-------------|
| ECS | 2��4GB | ?100-200 |
| RDS | 2��4GB������ | ?200-300 |
| ���� | 5Mbps | ?50-100 |
| **�ܼ�** | | **?350-600** |

## �����ų�

### ��������

1. **���ݿ�����ʧ��**
   - ���RDS��ȫ������
   - ��֤���ݿ��û�������
   - ȷ��ECS��RDS������ͨ��

2. **Nginx 502����**
   - ���Gunicorn�����Ƿ���������
   - �鿴Ӧ����־�Ų����

3. **�ϴ�����ʧ��**
   - ��������ʽ�Ƿ���ȷ
   - �鿴��������־��ȡ��ϸ������Ϣ

### ��ϵ֧��
�������⣬��鿴��־�ļ�����ϵ��ά��Ա��
