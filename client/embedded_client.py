# -*- coding: GB2312 -*-
import socket
import json
import time
import base64
import io
from PIL import Image, ImageDraw, ImageFont

def load_image_from_file(image_path):
    """从文件加载图片并转换为base64"""
    try:
        # 检查文件是否存在
        import os
        if not os.path.exists(image_path):
            print(f"? 图片文件不存在: {image_path}")
            return None, None
        
        # 获取文件扩展名来确定格式
        file_ext = os.path.splitext(image_path)[1].lower()
        if file_ext == '.jpg' or file_ext == '.jpeg':
            image_format = 'jpeg'
        elif file_ext == '.png':
            image_format = 'png'
        elif file_ext == '.bmp':
            image_format = 'bmp'
        else:
            print(f"? 不支持的图片格式: {file_ext}")
            return None, None
        
        # 读取并转换图片
        with open(image_path, 'rb') as image_file:
            image_data = base64.b64encode(image_file.read()).decode('ascii')
        
        print(f"? 成功加载图片: {image_path}")
        print(f"  - 格式: {image_format}")
        print(f"  - 大小: {len(image_data)} 字符")
        
        return image_data, image_format
        
    except Exception as e:
        print(f"? 读取图片文件时出错: {e}")
        return None, None

def create_sample_image():
    """创建示例渲染图片（作为备用方案）"""
    # 创建一个示例图片
    width, height = 800, 600
    image = Image.new('RGB', (width, height), color='black')
    draw = ImageDraw.Draw(image)
    
    # 绘制一些示例内容
    draw.rectangle([50, 50, width-50, height-50], outline='white', width=3)
    draw.text((100, 100), "Cyber Railway System", fill='white')
    draw.text((100, 150), f"Time: {time.strftime('%Y-%m-%d %H:%M:%S')}", fill='yellow')
    
    # 绘制一些传感器数据
    import random
    temp = random.uniform(20, 30)
    humidity = random.uniform(40, 80)
    draw.text((100, 200), f"Temperature: {temp:.1f}°C", fill='green')
    draw.text((100, 250), f"Humidity: {humidity:.1f}%", fill='blue')
    
    # 转换为base64
    buffer = io.BytesIO()
    image.save(buffer, format='PNG')
    image_data = base64.b64encode(buffer.getvalue()).decode('ascii')
    
    return image_data

def send_image_data_to_server(server_ip, server_port, data):
    """发送图片数据到服务器"""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(30)  # 增加超时时间
        
        sock.connect((server_ip, server_port))
        
        # 转换为JSON
        json_str = json.dumps(data, ensure_ascii=False)
        message_bytes = json_str.encode('gb2312')
        
        # 发送数据长度头
        header = f"DATA_LENGTH:{len(message_bytes)}\n"
        sock.send(header.encode('gb2312'))
        
        # 等待确认
        ack = sock.recv(1024).decode('gb2312')
        if ack != "OK":
            raise Exception("服务器未确认数据传输")
        
        # 发送实际数据
        sock.send(message_bytes)
        
        # 接收响应
        response = sock.recv(4096).decode('gb2312')
        response_data = json.loads(response)
        
        sock.close()
        
        if response_data.get('status') == 'success':
            print(f"? 图片数据发送成功: {response_data.get('message')}")
            return True
        else:
            print(f"? 发送失败: {response_data.get('message')}")
            return False
            
    except Exception as e:
        print(f"? 连接错误: {e}")
        return False

