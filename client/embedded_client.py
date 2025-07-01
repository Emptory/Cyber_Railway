# -*- coding: GB2312 -*-
import socket
import json
import time
import base64
import io
from PIL import Image, ImageDraw, ImageFont

def load_image_from_file(image_path):
    """���ļ�����ͼƬ��ת��Ϊbase64"""
    try:
        # ����ļ��Ƿ����
        import os
        if not os.path.exists(image_path):
            print(f"? ͼƬ�ļ�������: {image_path}")
            return None, None
        
        # ��ȡ�ļ���չ����ȷ����ʽ
        file_ext = os.path.splitext(image_path)[1].lower()
        if file_ext == '.jpg' or file_ext == '.jpeg':
            image_format = 'jpeg'
        elif file_ext == '.png':
            image_format = 'png'
        elif file_ext == '.bmp':
            image_format = 'bmp'
        else:
            print(f"? ��֧�ֵ�ͼƬ��ʽ: {file_ext}")
            return None, None
        
        # ��ȡ��ת��ͼƬ
        with open(image_path, 'rb') as image_file:
            image_data = base64.b64encode(image_file.read()).decode('ascii')
        
        print(f"? �ɹ�����ͼƬ: {image_path}")
        print(f"  - ��ʽ: {image_format}")
        print(f"  - ��С: {len(image_data)} �ַ�")
        
        return image_data, image_format
        
    except Exception as e:
        print(f"? ��ȡͼƬ�ļ�ʱ����: {e}")
        return None, None

def create_sample_image():
    """����ʾ����ȾͼƬ����Ϊ���÷�����"""
    # ����һ��ʾ��ͼƬ
    width, height = 800, 600
    image = Image.new('RGB', (width, height), color='black')
    draw = ImageDraw.Draw(image)
    
    # ����һЩʾ������
    draw.rectangle([50, 50, width-50, height-50], outline='white', width=3)
    draw.text((100, 100), "Cyber Railway System", fill='white')
    draw.text((100, 150), f"Time: {time.strftime('%Y-%m-%d %H:%M:%S')}", fill='yellow')
    
    # ����һЩ����������
    import random
    temp = random.uniform(20, 30)
    humidity = random.uniform(40, 80)
    draw.text((100, 200), f"Temperature: {temp:.1f}��C", fill='green')
    draw.text((100, 250), f"Humidity: {humidity:.1f}%", fill='blue')
    
    # ת��Ϊbase64
    buffer = io.BytesIO()
    image.save(buffer, format='PNG')
    image_data = base64.b64encode(buffer.getvalue()).decode('ascii')
    
    return image_data

def send_image_data_to_server(server_ip, server_port, data):
    """����ͼƬ���ݵ�������"""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(30)  # ���ӳ�ʱʱ��
        
        sock.connect((server_ip, server_port))
        
        # ת��ΪJSON
        json_str = json.dumps(data, ensure_ascii=False)
        message_bytes = json_str.encode('gb2312')
        
        # �������ݳ���ͷ
        header = f"DATA_LENGTH:{len(message_bytes)}\n"
        sock.send(header.encode('gb2312'))
        
        # �ȴ�ȷ��
        ack = sock.recv(1024).decode('gb2312')
        if ack != "OK":
            raise Exception("������δȷ�����ݴ���")
        
        # ����ʵ������
        sock.send(message_bytes)
        
        # ������Ӧ
        response = sock.recv(4096).decode('gb2312')
        response_data = json.loads(response)
        
        sock.close()
        
        if response_data.get('status') == 'success':
            print(f"? ͼƬ���ݷ��ͳɹ�: {response_data.get('message')}")
            return True
        else:
            print(f"? ����ʧ��: {response_data.get('message')}")
            return False
            
    except Exception as e:
        print(f"? ���Ӵ���: {e}")
        return False

def find_latest_json_file(directory_path):
    """��ָ��Ŀ¼�в������µ�JSON�ļ�"""
    try:
        import os
        import glob
        
        # ��ȡ��ǰ����Ŀ¼�;���·�����ڵ���
        current_dir = os.getcwd()
        abs_path = os.path.abspath(directory_path)
        
        print(f"������Ϣ:")
        print(f"  - ��ǰ����Ŀ¼: {current_dir}")
        print(f"  - ���·��: {directory_path}")
        print(f"  - ����·��: {abs_path}")
        
        if not os.path.exists(directory_path):
            print(f"? Ŀ¼������: {directory_path}")
            print(f"? ����·��Ҳ������: {abs_path}")
            
            # �����������ܵ�·��
            alternative_paths = [
                "d:/Git/repository/Cyber_Railway/c_predict",
                "../c_predict",
                "../../c_predict",
                "./c_predict",
                "c_predict"
            ]
            
            print("�����������ܵ�·��:")
            for alt_path in alternative_paths:
                if os.path.exists(alt_path):
                    print(f"? �ҵ�����·��: {alt_path}")
                    directory_path = alt_path
                    break
                else:
                    print(f"? ·��������: {alt_path}")
            else:
                return None
        
        # ��������JSON�ļ�
        json_pattern = os.path.join(directory_path, "*.json")
        json_files = glob.glob(json_pattern)
        
        if not json_files:
            print(f"? Ŀ¼��û���ҵ�JSON�ļ�: {directory_path}")
            return None
        
        # ���޸�ʱ�����򣬻�ȡ���µ��ļ�
        latest_file = max(json_files, key=os.path.getmtime)
        
        print(f"? �ҵ� {len(json_files)} ��JSON�ļ�")
        print(f"? ʹ�������ļ�: {os.path.basename(latest_file)}")
        
        return latest_file
        
    except Exception as e:
        print(f"? ����JSON�ļ�ʱ����: {e}")
        return None

