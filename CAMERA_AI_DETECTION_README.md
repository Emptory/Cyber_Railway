# ����ͷAI���ϵͳʹ��˵��

## ���ܸ���

��ϵͳ������ʵʱ����ͷ��غ�AI��⹦�ܣ������������ԣ�

### ? ����ͷ����
- ʵʱ����ͷ��Ƶ����ʾ
- ֧�ֶ��ֱַ������ã�640x480, 1280x720, 1920x1080��
- �Զ��豸���
- ��Ƶ����ͼ����

### ? AI��⹦��  
- �������ѧϰ��ͼ��ָ���
- ��֡�����������ģʽ
- ��������ӻ���ʾ
- �������ͳ��

### ? ��ʷ��¼
- �����ʷ��¼����
- �����ͼ�񱣴�
- ��ʷ���ݵ�������
- ���ͳ����Ϣ

## ʹ�÷���

### 1. ����ϵͳ

```bash
# �������з���
./start_all.sh
```

### 2. ����ϵͳ

��������д򿪣�`http://localhost:9999`

### 3. ����ͷ����

1. **���"���"��ǩ**�����ؽ���
2. **��������ͷ**�����"��������ͷ"��ť
3. **�鿴ʵʱ��Ƶ��**������ͷ���������ʾʵʱ����
4. **��������**������ѡ��ͬ�ķֱ��ʺ��豸

### 4. AI������

1. **�������**�����"�������"��ť��ʼ�������
2. **��֡���**�����"��⵱ǰ֡"�Ե�ǰ������м��
3. **�鿴���**�����������ʾ��"�����"����
4. **ֹͣ���**�����"ֹͣ���"��ťֹͣ�������

### 5. ��ʷ��¼����

1. **�鿴��ʷ**����"�����ʷ"����鿴���м���¼
2. **ˢ����ʷ**�����"ˢ����ʷ"��ȡ���¼�¼
3. **������ʷ**�����"������ʷ"����JSON��ʽ����ʷ����
4. **�����ʷ**�����"�����ʷ"ɾ��������ʷ��¼

## API�ӿ�

### ����ͷ������ (�˿�8888)

- `GET /api/status` - ��ȡ����״̬
- `GET /api/devices` - ��ȡ�����豸�б�
- `POST /api/camera/start` - ��������ͷ
- `POST /api/camera/stop` - ֹͣ����ͷ
- `GET /api/camera/mjpeg/{camera_id}` - MJPEG��Ƶ��
- `GET /api/camera/base64/{camera_id}` - ��ȡbase64�����֡
- `GET /api/camera/snapshot/{camera_id}` - ��ȡ��ͼ

### AI�������� (�˿�5001)

- `GET /api/status` - ��ȡ����״̬
- `POST /api/detect_camera_frame` - �������ͷ֡
- `POST /api/continuous_camera_detect` - �����������
- `GET /api/latest_detection` - ��ȡ���¼����
- `GET /api/detection_history` - ��ȡ�����ʷ
- `POST /api/clear_history` - �����ʷ��¼

## ����˵��

### ����ͷ����
- Ĭ���豸��`/dev/video0`
- Ĭ�Ϸֱ��ʣ�`640x480`
- Ĭ��֡�ʣ�`30fps`

### AI�������
- �����������2��
- ��ʷ��¼���ޣ�100��
- ֧�ֵ�ͼ���ʽ��JPG

## �����ų�

### 1. ����ͷ�޷�����
- �������ͷ�豸�Ƿ�����
- ȷ��`/dev/video0`�豸�ļ�����
- ����豸Ȩ�ޣ�`sudo chmod 666 /dev/video0`

### 2. AI���ʧ��
- ȷ��AIģ���ļ�����
- ���`ai_detection/model.pth`·��
- �鿴AI����������־

### 3. ǰ���޷�����
- ȷ�����з���������
- ������ǽ����
- �鿴���������̨������Ϣ

### 4. ��������
- ��������ͷ�ֱ���
- ���Ӽ����ʱ��
- ������ʷ��¼

## ���Թ���

����ϵͳ�󣬿���ʹ������curl������Ը���ܣ�

### ��������ͷ������
```bash
# ������״̬
curl http://localhost:8888/api/status

# ��ȡ�豸�б�
curl http://localhost:8888/api/devices

# ��������ͷ
curl -X POST -H "Content-Type: application/json" \
     -d '{"camera_id": "camera1", "device_id": 0}' \
     http://localhost:8888/api/camera/start

# ֹͣ����ͷ
curl -X POST -H "Content-Type: application/json" \
     -d '{"camera_id": "camera1"}' \
     http://localhost:8888/api/camera/stop
```

### ����AI��������
```bash
# ������״̬
curl http://localhost:5001/api/status

# ��ⵥ֡����Ҫ����������ͷ��
curl -X POST -H "Content-Type: application/json" \
     -d '{"camera_id": "camera1"}' \
     http://localhost:5001/api/detect_camera_frame

# ��ȡ�����ʷ
curl http://localhost:5001/api/detection_history
```

## �����ܹ�

```
ǰ�� (HTML/CSS/JavaScript)
    ��
����ͷ������ (Flask, OpenCV)
    ��
AI�������� (Flask, PyTorch)
    ��
AIģ�� (���ѧϰ�ָ�ģ��)
```

## ������

- Python 3.7+
- OpenCV
- Flask
- Flask-CORS
- PyTorch
- NumPy
- Pillow

## ��־�ļ�

- ����ͷ��������`backend.log`
- AI����������`ai_detection.log`
- ǰ�˷�������`frontend.log`

## ֧��

�������⣬���飺
1. ��־�ļ��еĴ�����Ϣ
2. ���������̨��JavaScript����
3. ���в��Խű���������

---

*������·���ϵͳ - ����ͷAI���ģ��*
