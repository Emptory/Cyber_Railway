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

print("图片数据服务器启动……")

class ImageDataServer:
    def __init__(self, host='0.0.0.0', port=8080, data_dir='received_images', web_port=8081):
        self.host = host
        self.port = port
        self.web_port = web_port
        self.data_dir = data_dir
        self.server_socket = None
        self.running = False
        self.latest_data = None  # 存储最新的图片数据
        
        # 创建数据存储目录
        if not os.path.exists(self.data_dir):
            os.makedirs(self.data_dir)
            print(f"创建数据存储目录: {self.data_dir}")

    def log_message(self, message: str):
        """记录日志消息"""
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] {message}")

    def save_image_data(self, data: Dict[Any, Any], client_address: tuple) -> str:
        """保存接收到的图片数据"""
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # 保存JSON数据
        json_filename = f"data_{client_address[0]}_{timestamp}.json"
        json_filepath = os.path.join(self.data_dir, json_filename)
        
        try:
            # 处理两种不同的JSON格式
            image_data = None
            image_format = None
            
            # 方式1: 嵌入式团队的格式 {"image_base64": "...", "format": "png"}
            if 'image_base64' in data and 'format' in data:
                image_data = data['image_base64']
                image_format = data['format']
                self.log_message(f"检测到嵌入式团队格式，图片格式: {image_format}")
                
            # 方式2: 原有格式 {"image_data": "...", "image_format": "png"}
            elif 'image_data' in data and 'image_format' in data:
                image_data = data['image_data']
                image_format = data['image_format']
                self.log_message(f"检测到原有格式，图片格式: {image_format}")
            
            # 如果包含base64图片数据，分别保存
            if image_data and image_format:
                # 保存图片文件
                image_ext = image_format.lower()
                if image_ext == 'jpeg':
                    image_ext = 'jpg'
                
                image_filename = f"image_{client_address[0]}_{timestamp}.{image_ext}"
                image_filepath = os.path.join(self.data_dir, image_filename)
                
                # 解码base64图片数据
                try:
                    decoded_image_data = base64.b64decode(image_data)
                    with open(image_filepath, 'wb') as img_file:
                        img_file.write(decoded_image_data)
                    
                    # 统一格式：为了Web展示，统一使用相同的字段名
                    data['image_file'] = image_filename
                    data['image_data'] = image_data  # 确保有这个字段用于Web展示
                    data['image_format'] = image_format  # 确保有这个字段用于Web展示
                    
                    self.log_message(f"图片已保存到: {image_filepath}")
                    
                    # 如果有shape信息，记录图片尺寸
                    if 'shape' in data:
                        self.log_message(f"图片尺寸: {data['shape']}")
                        
                except Exception as decode_error:
                    self.log_message(f"Base64解码失败: {decode_error}")
                    
            else:
                self.log_message("未检测到有效的图片数据字段")
            
            # 保存JSON数据
            with open(json_filepath, 'w', encoding='gb2312') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            
            # 更新最新数据（用于web展示）
            self.latest_data = data.copy()
            
            self.log_message(f"数据已保存到: {json_filepath}")
            return json_filepath
        except Exception as e:
            self.log_message(f"保存数据时出错: {e}")
            return ""

    def handle_client(self, client_socket: socket.socket, client_address: tuple):
        """处理单个客户端连接"""
        try:
            self.log_message(f"接收到来自 {client_address} 的连接")
            
            # 接收数据头（包含数据长度）
            header = client_socket.recv(1024).decode('gb2312')
            if not header.startswith("DATA_LENGTH:"):
                raise ValueError("无效的数据头格式")
            
            data_length = int(header.split(":")[1].strip())
            self.log_message(f"预期接收数据长度: {data_length} 字节")
            
            # 发送确认
            client_socket.send("OK".encode('gb2312'))
            
            # 接收完整数据
            all_data = b""
            while len(all_data) < data_length:
                chunk = client_socket.recv(min(4096, data_length - len(all_data)))
                if not chunk:
                    break
                all_data += chunk

            if len(all_data) == data_length:
                try:
                    # 解码数据
                    data_str = all_data.decode('gb2312')
                    self.log_message(f"接收到完整数据 ({len(data_str)} 字符)")
                    
                    # 尝试解析JSON
                    json_data = json.loads(data_str)
                    self.log_message(f"成功解析JSON数据，包含字段: {list(json_data.keys())}")
                    
                    # 保存数据
                    saved_file = self.save_image_data(json_data, client_address)
                    
                    # 发送响应
                    if saved_file:
                        response = {
                            "status": "success",
                            "message": "图片数据已成功接收并保存",
                            "timestamp": datetime.datetime.now().isoformat(),
                            "saved_file": os.path.basename(saved_file)
                        }
                    else:
                        response = {
                            "status": "error",
                            "message": "数据接收成功但保存失败",
                            "timestamp": datetime.datetime.now().isoformat()
                        }
                    
                    response_json = json.dumps(response, ensure_ascii=False)
                    client_socket.send(response_json.encode('gb2312'))
                    
                except json.JSONDecodeError as e:
                    self.log_message(f"JSON解析错误: {e}")
                    error_response = {
                        "status": "error",
                        "message": f"JSON格式错误: {str(e)}",
                        "timestamp": datetime.datetime.now().isoformat()
                    }
                    response_json = json.dumps(error_response, ensure_ascii=False)
                    client_socket.send(response_json.encode('gb2312'))
                    
            else:
                self.log_message(f"数据接收不完整: {len(all_data)}/{data_length}")
                
        except Exception as e:
            self.log_message(f"处理客户端时出错: {e}")
        finally:
            client_socket.close()
            self.log_message(f"关闭与 {client_address} 的连接")

    def start_server(self):
        """启动服务器"""
        try:
            # 创建socket对象
            self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            
            # 绑定地址和端口
            self.server_socket.bind((self.host, self.port))
            self.server_socket.listen(5)
            self.running = True
            
            # 获取并显示本机IP地址
            local_ip = self.get_local_ip()
            self.log_message(f"图片数据服务器已启动，正在监听 {self.host}:{self.port}")
            self.log_message(f"本机IP地址: {local_ip}")
            self.log_message(f"数据接收地址: {local_ip}:{self.port}")
            self.log_message(f"Web展示地址: http://{local_ip}:{self.web_port}")
            self.log_message(f"数据将保存到目录: {os.path.abspath(self.data_dir)}")
            
            # 启动Web服务器
            web_thread = threading.Thread(target=self.start_web_server)
            web_thread.daemon = True
            web_thread.start()
            
            while self.running:
                try:
                    # 接受客户端连接
                    client_socket, client_address = self.server_socket.accept()
                    
                    # 使用线程处理客户端，支持并发连接
                    client_thread = threading.Thread(
                        target=self.handle_client,
                        args=(client_socket, client_address)
                    )
                    client_thread.daemon = True
                    client_thread.start()
                    
                except socket.error as e:
                    if self.running:
                        self.log_message(f"Socket错误: {e}")
                        
        except Exception as e:
            self.log_message(f"启动服务器时出错: {e}")
        finally:
            self.stop_server()

    def start_web_server(self):
        """启动Web服务器用于展示数据"""
        server = ImageWebServer(self)
        httpd = HTTPServer(('0.0.0.0', self.web_port), server.handler_class)
        self.log_message(f"Web服务器已启动，端口: {self.web_port}")
        httpd.serve_forever()

    def get_local_ip(self):
        """获取本机局域网IP地址"""
        try:
            temp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            temp_socket.connect(("8.8.8.8", 80))
            local_ip = temp_socket.getsockname()[0]
            temp_socket.close()
            return local_ip
        except Exception:
            return "127.0.0.1"

    def stop_server(self):
        """停止服务器"""
        self.running = False
        if self.server_socket:
            try:
                self.server_socket.close()
                self.log_message("服务器已停止")
            except Exception as e:
                self.log_message(f"停止服务器时出错: {e}")

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
    <title>嵌入式设备数据展示</title>
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
            <h1>? Cyber Railway 数据展示</h1>
            <button class="refresh-btn" onclick="loadLatestData()">刷新数据</button>
        </div>
        
        <div id="status" class="status">等待数据...</div>
        
        <div class="data-panel">
            <div class="image-panel">
                <h3>渲染图片</h3>
                <img id="renderedImage" class="rendered-image" src="" alt="等待图片数据..." style="display:none;">
                <div id="noImage">暂无图片数据</div>
            </div>
            
            <div class="info-panel">
                <h3>设备信息</h3>
                <div id="deviceInfo">
                    <p><strong>设备ID:</strong> <span id="deviceId">-</span></p>
                    <p><strong>时间戳:</strong> <span id="timestamp">-</span></p>
                    <p><strong>图片格式:</strong> <span id="imageFormat">-</span></p>
                    <p><strong>数据大小:</strong> <span id="dataSize">-</span></p>
                </div>
                
                <h3>其他数据</h3>
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
                        document.getElementById('status').textContent = '暂无数据';
                        return;
                    }
                    
                    document.getElementById('status').className = 'status success';
                    document.getElementById('status').textContent = '数据加载成功 - ' + new Date().toLocaleString();
                    
                    // 更新设备信息
                    document.getElementById('deviceId').textContent = data.device_id || '-';
                    document.getElementById('timestamp').textContent = data.timestamp ? new Date(data.timestamp * 1000).toLocaleString() : '-';
                    document.getElementById('imageFormat').textContent = data.image_format || data.format || '-';
                    
                    // 计算数据大小（优先使用image_data，其次使用image_base64）
                    let dataSize = '-';
                    if (data.image_data) {
                        dataSize = data.image_data.length + ' 字符';
                    } else if (data.image_base64) {
                        dataSize = data.image_base64.length + ' 字符';
                    }
                    document.getElementById('dataSize').textContent = dataSize;
                    
                    // 显示图片
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
                        // 处理嵌入式团队格式
                        const img = document.getElementById('renderedImage');
                        img.src = 'data:image/' + (data.format || 'png') + ';base64,' + data.image_base64;
                        img.style.display = 'block';
                        document.getElementById('noImage').style.display = 'none';
                    }
                    
                    // 显示其他数据
                    const additionalDiv = document.getElementById('additionalData');
                    additionalDiv.innerHTML = '';
                    
                    Object.keys(data).forEach(key => {
                        if (!['device_id', 'timestamp', 'image_data', 'image_format', 'image_file', 'image_base64', 'format'].includes(key)) {
                            const p = document.createElement('p');
                            if (key === 'shape') {
                                p.innerHTML = '<strong>图片尺寸:</strong> ' + data[key][0] + ' × ' + data[key][1];
                            } else {
                                p.innerHTML = '<strong>' + key + ':</strong> ' + JSON.stringify(data[key]);
                            }
                            additionalDiv.appendChild(p);
                        }
                    });
                })
                .catch(error => {
                    document.getElementById('status').className = 'status error';
                    document.getElementById('status').textContent = '加载数据失败: ' + error.message;
                });
        }
        
        // 页面加载时获取数据
        loadLatestData();
        
        // 每5秒自动刷新
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
        server.log_message("接收到停止信号")
        server.stop_server()