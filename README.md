# Cyber Railway - ���ݴ������

## ��Ŀ���

Cyber Railway ��һ�����ݴ���������ڴӶ��ѵ� Python ģ�ͷ����ȡ���ݣ����ɿ��ش��䵽�����Ʒ�������

### �ܹ����

```
��������������������������������������    HTTP/API    ��������������������������������������    HTTPS     ��������������������������������������
��   ����ģ�ͷ���   ��  ������������������������> ��  ���ݴ������    ��  ��������������������> ��   �����Ʒ�����   ��
��                ��                ��  (����Ŀ)       ��              ��                ��
��������������������������������������                ��������������������������������������              ��������������������������������������
```

## ��������

- ? **�Զ����ݻ�ȡ**: ��ʱ��ģ�ͷ�����ȡ����
- ? **������֤����**: ��ʽ��֤��������ϴ����׼��
- ? **�ɿ��ϴ�**: ���Ի��ơ�������
- ? **���ù���**: YAML�����ļ� + ��������
- ? **��־���**: ��ϸ����־��¼�ʹ���׷��
- ? **�������**: ����״̬���

## ���ٿ�ʼ

### 1. ����׼��

```bash
# ��װPython����
pip install -r requirements.txt
```

### 2. ��������

1. ���Ʋ��༭���������ļ���
```bash
cp .env.example .env
```

2. �༭ `.env` �ļ���������İ�����ƾ֤��
```env
ALIYUN_ACCESS_KEY_ID=your_access_key_id
ALIYUN_ACCESS_KEY_SECRET=your_access_key_secret
```

3. �༭ `src/config/config.yaml`�����÷����ַ��
```yaml
model_service:
  base_url: "http://localhost:8080"  # ����ģ�ͷ����ַ

alibaba_cloud:
  server_url: "https://your-server.aliyun.com"  # �����Ʒ�������ַ
```

### 3. ���з���

```bash
cd src
python main.py
```

## ����˵��

### ģ�ͷ�������

```yaml
model_service:
  base_url: "http://localhost:8080"
  api_endpoints:
    get_data: "/api/model/data"      # ���ݻ�ȡ�ӿ�
    health_check: "/api/health"      # �������ӿ�
  timeout: 30
  retry_times: 3
```

### ����������

```yaml
alibaba_cloud:
  server_url: "https://your-server.aliyun.com"
  api_endpoints:
    upload_data: "/api/v1/data/upload"
  timeout: 60
  retry_times: 5
```

### ��������

```yaml
scheduler:
  fetch_interval: 60          # ���ݻ�ȡ������룩
  run_immediately: true       # ����ʱ����ִ��һ��
  max_workers: 3             # ��󲢷�������
```

## API �ӿڹ淶

### ����ģ�ͷ�����Ҫ�ṩ�Ľӿ�

#### 1. ���ݻ�ȡ�ӿ�
```http
GET /api/model/data
```

**��Ӧ��ʽ��**
```json
{
  "timestamp": "2025-06-24T10:00:00Z",
  "data": {
    // ģ���������
  },
  "status": "success"
}
```

#### 2. �������ӿ�
```http
GET /api/health
```

**��Ӧ��**
```json
{
  "status": "healthy"
}
```

### �����Ʒ������ӿ�

#### �����ϴ��ӿ�
```http
POST /api/v1/data/upload
Content-Type: application/json
```

**�����ʽ��**
```json
{
  "timestamp": "2025-06-24T10:00:00Z",
  "data": {
    // ����������
  },
  "metadata": {
    "source": "cyber_railway_transfer",
    "version": "1.0",
    "data_size": 1024
  }
}
```

## ������

### AidLux ����

1. **����׼��**��
```bash
# �� AidLux �ն��а�װ����
pip install -r requirements.txt
```

2. **��̨����**��
```bash
# ʹ�� nohup ��̨����
nohup python src/main.py > logs/app.log 2>&1 &
```

3. **��������**��
����ϵͳ�����ʹ�� crontab��
```bash
@reboot cd /path/to/Cyber_Railway && python src/main.py
```

### ϵͳ���

- ��־�ļ�λ�ã�`logs/app.log`
- ������־��`logs/error.log`
- ���̼�أ�`ps aux | grep main.py`

## �����ų�

### ��������

1. **����ģ�ͷ���ʧ��**
   - ��� `config.yaml` �е�ģ�ͷ����ַ
   - ȷ��ģ�ͷ����������ҿɷ���

2. **�ϴ�������ʧ��**
   - ��� `.env` �ļ��еİ�����ƾ֤
   - ȷ��������������
   - �鿴������־��ȡ��ϸ��Ϣ

3. **������֤ʧ��**
   - ���ģ�����ݸ�ʽ�Ƿ����Ҫ��
   - �鿴��־�еľ�����֤������Ϣ

### ��־����

- `INFO`: ����������Ϣ
- `WARNING`: ������Ϣ����Ӱ�����У�
- `ERROR`: ������Ϣ��Ӱ�칦�ܣ�
- `DEBUG`: ������Ϣ����ϸ��

## ����˵��

### ��Ŀ�ṹ

```
src/
������ main.py                 # ���������
������ config/                 # ����ģ��
������ data_transfer/          # ���ݴ���ģ��
������ scheduler/              # �������ģ��
������ utils/                  # ����ģ��
```

### ��չ����

1. **����µ����ݴ����߼�**���޸� `data_transfer/data_processor.py`
2. **�޸ĵ��Ȳ���**���޸� `scheduler/task_scheduler.py`
3. **����µĿͻ���**���� `data_transfer/` Ŀ¼������µĿͻ�����

## ���֤

MIT License