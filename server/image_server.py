# -*- coding: GB2312 -*-
import socket
import json
import datetime
import os
import threading
import base64
import glob
from typing import Dict, Any, List
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
        self.all_records = []    # �洢������ʷ��¼
        
        # �������ݴ洢Ŀ¼
        if not os.path.exists(self.data_dir):
            os.makedirs(self.data_dir)
            print(f"�������ݴ洢Ŀ¼: {self.data_dir}")
        
        # ��ʼ��ʱ������ʷ����
        self.load_historical_data()

    def load_historical_data(self):
        """������ʷ����"""
        try:
            json_files = glob.glob(os.path.join(self.data_dir, "data_*.json"))
            self.all_records = []
            
            for json_file in sorted(json_files, reverse=True):  # ��ʱ�䵹��
                try:
                    with open(json_file, 'r', encoding='gb2312') as f:
                        data = json.load(f)
                        # ����ļ���Ϣ
                        data['json_file'] = os.path.basename(json_file)
                        self.all_records.append(data)
                except Exception as e:
                    self.log_message(f"������ʷ�ļ� {json_file} ʧ��: {e}")
            
            self.log_message(f"������ {len(self.all_records)} ����ʷ��¼")
        except Exception as e:
            self.log_message(f"������ʷ����ʧ��: {e}")

    def get_detection_statistics(self) -> Dict[str, Any]:
        """���ɼ��ͳ������"""
        try:
            total_inspections = len(self.all_records)
            
            # ģ��ȱ�ݼ���߼���ʵ��Ӧ�û���AI���������
            defect_records = []
            for record in self.all_records:
                # ������Ը���ʵ�ʵ�AI����������ж��Ƿ���ȱ��
                # Ŀǰʹ��ģ������
                if 'analysis_result' in record or len(defect_records) < total_inspections * 0.36:
                    defect_records.append(record)
            
            total_defects = len(defect_records)
            
            # ȱ�����ͷֲ���ģ�⣩
            defects_by_type = {
                "��������": int(total_defects * 0.51),
                "ĥ��": int(total_defects * 0.31), 
                "��ʴ��": int(total_defects * 0.18)
            }
            
            # ���س̶ȷֲ���ģ�⣩
            defects_by_severity = {
                "�ض�": int(total_defects * 0.13),
                "�ж�": int(total_defects * 0.38),
                "���": int(total_defects * 0.49)
            }
            
            # ��һ������
            week_trend = self.get_weekly_trend()
            
            # �¶ȶԱ�
            monthly_comparison = self.get_monthly_comparison()
            
            return {
                "totalInspections": total_inspections,
                "totalDefects": total_defects,
                "defectsByType": defects_by_type,
                "defectsBySeverity": defects_by_severity,
                "weeklyTrend": week_trend,
                "monthlyComparison": monthly_comparison,
                "lastUpdated": datetime.datetime.now().isoformat()
            }
        except Exception as e:
            self.log_message(f"����ͳ������ʧ��: {e}")
            return {}

    def get_weekly_trend(self) -> List[Dict[str, Any]]:
        """��ȡ��һ�ܵļ������"""
        try:
            # ��ȡ���7�������
            today = datetime.date.today()
            week_data = []
            
            for i in range(6, -1, -1):  # 7�죬��6��ǰ������
                date = today - datetime.timedelta(days=i)
                date_str = date.strftime("%Y-%m-%d")
                
                # ͳ�Ƹ���ļ���¼
                day_records = [r for r in self.all_records 
                             if r.get('json_file', '').find(date.strftime("%Y%m%d")) != -1]
                
                # ģ��ȱ��������ʵ��Ӧ�û���AI������
                defects = len(day_records) // 3 if day_records else 0
                
                week_data.append({
                    "date": date_str,
                    "defects": defects
                })
            
            return week_data
        except Exception as e:
            self.log_message(f"��������������ʧ��: {e}")
            return []

    def get_monthly_comparison(self) -> List[Dict[str, Any]]:
        """��ȡ�¶ȶԱ�����"""
        try:
            # ģ��6���µ�����
            months = ["һ��", "����", "����", "����", "����", "����"]
            base_inspections = [198, 203, 215, 231, 228, len(self.all_records)]
            base_defects = [67, 71, 78, 82, 85, len(self.all_records) // 3]
            
            monthly_data = []
            for i, month in enumerate(months):
                monthly_data.append({
                    "month": month,
                    "inspections": base_inspections[i],
                    "defects": base_defects[i]
                })
            
            return monthly_data
        except Exception as e:
            self.log_message(f"�����¶ȶԱ�����ʧ��: {e}")
            return []

    def get_recent_records(self, limit: int = 20) -> List[Dict[str, Any]]:
        """��ȡ����ļ���¼"""
        try:
            recent = self.all_records[:limit]
            
            # Ϊÿ����¼���ժҪ��Ϣ
            for record in recent:
                if 'summary' not in record:
                    # ����ժҪ��Ϣ
                    timestamp = record.get('timestamp', 'unknown')
                    if isinstance(timestamp, (int, float)):
                        time_str = datetime.datetime.fromtimestamp(timestamp).strftime("%Y-%m-%d %H:%M:%S")
                    else:
                        time_str = str(timestamp)
                    
                    record['summary'] = {
                        "time": time_str,
                        "status": "������",
                        "hasDefect": len(recent) > 0 and (hash(record.get('json_file', '')) % 3 == 0),  # ģ��ȱ�ݼ��
                        "confidence": round(85 + (hash(record.get('json_file', '')) % 15), 1)  # ģ�����Ŷ�
                    }
            
            return recent
        except Exception as e:
            self.log_message(f"��ȡ�����¼ʧ��: {e}")
            return []

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
            # ���¼�����ʷ����
            self.load_historical_data()
            
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
                elif self.path == '/api/monitor/current':
                    self.send_current_monitor_data()
                elif self.path == '/api/monitor/history':
                    self.send_history_data()
                elif self.path == '/api/reports/statistics':
                    self.send_statistics_data()
                elif self.path.startswith('/images/'):
                    self.send_image_file()
                elif self.path == '/api/statistics':
                    self.send_statistics()
                elif self.path == '/api/history':
                    self.send_history()
                else:
                    self.send_error(404)

            def do_OPTIONS(self):
                # �������Ԥ������
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
                self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                self.end_headers()

            def send_current_monitor_data(self):
                """���͵�ǰ������ݣ�ԭʼͼ�񡢷���ͼ��ȱ�ݱ��棩"""
                self.send_response(200)
                self.send_header('Content-type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                if image_server.latest_data:
                    # ���������ݸ�ʽ
                    monitor_data = {
                        "originalImage": {
                            "url": f"/images/{image_server.latest_data.get('image_file', '')}" if image_server.latest_data.get('image_file') else None,
                            "base64": image_server.latest_data.get('image_data') or image_server.latest_data.get('image_base64'),
                            "format": image_server.latest_data.get('image_format') or image_server.latest_data.get('format', 'png'),
                            "timestamp": image_server.latest_data.get('timestamp', int(datetime.datetime.now().timestamp()))
                        },
                        "analyzedImage": {
                            # ģ�����ͼ��ʵ��Ӧ����AI������ͼ��
                            "url": f"/images/{image_server.latest_data.get('image_file', '')}" if image_server.latest_data.get('image_file') else None,
                            "base64": image_server.latest_data.get('image_data') or image_server.latest_data.get('image_base64'),
                            "format": image_server.latest_data.get('image_format') or image_server.latest_data.get('format', 'png'),
                            "confidence": 92.5
                        },
                        "defectReport": {
                            "hasDefect": True,  # ģ��ȱ�ݼ����
                            "defectType": "��������",
                            "severity": "�ж�",
                            "confidence": 89.3,
                            "location": {"x": 245, "y": 167, "width": 128, "height": 89},
                            "description": "��⵽�ֹ������ڳ���Լ5cm�ĺ������ƣ����鼰ʱά��",
                            "timestamp": image_server.latest_data.get('timestamp', int(datetime.datetime.now().timestamp()))
                        }
                    }
                else:
                    monitor_data = {"status": "no_data"}
                
                response = json.dumps(monitor_data, ensure_ascii=False)
                self.wfile.write(response.encode('utf-8'))

            def send_history_data(self):
                """������ʷ����¼"""
                self.send_response(200)
                self.send_header('Content-type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                recent_records = image_server.get_recent_records(20)
                
                # ת��Ϊǰ����Ҫ�ĸ�ʽ
                history_data = []
                for record in recent_records:
                    history_item = {
                        "id": record.get('json_file', ''),
                        "image": {
                            "url": f"/images/{record.get('image_file', '')}" if record.get('image_file') else None,
                            "base64": record.get('image_data') or record.get('image_base64'),
                            "format": record.get('image_format') or record.get('format', 'png')
                        },
                        "summary": record.get('summary', {}),
                        "timestamp": record.get('timestamp', int(datetime.datetime.now().timestamp()))
                    }
                    history_data.append(history_item)
                
                response = json.dumps(history_data, ensure_ascii=False)
                self.wfile.write(response.encode('utf-8'))

            def send_statistics_data(self):
                """����ͳ�Ʒ�������"""
                self.send_response(200)
                self.send_header('Content-type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                statistics = image_server.get_detection_statistics()
                response = json.dumps(statistics, ensure_ascii=False)
                self.wfile.write(response.encode('utf-8'))

            def send_html_page(self):
                # �򻯵�API��Ϣҳ��
                api_info = {
                    "service": "Cyber Railway Detection API",
                    "status": "running",
                    "endpoints": {
                        "/api/monitor/current": "��ȡ��ǰ�������",
                        "/api/monitor/history": "��ȡ��ʷ����¼", 
                        "/api/reports/statistics": "��ȡͳ�Ʒ�������",
                        "/images/{filename}": "��ȡͼƬ�ļ�"
                    },
                    "frontend_url": "http://localhost:5173",
                    "timestamp": datetime.datetime.now().isoformat()
                }
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                response = json.dumps(api_info, ensure_ascii=False, indent=2)
                self.wfile.write(response.encode('utf-8'))

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

            def send_statistics(self):
                """���ͼ��ͳ������"""
                self.send_response(200)
                self.send_header('Content-type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                statistics = image_server.get_detection_statistics()
                response = json.dumps(statistics, ensure_ascii=False)
                self.wfile.write(response.encode('utf-8'))

            def send_history(self):
                """������ʷ��¼����"""
                self.send_response(200)
                self.send_header('Content-type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                # ��ȡ�����20����¼
                recent_records = image_server.get_recent_records(limit=20)
                
                response = json.dumps(recent_records, ensure_ascii=False)
                self.wfile.write(response.encode('utf-8'))
        
        return ImageHandler

if __name__ == "__main__":
    server = ImageDataServer()
    try:
        server.start_server()
    except KeyboardInterrupt:
        server.log_message("���յ�ֹͣ�ź�")
        server.stop_server()