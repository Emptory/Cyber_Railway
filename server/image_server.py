# -*- coding: GB2312 -*-
import socket
import json
import datetime
import os
import threading
import base64
from typing import Dict, Any
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.parse

print("ͼƬ���ݷ�������������")

class ImageDataServer:
    def __init__(self, host='0.0.0.0', port=8080, data_dir='received_images', web_port=8081):
        self.host = host
        self.port = port
        self.web_port = web_port
        self.data_dir = data_dir
        self.server_socket = None
        self.running = False
        self.latest_data = None  # �洢���µ�ͼƬ����
        
        # �������ݴ洢Ŀ¼
        if not os.path.exists(self.data_dir):
            os.makedirs(self.data_dir)
            print(f"�������ݴ洢Ŀ¼: {self.data_dir}")

    def log_message(self, message: str):
        """��¼��־��Ϣ"""
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] {message}")

    def save_image_data(self, data: Dict[Any, Any], client_address: tuple) -> str:
        """������յ���ͼƬ����"""
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # ����JSON����
        json_filename = f"data_{client_address[0]}_{timestamp}.json"
        json_filepath = os.path.join(self.data_dir, json_filename)
        
        try:
            # �������ֲ�ͬ��JSON��ʽ
            image_data = None
            image_format = None
            
            # ��ʽ1: Ƕ��ʽ�Ŷӵĸ�ʽ {"image_base64": "...", "format": "png"}
            if 'image_base64' in data and 'format' in data:
                image_data = data['image_base64']
                image_format = data['format']
                self.log_message(f"��⵽Ƕ��ʽ�ŶӸ�ʽ��ͼƬ��ʽ: {image_format}")
                
            # ��ʽ2: ԭ�и�ʽ {"image_data": "...", "image_format": "png"}
            elif 'image_data' in data and 'image_format' in data:
                image_data = data['image_data']
                image_format = data['image_format']
                self.log_message(f"��⵽ԭ�и�ʽ��ͼƬ��ʽ: {image_format}")
            
            # �������base64ͼƬ���ݣ��ֱ𱣴�
            if image_data and image_format:
                # ����ͼƬ�ļ�
                image_ext = image_format.lower()
                if image_ext == 'jpeg':
                    image_ext = 'jpg'
                
                image_filename = f"image_{client_address[0]}_{timestamp}.{image_ext}"
                image_filepath = os.path.join(self.data_dir, image_filename)
                
                # ����base64ͼƬ����
                try:
                    decoded_image_data = base64.b64decode(image_data)
                    with open(image_filepath, 'wb') as img_file:
                        img_file.write(decoded_image_data)
                    
                    # ͳһ��ʽ��Ϊ��Webչʾ��ͳһʹ����ͬ���ֶ���
                    data['image_file'] = image_filename
                    data['image_data'] = image_data  # ȷ��������ֶ�����Webչʾ
                    data['image_format'] = image_format  # ȷ��������ֶ�����Webչʾ
                    
                    self.log_message(f"ͼƬ�ѱ��浽: {image_filepath}")
                    
                    # �����shape��Ϣ����¼ͼƬ�ߴ�
                    if 'shape' in data:
                        self.log_message(f"ͼƬ�ߴ�: {data['shape']}")
                        
                except Exception as decode_error:
                    self.log_message(f"Base64����ʧ��: {decode_error}")
                    
            else:
                self.log_message("δ��⵽��Ч��ͼƬ�����ֶ�")
            
            # ����JSON����
            with open(json_filepath, 'w', encoding='gb2312') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            
            # �����������ݣ�����webչʾ��
            self.latest_data = data.copy()
            
            self.log_message(f"�����ѱ��浽: {json_filepath}")
            return json_filepath
        except Exception as e:
            self.log_message(f"��������ʱ����: {e}")
            return ""

    def handle_client(self, client_socket: socket.socket, client_address: tuple):
        """�������ͻ�������"""
        try:
            self.log_message(f"���յ����� {client_address} ������")
            
            # ��������ͷ���������ݳ��ȣ�
            header = client_socket.recv(1024).decode('gb2312')
            if not header.startswith("DATA_LENGTH:"):
                raise ValueError("��Ч������ͷ��ʽ")
            
            data_length = int(header.split(":")[1].strip())
            self.log_message(f"Ԥ�ڽ������ݳ���: {data_length} �ֽ�")
            
            # ����ȷ��
            client_socket.send("OK".encode('gb2312'))
            
            # ������������
            all_data = b""
            while len(all_data) < data_length:
                chunk = client_socket.recv(min(4096, data_length - len(all_data)))
                if not chunk:
                    break
                all_data += chunk

            if len(all_data) == data_length:
                try:
                    # ��������
                    data_str = all_data.decode('gb2312')
                    self.log_message(f"���յ��������� ({len(data_str)} �ַ�)")
                    
                    # ���Խ���JSON
                    json_data = json.loads(data_str)
                    self.log_message(f"�ɹ�����JSON���ݣ������ֶ�: {list(json_data.keys())}")
                    
                    # ��������
                    saved_file = self.save_image_data(json_data, client_address)
                    
                    # ������Ӧ
                    if saved_file:
                        response = {
                            "status": "success",
                            "message": "ͼƬ�����ѳɹ����ղ�����",
                            "timestamp": datetime.datetime.now().isoformat(),
                            "saved_file": os.path.basename(saved_file)
                        }
                    else:
                        response = {
                            "status": "error",
                            "message": "���ݽ��ճɹ�������ʧ��",
                            "timestamp": datetime.datetime.now().isoformat()
                        }
                    
                    response_json = json.dumps(response, ensure_ascii=False)
                    client_socket.send(response_json.encode('gb2312'))
                    
                except json.JSONDecodeError as e:
                    self.log_message(f"JSON��������: {e}")
                    error_response = {
                        "status": "error",
                        "message": f"JSON��ʽ����: {str(e)}",
                        "timestamp": datetime.datetime.now().isoformat()
                    }
                    response_json = json.dumps(error_response, ensure_ascii=False)
                    client_socket.send(response_json.encode('gb2312'))
                    
            else:
                self.log_message(f"���ݽ��ղ�����: {len(all_data)}/{data_length}")
                
        except Exception as e:
            self.log_message(f"����ͻ���ʱ����: {e}")
        finally:
            client_socket.close()
            self.log_message(f"�ر��� {client_address} ������")

    def start_server(self):
        """����������"""
        try:
            # ����socket����
            self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            
            # �󶨵�ַ�Ͷ˿�
            self.server_socket.bind((self.host, self.port))
            self.server_socket.listen(5)
            self.running = True
            
            # ��ȡ����ʾ����IP��ַ
            local_ip = self.get_local_ip()
            self.log_message(f"ͼƬ���ݷ����������������ڼ��� {self.host}:{self.port}")
            self.log_message(f"����IP��ַ: {local_ip}")
            self.log_message(f"���ݽ��յ�ַ: {local_ip}:{self.port}")
            self.log_message(f"Webչʾ��ַ: http://{local_ip}:{self.web_port}")
            self.log_message(f"���ݽ����浽Ŀ¼: {os.path.abspath(self.data_dir)}")
            
            # ����Web������
            web_thread = threading.Thread(target=self.start_web_server)
            web_thread.daemon = True
            web_thread.start()
            
            while self.running:
                try:
                    # ���ܿͻ�������
                    client_socket, client_address = self.server_socket.accept()
                    
                    # ʹ���̴߳���ͻ��ˣ�֧�ֲ�������
                    client_thread = threading.Thread(
                        target=self.handle_client,
                        args=(client_socket, client_address)
                    )
                    client_thread.daemon = True
                    client_thread.start()
                    
                except socket.error as e:
                    if self.running:
                        self.log_message(f"Socket����: {e}")
                        
        except Exception as e:
            self.log_message(f"����������ʱ����: {e}")
        finally:
            self.stop_server()

    def start_web_server(self):
        """����Web����������չʾ����"""
        server = ImageWebServer(self)
        httpd = HTTPServer(('0.0.0.0', self.web_port), server.handler_class)
        self.log_message(f"Web���������������˿�: {self.web_port}")
        httpd.serve_forever()

    def get_local_ip(self):
        """��ȡ����������IP��ַ"""
        try:
            temp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            temp_socket.connect(("8.8.8.8", 80))
            local_ip = temp_socket.getsockname()[0]
            temp_socket.close()
            return local_ip
        except Exception:
            return "127.0.0.1"

    def stop_server(self):
        """ֹͣ������"""
        self.running = False
        if self.server_socket:
            try:
                self.server_socket.close()
                self.log_message("��������ֹͣ")
            except Exception as e:
                self.log_message(f"ֹͣ������ʱ����: {e}")