def load_json_data_from_file(json_path):
    """��JSON�ļ�����ͼƬ����"""
    try:
        # ����ļ��Ƿ����
        import os
        if not os.path.exists(json_path):
            print(f"? JSON�ļ�������: {json_path}")
            return None
        
        # ��ȡJSON�ļ�
        with open(json_path, 'r', encoding='utf-8') as json_file:
            json_data = json.load(json_file)
        
        print(f"? �ɹ�����JSON�ļ�: {os.path.basename(json_path)}")
        print(f"  - �����ֶ�: {list(json_data.keys())}")
        
        # ����Ƿ����ͼƬ����
        if 'image_base64' in json_data:
            print(f"  - ͼƬ��ʽ: {json_data.get('format', 'unknown')}")
            print(f"  - ͼƬ�ߴ�: {json_data.get('shape', 'unknown')}")
            print(f"  - Base64��С: {len(json_data['image_base64'])} �ַ�")
        
        return json_data
        
    except Exception as e:
        print(f"? ��ȡJSON�ļ�ʱ����: {e}")
        return None

def main():
    """������"""
    server_ip = "10.13.49.220"  # �޸�Ϊ��ķ�����IP
    device_id = "embedded_device_001"
    interval = 10  # ÿ10�뷢��һ��
    
    # ���������ļ�·��
    json_directory = "../c_predict"  # Ƕ��ʽ�Ŷ�JSON�ļ���Ŀ¼
    image_file_path = "rendered_image.jpg"  # ���õ�ͼƬ�ļ�·��
    
    print(f"��ʼ�� {server_ip}:8080 ����ͼƬ���ݣ��豸ID: {device_id}")
    print(f"���ͼ��: {interval}��")
    print(f"JSON�ļ�Ŀ¼: {json_directory}")
    print(f"����ͼƬ·��: {image_file_path}")
    
    try:
        while True:
            print("\n" + "="*50)
            print("��ȡͼƬ����...")
            
            data = None
            
            # ��ʽ1: �Զ����Ҳ�ʹ�����µ�JSON�ļ�
            latest_json_file = find_latest_json_file("../c_predict")
            if latest_json_file:
                json_data = load_json_data_from_file(latest_json_file)
                if json_data:
                    print("ʹ��JSON�ļ�����...")
                    # ʹ��Ƕ��ʽ�Ŷӵ�JSON��ʽ��������豸��Ϣ
                    data = {
                        "device_id": device_id,
                        "timestamp": int(time.time()),
                        "image_base64": json_data.get("image_base64"),
                        "format": json_data.get("format"),
                        "shape": json_data.get("shape"),
                        "original_dtype": json_data.get("original_dtype"),
                        "note": json_data.get("note"),
                        "status": "normal",
                        "data_source": "json_file",
                        "source_file": latest_json_file.split('\\')[-1]  # ��¼Դ�ļ���
                    }
                
            # ��ʽ2: ���JSON�ļ���ȡʧ�ܣ����Դ�ͼƬ�ļ�����
            if not data:
                print("JSON�ļ���ȡʧ�ܣ�����ͼƬ�ļ�...")
                image_data, image_format = load_image_from_file(image_file_path)
                
                if image_data:
                    print("ʹ��ͼƬ�ļ�����...")
                    data = {
                        "device_id": device_id,
                        "timestamp": int(time.time()),
                        "image_data": image_data,
                        "image_format": image_format,
                        "render_info": {
                            "resolution": "ʵ��ͼƬ�ߴ�",
                            "color_depth": 24,
                            "render_time": f"{time.time():.3f}",
                            "source": "file"
                        },
                        "sensor_data": {
                            "temperature": round(20 + (time.time() % 100) / 10, 2),
                            "humidity": round(50 + (time.time() % 60), 2)
                        },
                        "status": "normal",
                        "data_source": "image_file"
                    }
            
            # ��ʽ3: �����ʧ�ܣ�ʹ�����ɵ�ʾ��ͼƬ
            if not data:
                print("�����ļ���ȡʧ�ܣ�ʹ��ʾ��ͼƬ...")
                image_data = create_sample_image()
                data = {
                    "device_id": device_id,
                    "timestamp": int(time.time()),
                    "image_data": image_data,
                    "image_format": "png",
                    "render_info": {
                        "resolution": "800x600",
                        "color_depth": 24,
                        "render_time": f"{time.time():.3f}",
                        "source": "generated"
                    },
                    "sensor_data": {
                        "temperature": round(20 + (time.time() % 100) / 10, 2),
                        "humidity": round(50 + (time.time() % 60), 2)
                    },
                    "status": "normal",
                    "data_source": "generated"
                }
            
            # ��ʾ������Ϣ
            if 'image_base64' in data:
                print(f"ͼƬ���ݴ�С: {len(data['image_base64'])} �ַ� (JSON��ʽ)")
                if 'source_file' in data:
                    print(f"Դ�ļ�: {data['source_file']}")
            elif 'image_data' in data:
                print(f"ͼƬ���ݴ�С: {len(data['image_data'])} �ַ� (ԭ�и�ʽ)")
            
            print("�������ݵ�������...")
            
            # ��������
            send_image_data_to_server(server_ip, 8080, data)
            
            print(f"�ȴ� {interval} ��...")
            time.sleep(interval)
            
    except KeyboardInterrupt:
        print("\nֹͣ����")

if __name__ == "__main__":
    main()