# ������·���ϵͳ - �������ͷ����

## ���ܼ��

����˷���ר�����ڴ�����Ƕ��ʽ�豸������ͷ��Ƶ����֧�ֶ�·����ͷͬʱ���룬�ṩRESTful API�ӿڹ�ǰ�˵��á�

## ��Ҫ����

### ? ����ͷ֧��
- **���豸֧��**: �Զ�ɨ�� `/dev/video0` �� `/dev/video9`
- **ʵʱ��ý��**: MJPEG��ʽ��Ƶ�����
- **��ֱ���**: ֧���Զ���ֱ�������
- **֡�ʿ���**: �ɵ���֡�ʺͻ���

### ? API�ӿ�
- **�豸����**: ��ȡ��������ͷ�б�
- **������**: ����/ֹͣ��Ƶ��
- **ʵʱ��ͼ**: ��֡ͼ���ȡ
- **״̬���**: ����ͷ����״̬��ѯ

### ? ���繦��
- **����֧��**: CORS���ã�֧��ǰ�˵���
- **���߳�**: �߲�����������
- **�쳣����**: ���ƵĴ��������

## �ļ��ṹ

```
back_end/
������ camera_server.py           # ���������ļ�
������ start_camera_server.sh     # �����ű�
������ requirements.txt           # Python����
������ README.md                 # ˵���ĵ�
```

## ���ٿ�ʼ

### 1. ��װ����

```bash
cd back_end
./start_camera_server.sh
```

### 2. �ֶ���װ

```bash
cd back_end
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 camera_server.py
```

## API�ӿ�˵��

### ������Ϣ
- **�����ַ**: http://localhost:8888
- **���ݸ�ʽ**: JSON
- **����**: ������CORS

### �ӿ��б�

#### 1. ��ȡ�豸�б�
```
GET /api/devices
```

**��Ӧʾ��**:
```json
{
    "success": true,
    "devices": [
        {
            "id": 0,
            "path": "/dev/video0",
            "name": "����ͷ 0",
            "resolution": "640x480"
        }
    ]
}
```

#### 2. ��������ͷ
```
POST /api/camera/start
Content-Type: application/json
```

**�������**:
```json
{
    "camera_id": "camera1",
    "device_id": 0,
    "width": 640,
    "height": 480
}
```

#### 3. ֹͣ����ͷ
```
POST /api/camera/stop
Content-Type: application/json
```

**�������**:
```json
{
    "camera_id": "camera1"
}
```

#### 4. ��ȡ����ͷ��Ϣ
```
GET /api/camera/info/{camera_id}
```

#### 5. MJPEG��Ƶ��
```
GET /api/camera/mjpeg/{camera_id}
```

#### 6. ��ȡ��ͼ
```
GET /api/camera/snapshot/{camera_id}
```

#### 7. ��ȡBase64ͼ��
```
GET /api/camera/base64/{camera_id}
```

## ʹ��ʾ��

### JavaScriptǰ�˵���

```javascript
// 1. ��ȡ�����豸
fetch('http://localhost:8888/api/devices')
    .then(response => response.json())
    .then(data => console.log(data.devices));

// 2. ��������ͷ
fetch('http://localhost:8888/api/camera/start', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        camera_id: 'camera1',
        device_id: 0,
        width: 1280,
        height: 720
    })
});

// 3. ��HTML����ʾMJPEG��
<img src="http://localhost:8888/api/camera/mjpeg/camera1" alt="����ͷ1">
```

### Python�ͻ��˵���

```python
import requests

# ��������ͷ
response = requests.post('http://localhost:8888/api/camera/start', json={
    'camera_id': 'camera1',
    'device_id': 0,
    'width': 640,
    'height': 480
})

print(response.json())
```

## ����˵��

### ����ͷ����
- **device_id**: ����ͷ�豸��� (0=/dev/video0, 1=/dev/video1...)
- **width/height**: ��Ƶ�ֱ���
- **fps**: ֡������ (Ĭ��30fps)

### ����������
- **host**: ������������ַ (Ĭ�� 0.0.0.0)
- **port**: �������˿� (Ĭ�� 8888)
- **debug**: ����ģʽ (Ĭ�� False)

## �����ų�

### ��������

1. **����ͷ�豸�޷�����**
   ```bash
   # ����豸Ȩ��
   ls -la /dev/video*
   # ����û���video��
   sudo usermod -a -G video $USER
   ```

2. **������װʧ��**
   ```bash
   # ����ϵͳ��
   sudo apt update
   sudo apt install python3-dev python3-pip
   sudo apt install libopencv-dev python3-opencv
   ```

3. **�˿ڱ�ռ��**
   ```bash
   # ���˿�ռ��
   netstat -tlnp | grep :8888
   # ���޸�camera_server.py�еĶ˿ں�
   ```

### �����Ż�

1. **����֡��**: ��������������FPS
2. **�ֱ�������**: ѡ����ʵķֱ���
3. **JPEG����**: �޸�ѹ����������

## ��չ����

### �ƻ��е�����
- [ ] H.264��Ƶ����
- [ ] WebRTC֧��
- [ ] ¼����
- [ ] �˶����
- [ ] ��·����Ƶͬ��

## ����֧��

- **����ϵͳ**: Linux (Ubuntu/Debian�Ƽ�)
- **Python�汾**: 3.7+
- **����ͷ֧��**: USB����ͷ��CSI����ͷ
- **�����֧��**: Chrome��Firefox��Safari

## ���֤

MIT License