class ImageWebServer:
    def __init__(self, image_server):
        self.image_server = image_server
        self.handler_class = self.create_handler()

    def create_handler(self):
        image_server = self.image_server
        
        class ImageHandler(BaseHTTPRequestHandler):
            def do_GET(self):
                if self.path == '/':
                    self.send_html_page()
                elif self.path == '/api/latest':
                    self.send_latest_data()
                elif self.path.startswith('/images/'):
                    self.send_image_file()
                else:
                    self.send_error(404)

            def send_html_page(self):
                html_content = self.get_html_content()
                self.send_response(200)
                self.send_header('Content-type', 'text/html; charset=utf-8')
                self.end_headers()
                self.wfile.write(html_content.encode('utf-8'))

            def send_latest_data(self):
                self.send_response(200)
                self.send_header('Content-type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                if image_server.latest_data:
                    response = json.dumps(image_server.latest_data, ensure_ascii=False)
                else:
                    response = json.dumps({"status": "no_data"}, ensure_ascii=False)
                
                self.wfile.write(response.encode('utf-8'))

            def send_image_file(self):
                filename = os.path.basename(self.path)
                filepath = os.path.join(image_server.data_dir, filename)
                
                if os.path.exists(filepath):
                    self.send_response(200)
                    if filename.endswith('.png'):
                        self.send_header('Content-type', 'image/png')
                    elif filename.endswith('.jpg') or filename.endswith('.jpeg'):
                        self.send_header('Content-type', 'image/jpeg')
                    else:
                        self.send_header('Content-type', 'application/octet-stream')
                    self.end_headers()
                    
                    with open(filepath, 'rb') as f:
                        self.wfile.write(f.read())
                else:
                    self.send_error(404)

            def get_html_content(self):
                return '''
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ƕ��ʽ�豸����չʾ</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f0f0f0; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
        .header { text-align: center; margin-bottom: 30px; }
        .data-panel { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .image-panel { text-align: center; }
        .info-panel { padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
        .rendered-image { max-width: 100%; height: auto; border: 2px solid #333; border-radius: 5px; }
        .status { padding: 10px; border-radius: 5px; margin: 10px 0; }
        .status.success { background-color: #d4edda; color: #155724; }
        .status.error { background-color: #f8d7da; color: #721c24; }
        .refresh-btn { background-color: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
        .refresh-btn:hover { background-color: #0056b3; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>? Cyber Railway ����չʾ</h1>
            <button class="refresh-btn" onclick="loadLatestData()">ˢ������</button>
        </div>
        
        <div id="status" class="status">�ȴ�����...</div>
        
        <div class="data-panel">
            <div class="image-panel">
                <h3>��ȾͼƬ</h3>
                <img id="renderedImage" class="rendered-image" src="" alt="�ȴ�ͼƬ����..." style="display:none;">
                <div id="noImage">����ͼƬ����</div>
            </div>
            
            <div class="info-panel">
                <h3>�豸��Ϣ</h3>
                <div id="deviceInfo">
                    <p><strong>�豸ID:</strong> <span id="deviceId">-</span></p>
                    <p><strong>ʱ���:</strong> <span id="timestamp">-</span></p>
                    <p><strong>ͼƬ��ʽ:</strong> <span id="imageFormat">-</span></p>
                    <p><strong>���ݴ�С:</strong> <span id="dataSize">-</span></p>
                </div>
                
                <h3>��������</h3>
                <div id="additionalData"></div>
            </div>
        </div>
    </div>

    <script>
        function loadLatestData() {
            fetch('/api/latest')
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'no_data') {
                        document.getElementById('status').className = 'status error';
                        document.getElementById('status').textContent = '��������';
                        return;
                    }
                    
                    document.getElementById('status').className = 'status success';
                    document.getElementById('status').textContent = '���ݼ��سɹ� - ' + new Date().toLocaleString();
                    
                    // �����豸��Ϣ
                    document.getElementById('deviceId').textContent = data.device_id || '-';
                    document.getElementById('timestamp').textContent = data.timestamp ? new Date(data.timestamp * 1000).toLocaleString() : '-';
                    document.getElementById('imageFormat').textContent = data.image_format || data.format || '-';
                    
                    // �������ݴ�С������ʹ��image_data�����ʹ��image_base64��
                    let dataSize = '-';
                    if (data.image_data) {
                        dataSize = data.image_data.length + ' �ַ�';
                    } else if (data.image_base64) {
                        dataSize = data.image_base64.length + ' �ַ�';
                    }
                    document.getElementById('dataSize').textContent = dataSize;
                    
                    // ��ʾͼƬ
                    if (data.image_file) {
                        const img = document.getElementById('renderedImage');
                        img.src = '/images/' + data.image_file;
                        img.style.display = 'block';
                        document.getElementById('noImage').style.display = 'none';
                    } else if (data.image_data) {
                        const img = document.getElementById('renderedImage');
                        img.src = 'data:image/' + (data.image_format || 'png') + ';base64,' + data.image_data;
                        img.style.display = 'block';
                        document.getElementById('noImage').style.display = 'none';
                    } else if (data.image_base64) {
                        // ����Ƕ��ʽ�ŶӸ�ʽ
                        const img = document.getElementById('renderedImage');
                        img.src = 'data:image/' + (data.format || 'png') + ';base64,' + data.image_base64;
                        img.style.display = 'block';
                        document.getElementById('noImage').style.display = 'none';
                    }
                    
                    // ��ʾ��������
                    const additionalDiv = document.getElementById('additionalData');
                    additionalDiv.innerHTML = '';
                    
                    Object.keys(data).forEach(key => {
                        if (!['device_id', 'timestamp', 'image_data', 'image_format', 'image_file', 'image_base64', 'format'].includes(key)) {
                            const p = document.createElement('p');
                            if (key === 'shape') {
                                p.innerHTML = '<strong>ͼƬ�ߴ�:</strong> ' + data[key][0] + ' �� ' + data[key][1];
                            } else {
                                p.innerHTML = '<strong>' + key + ':</strong> ' + JSON.stringify(data[key]);
                            }
                            additionalDiv.appendChild(p);
                        }
                    });
                })
                .catch(error => {
                    document.getElementById('status').className = 'status error';
                    document.getElementById('status').textContent = '��������ʧ��: ' + error.message;
                });
        }
        
        // ҳ�����ʱ��ȡ����
        loadLatestData();
        
        // ÿ5���Զ�ˢ��
        setInterval(loadLatestData, 5000);
    </script>
</body>
</html>
                '''
        
        return ImageHandler

if __name__ == "__main__":
    server = ImageDataServer()
    try:
        server.start_server()
    except KeyboardInterrupt:
        server.log_message("���յ�ֹͣ�ź�")
        server.stop_server()