def find_latest_json_file(directory_path):
    """在指定目录中查找最新的JSON文件"""
    try:
        import os
        import glob
        
        # 获取当前工作目录和绝对路径用于调试
        current_dir = os.getcwd()
        abs_path = os.path.abspath(directory_path)
        
        print(f"调试信息:")
        print(f"  - 当前工作目录: {current_dir}")
        print(f"  - 相对路径: {directory_path}")
        print(f"  - 绝对路径: {abs_path}")
        
        if not os.path.exists(directory_path):
            print(f"? 目录不存在: {directory_path}")
            print(f"? 绝对路径也不存在: {abs_path}")
            
            # 尝试其他可能的路径
            alternative_paths = [
                "d:/Git/repository/Cyber_Railway/c_predict",
                "../c_predict",
                "../../c_predict",
                "./c_predict",
                "c_predict"
            ]
            
            print("尝试其他可能的路径:")
            for alt_path in alternative_paths:
                if os.path.exists(alt_path):
                    print(f"? 找到可用路径: {alt_path}")
                    directory_path = alt_path
                    break
                else:
                    print(f"? 路径不存在: {alt_path}")
            else:
                return None
        
        # 查找所有JSON文件
        json_pattern = os.path.join(directory_path, "*.json")
        json_files = glob.glob(json_pattern)
        
        if not json_files:
            print(f"? 目录中没有找到JSON文件: {directory_path}")
            return None
        
        # 按修改时间排序，获取最新的文件
        latest_file = max(json_files, key=os.path.getmtime)
        
        print(f"? 找到 {len(json_files)} 个JSON文件")
        print(f"? 使用最新文件: {os.path.basename(latest_file)}")
        
        return latest_file
        
    except Exception as e:
        print(f"? 查找JSON文件时出错: {e}")
        return None

def load_json_data_from_file(json_path):
    """从JSON文件加载图片数据"""
    try:
        # 检查文件是否存在
        import os
        if not os.path.exists(json_path):
            print(f"? JSON文件不存在: {json_path}")
            return None
        
        # 读取JSON文件
        with open(json_path, 'r', encoding='utf-8') as json_file:
            json_data = json.load(json_file)
        
        print(f"? 成功加载JSON文件: {os.path.basename(json_path)}")
        print(f"  - 包含字段: {list(json_data.keys())}")
        
        # 检查是否包含图片数据
        if 'image_base64' in json_data:
            print(f"  - 图片格式: {json_data.get('format', 'unknown')}")
            print(f"  - 图片尺寸: {json_data.get('shape', 'unknown')}")
            print(f"  - Base64大小: {len(json_data['image_base64'])} 字符")
        
        return json_data
        
    except Exception as e:
        print(f"? 读取JSON文件时出错: {e}")
        return None

def main():
    """主函数"""
    server_ip = "10.13.49.220"  # 修改为你的服务器IP
    device_id = "embedded_device_001"
    interval = 10  # 每10秒发送一次
    
    # 配置输入文件路径
    json_directory = "../c_predict"  # 嵌入式团队JSON文件的目录
    image_file_path = "rendered_image.jpg"  # 备用的图片文件路径
    
    print(f"开始向 {server_ip}:8080 发送图片数据，设备ID: {device_id}")
    print(f"发送间隔: {interval}秒")
    print(f"JSON文件目录: {json_directory}")
    print(f"备用图片路径: {image_file_path}")
    
    try:
        while True:
            print("\n" + "="*50)
            print("读取图片数据...")
            
            data = None
            
            # 方式1: 自动查找并使用最新的JSON文件
            latest_json_file = find_latest_json_file("../c_predict")
            if latest_json_file:
                json_data = load_json_data_from_file(latest_json_file)
                if json_data:
                    print("使用JSON文件数据...")
                    # 使用嵌入式团队的JSON格式，但添加设备信息
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
                        "source_file": latest_json_file.split('\\')[-1]  # 记录源文件名
                    }
                
            # 方式2: 如果JSON文件读取失败，尝试从图片文件加载
            if not data:
                print("JSON文件读取失败，尝试图片文件...")
                image_data, image_format = load_image_from_file(image_file_path)
                
                if image_data:
                    print("使用图片文件数据...")
                    data = {
                        "device_id": device_id,
                        "timestamp": int(time.time()),
                        "image_data": image_data,
                        "image_format": image_format,
                        "render_info": {
                            "resolution": "实际图片尺寸",
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
            
            # 方式3: 如果都失败，使用生成的示例图片
            if not data:
                print("所有文件读取失败，使用示例图片...")
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
            
            # 显示数据信息
            if 'image_base64' in data:
                print(f"图片数据大小: {len(data['image_base64'])} 字符 (JSON格式)")
                if 'source_file' in data:
                    print(f"源文件: {data['source_file']}")
            elif 'image_data' in data:
                print(f"图片数据大小: {len(data['image_data'])} 字符 (原有格式)")
            
            print("发送数据到服务器...")
            
            # 发送数据
            send_image_data_to_server(server_ip, 8080, data)
            
            print(f"等待 {interval} 秒...")
            time.sleep(interval)
            
    except KeyboardInterrupt:
        print("\n停止发送")

if __name__ == "__main__":
    main()