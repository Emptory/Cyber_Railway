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
        self.all_records = []    # 存储所有历史记录
        
        # 创建数据存储目录
        if not os.path.exists(self.data_dir):
            os.makedirs(self.data_dir)
            print(f"创建数据存储目录: {self.data_dir}")
        
        # 初始化时加载历史数据
        self.load_historical_data()

    def load_historical_data(self):
        """加载历史数据"""
        try:
            json_files = glob.glob(os.path.join(self.data_dir, "data_*.json"))
            self.all_records = []
            
            for json_file in sorted(json_files, reverse=True):  # 按时间倒序
                try:
                    with open(json_file, 'r', encoding='gb2312') as f:
                        data = json.load(f)
                        # 添加文件信息
                        data['json_file'] = os.path.basename(json_file)
                        self.all_records.append(data)
                except Exception as e:
                    self.log_message(f"加载历史文件 {json_file} 失败: {e}")
            
            self.log_message(f"加载了 {len(self.all_records)} 条历史记录")
        except Exception as e:
            self.log_message(f"加载历史数据失败: {e}")

    def get_detection_statistics(self) -> Dict[str, Any]:
        """生成检测统计数据"""
        try:
            total_inspections = len(self.all_records)
            
            # 模拟缺陷检测逻辑（实际应该基于AI分析结果）
            defect_records = []
            for record in self.all_records:
                # 这里可以根据实际的AI分析结果来判断是否有缺陷
                # 目前使用模拟数据
                if 'analysis_result' in record or len(defect_records) < total_inspections * 0.36:
                    defect_records.append(record)
            
            total_defects = len(defect_records)
            
            # 缺陷类型分布（模拟）
            defects_by_type = {
                "表面裂纹": int(total_defects * 0.51),
                "磨损": int(total_defects * 0.31), 
                "腐蚀点": int(total_defects * 0.18)
            }
            
            # 严重程度分布（模拟）
            defects_by_severity = {
                "重度": int(total_defects * 0.13),
                "中度": int(total_defects * 0.38),
                "轻度": int(total_defects * 0.49)
            }
            
            # 近一周趋势
            week_trend = self.get_weekly_trend()
            
            # 月度对比
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
            self.log_message(f"生成统计数据失败: {e}")
            return {}

    def get_weekly_trend(self) -> List[Dict[str, Any]]:
        """获取近一周的检测趋势"""
        try:
            # 获取最近7天的日期
            today = datetime.date.today()
            week_data = []
            
            for i in range(6, -1, -1):  # 7天，从6天前到今天
                date = today - datetime.timedelta(days=i)
                date_str = date.strftime("%Y-%m-%d")
                
                # 统计该天的检测记录
                day_records = [r for r in self.all_records 
                             if r.get('json_file', '').find(date.strftime("%Y%m%d")) != -1]
                
                # 模拟缺陷数量（实际应该基于AI分析）
                defects = len(day_records) // 3 if day_records else 0
                
                week_data.append({
                    "date": date_str,
                    "defects": defects
                })
            
            return week_data
        except Exception as e:
            self.log_message(f"生成周趋势数据失败: {e}")
            return []

    def get_monthly_comparison(self) -> List[Dict[str, Any]]:
        """获取月度对比数据"""
        try:
            # 模拟6个月的数据
            months = ["一月", "二月", "三月", "四月", "五月", "六月"]
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
            self.log_message(f"生成月度对比数据失败: {e}")
            return []

    def get_recent_records(self, limit: int = 20) -> List[Dict[str, Any]]:
        """获取最近的检测记录"""
        try:
            recent = self.all_records[:limit]
            
            # 为每条记录添加摘要信息
            for record in recent:
                if 'summary' not in record:
                    # 生成摘要信息
                    timestamp = record.get('timestamp', 'unknown')
                    if isinstance(timestamp, (int, float)):
                        time_str = datetime.datetime.fromtimestamp(timestamp).strftime("%Y-%m-%d %H:%M:%S")
                    else:
                        time_str = str(timestamp)
                    
                    record['summary'] = {
                        "time": time_str,
                        "status": "检测完成",
                        "hasDefect": len(recent) > 0 and (hash(record.get('json_file', '')) % 3 == 0),  # 模拟缺陷检测
                        "confidence": round(85 + (hash(record.get('json_file', '')) % 15), 1)  # 模拟置信度
                    }
            
            return recent
        except Exception as e:
            self.log_message(f"获取最近记录失败: {e}")
            return []

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
            # 重新加载历史数据
            self.load_historical_data()
            
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
                # 处理跨域预检请求
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
                self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                self.end_headers()

            def send_current_monitor_data(self):
                """发送当前监控数据（原始图像、分析图像、缺陷报告）"""
                self.send_response(200)
                self.send_header('Content-type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                if image_server.latest_data:
                    # 构造监控数据格式
                    monitor_data = {
                        "originalImage": {
                            "url": f"/images/{image_server.latest_data.get('image_file', '')}" if image_server.latest_data.get('image_file') else None,
                            "base64": image_server.latest_data.get('image_data') or image_server.latest_data.get('image_base64'),
                            "format": image_server.latest_data.get('image_format') or image_server.latest_data.get('format', 'png'),
                            "timestamp": image_server.latest_data.get('timestamp', int(datetime.datetime.now().timestamp()))
                        },
                        "analyzedImage": {
                            # 模拟分析图像（实际应该是AI处理后的图像）
                            "url": f"/images/{image_server.latest_data.get('image_file', '')}" if image_server.latest_data.get('image_file') else None,
                            "base64": image_server.latest_data.get('image_data') or image_server.latest_data.get('image_base64'),
                            "format": image_server.latest_data.get('image_format') or image_server.latest_data.get('format', 'png'),
                            "confidence": 92.5
                        },
                        "defectReport": {
                            "hasDefect": True,  # 模拟缺陷检测结果
                            "defectType": "表面裂纹",
                            "severity": "中度",
                            "confidence": 89.3,
                            "location": {"x": 245, "y": 167, "width": 128, "height": 89},
                            "description": "检测到钢轨表面存在长度约5cm的横向裂纹，建议及时维修",
                            "timestamp": image_server.latest_data.get('timestamp', int(datetime.datetime.now().timestamp()))
                        }
                    }
                else:
                    monitor_data = {"status": "no_data"}
                
                response = json.dumps(monitor_data, ensure_ascii=False)
                self.wfile.write(response.encode('utf-8'))

            def send_history_data(self):
                """发送历史检测记录"""
                self.send_response(200)
                self.send_header('Content-type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                recent_records = image_server.get_recent_records(20)
                
                # 转换为前端需要的格式
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
                """发送统计分析数据"""
                self.send_response(200)
                self.send_header('Content-type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                statistics = image_server.get_detection_statistics()
                response = json.dumps(statistics, ensure_ascii=False)
                self.wfile.write(response.encode('utf-8'))

            def send_html_page(self):
                # 简化的API信息页面
                api_info = {
                    "service": "Cyber Railway Detection API",
                    "status": "running",
                    "endpoints": {
                        "/api/monitor/current": "获取当前监控数据",
                        "/api/monitor/history": "获取历史检测记录", 
                        "/api/reports/statistics": "获取统计分析数据",
                        "/images/{filename}": "获取图片文件"
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
                """发送检测统计数据"""
                self.send_response(200)
                self.send_header('Content-type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                statistics = image_server.get_detection_statistics()
                response = json.dumps(statistics, ensure_ascii=False)
                self.wfile.write(response.encode('utf-8'))

            def send_history(self):
                """发送历史记录数据"""
                self.send_response(200)
                self.send_header('Content-type', 'application/json; charset=utf-8')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                # 获取最近的20条记录
                recent_records = image_server.get_recent_records(limit=20)
                
                response = json.dumps(recent_records, ensure_ascii=False)
                self.wfile.write(response.encode('utf-8'))
        
        return ImageHandler

if __name__ == "__main__":
    server = ImageDataServer()
    try:
        server.start_server()
    except KeyboardInterrupt:
        server.log_message("接收到停止信号")
        server.stop_server()