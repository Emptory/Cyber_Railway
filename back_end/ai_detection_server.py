#!/usr/bin/env python3
# -*- coding: GB2312 -*-
"""
AI检测服务器
提供图像分割检测API服务
"""

import os
import sys
import time
import json
import base64
import logging
from datetime import datetime
from pathlib import Path
from threading import Thread, Lock
from queue import Queue
import cv2
import numpy as np
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from io import BytesIO
from PIL import Image

# 添加AI检测模块路径
AI_DETECTION_PATH = Path(__file__).parent.parent / "ai_detection"
sys.path.insert(0, str(AI_DETECTION_PATH))

print(f"AI检测模块路径: {AI_DETECTION_PATH}")
print(f"路径是否存在: {AI_DETECTION_PATH.exists()}")

try:
    import train_check as demo
    print("AI检测模块加载成功")
except Exception as e:
    print(f"AI检测模块加载失败: {e}")
    # 尝试直接从seg_project加载
    try:
        SEG_PROJECT_PATH = Path("/home/aidlux/seg_project")
        sys.path.insert(0, str(SEG_PROJECT_PATH))
        # 切换到seg_project目录以便加载模型文件
        original_cwd = os.getcwd()
        os.chdir(str(SEG_PROJECT_PATH))
        import train_check as demo
        # 切换回原目录
        os.chdir(original_cwd)
        print("从seg_project加载AI检测模块成功")
        AI_DETECTION_PATH = SEG_PROJECT_PATH
    except Exception as e2:
        print(f"从seg_project加载也失败: {e2}")
        demo = None

app = Flask(__name__)
CORS(app)

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/home/aidlux/Cyber_Railway/back_end/ai_detection.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# 全局变量
detection_history = []
detection_lock = Lock()
continuous_detection_active = False
detection_queue = Queue()
latest_detection_result = None

# DataC图片路径
DATAC_PATH = AI_DETECTION_PATH / "DataC" / "Img"
detection_results_dir = Path(__file__).parent / "detection_results"
detection_results_dir.mkdir(exist_ok=True)

def preprocess_image_for_model(image_path):
    """预处理图片用于模型推理"""
    try:
        # 读取图片
        img = cv2.imread(str(image_path))
        if img is None:
            logger.error(f"无法读取图片: {image_path}")
            return None
        
        return img
    except Exception as e:
        logger.error(f"图片预处理失败: {e}")
        return None

def postprocess_segmentation_result(pred_result, original_image):
    """后处理分割结果，生成可视化图片"""
    try:
        # pred_result是200x200的分割掩膜
        pred_array = np.array(pred_result, dtype=np.uint8)
        
        # 创建彩色分割图
        # 假设有4个类别（0-3），给每个类别分配颜色
        colors = [
            [0, 0, 0],      # 类别0 - 黑色
            [255, 0, 0],    # 类别1 - 红色 
            [0, 255, 0],    # 类别2 - 绿色
            [0, 0, 255],    # 类别3 - 蓝色
        ]
        
        # 创建彩色图像
        colored_result = np.zeros((200, 200, 3), dtype=np.uint8)
        for class_id, color in enumerate(colors):
            mask = pred_array == class_id
            colored_result[mask] = color
        
        # 调整大小匹配原图
        original_height, original_width = original_image.shape[:2]
        colored_result = cv2.resize(colored_result, (original_width, original_height))
        
        # 创建叠加图像
        alpha = 0.6  # 透明度
        overlay = cv2.addWeighted(original_image, 1-alpha, colored_result, alpha, 0)
        
        return overlay, colored_result
        
    except Exception as e:
        logger.error(f"后处理分割结果失败: {e}")
        return original_image, original_image

def save_detection_result(original_img, result_img, detection_info):
    """保存检测结果到文件"""
    try:
        timestamp = int(time.time() * 1000)
        
        # 保存原图
        original_path = detection_results_dir / f"original_{timestamp}.jpg"
        cv2.imwrite(str(original_path), original_img)
        
        # 保存结果图
        result_path = detection_results_dir / f"result_{timestamp}.jpg"
        cv2.imwrite(str(result_path), result_img)
        
        return str(original_path), str(result_path)
        
    except Exception as e:
        logger.error(f"保存检测结果失败: {e}")
        return None, None

def image_to_base64(image_path):
    """将图片转换为base64编码"""
    try:
        with open(image_path, 'rb') as f:
            image_data = f.read()
            base64_data = base64.b64encode(image_data).decode('utf-8')
            return f"data:image/jpeg;base64,{base64_data}"
    except Exception as e:
        logger.error(f"图片转base64失败: {e}")
        return None

def process_single_image(image_path):
    """处理单张图片"""
    try:
        start_time = time.time()
        
        # 预处理图片
        original_img = preprocess_image_for_model(image_path)
        if original_img is None:
            return None
        
        # 模型推理
        if demo is None:
            logger.error("AI检测模块未加载")
            return None
            
        pred_result = demo.cal_segmentation(original_img)
        
        # 后处理
        overlay_img, colored_result = postprocess_segmentation_result(pred_result, original_img)
        
        detection_time = time.time() - start_time
        
        # 保存结果
        original_path, result_path = save_detection_result(original_img, overlay_img, {
            'detection_time': detection_time,
            'source_image': str(image_path)
        })
        
        if original_path and result_path:
            return {
                'success': True,
                'original_image': image_to_base64(original_path),
                'result_image': image_to_base64(result_path),
                'detection_time': detection_time,
                'timestamp': time.time(),
                'source_type': 'datac_image',
                'source_path': str(image_path)
            }
        else:
            return None
            
    except Exception as e:
        logger.error(f"处理图片失败: {e}")
        return None

def continuous_detection_worker():
    """连续检测工作线程"""
    global continuous_detection_active, latest_detection_result
    
    # 获取DataC中的所有图片
    image_files = list(DATAC_PATH.glob("*.jpg"))
    logger.info(f"找到 {len(image_files)} 张图片用于检测")
    
    image_index = 0
    
    while continuous_detection_active:
        try:
            if image_index >= len(image_files):
                image_index = 0  # 循环检测
            
            image_path = image_files[image_index]
            logger.info(f"检测图片: {image_path.name}")
            
            # 处理图片
            result = process_single_image(image_path)
            
            if result:
                with detection_lock:
                    latest_detection_result = result
                    detection_history.append(result)
                    # 限制历史记录数量
                    if len(detection_history) > 100:
                        detection_history.pop(0)
                
                logger.info(f"检测完成: {image_path.name}, 耗时: {result['detection_time']:.2f}s")
            
            image_index += 1
            
            # 等待一段时间再处理下一张图片
            time.sleep(3)  # 每3秒检测一张图片
            
        except Exception as e:
            logger.error(f"连续检测工作线程错误: {e}")
            time.sleep(5)
    
    logger.info("连续检测已停止")

@app.route('/api/test_detection', methods=['POST'])
def test_detection():
    """测试检测API - 处理单张DataC图片"""
    try:
        data = request.get_json()
        image_name = data.get('image_name') if data else None
        
        if not image_name:
            # 随机选择一张图片
            image_files = list(DATAC_PATH.glob("*.jpg"))
            if not image_files:
                return jsonify({'success': False, 'message': 'DataC中没有找到图片'})
            
            import random
            image_path = random.choice(image_files)
        else:
            image_path = DATAC_PATH / image_name
            if not image_path.exists():
                return jsonify({'success': False, 'message': f'图片不存在: {image_name}'})
        
        logger.info(f"开始测试检测: {image_path.name}")
        
        result = process_single_image(image_path)
        
        if result:
            with detection_lock:
                detection_history.append(result)
                if len(detection_history) > 100:
                    detection_history.pop(0)
            
            return jsonify(result)
        else:
            return jsonify({'success': False, 'message': '检测失败'})
            
    except Exception as e:
        logger.error(f"测试检测失败: {e}")
        return jsonify({'success': False, 'message': str(e)})

@app.route('/api/continuous_detect', methods=['POST'])
def continuous_detect():
    """连续检测API"""
    global continuous_detection_active
    
    try:
        data = request.get_json()
        action = data.get('action')
        
        if action == 'start':
            if continuous_detection_active:
                return jsonify({'success': False, 'message': '连续检测已在运行'})
            
            continuous_detection_active = True
            # 启动检测线程
            detection_thread = Thread(target=continuous_detection_worker, daemon=True)
            detection_thread.start()
            
            logger.info("连续检测已启动")
            return jsonify({'success': True, 'message': '连续检测已启动'})
            
        elif action == 'stop':
            continuous_detection_active = False
            logger.info("连续检测已停止")
            return jsonify({'success': True, 'message': '连续检测已停止'})
            
        else:
            return jsonify({'success': False, 'message': '无效的操作'})
            
    except Exception as e:
        logger.error(f"连续检测控制失败: {e}")
        return jsonify({'success': False, 'message': str(e)})

@app.route('/api/latest_detection', methods=['GET'])
def get_latest_detection():
    """获取最新检测结果"""
    global latest_detection_result, continuous_detection_active
    
    with detection_lock:
        if latest_detection_result:
            return jsonify({
                'success': True,
                'detection': latest_detection_result,
                'continuous_active': continuous_detection_active
            })
        else:
            return jsonify({
                'success': False,
                'message': '暂无检测结果',
                'continuous_active': continuous_detection_active
            })

@app.route('/api/detection_history', methods=['GET'])
def get_detection_history():
    """获取检测历史"""
    with detection_lock:
        return jsonify({
            'success': True,
            'history': detection_history[-20:],  # 返回最近20条记录
            'total_count': len(detection_history)
        })

@app.route('/api/clear_history', methods=['POST'])
def clear_history():
    """清空检测历史"""
    global detection_history, latest_detection_result
    
    with detection_lock:
        detection_history.clear()
        latest_detection_result = None
    
    logger.info("检测历史已清空")
    return jsonify({'success': True, 'message': '检测历史已清空'})

@app.route('/api/detect_camera_frame', methods=['POST'])
def detect_camera_frame():
    """检测摄像头帧"""
    try:
        data = request.get_json()
        camera_id = data.get('camera_id', 'camera1')
        
        # 从摄像头服务器获取当前帧
        import requests
        camera_url = f"http://localhost:8888/api/camera/base64/{camera_id}"
        
        try:
            response = requests.get(camera_url, timeout=5)
            if response.status_code == 200:
                frame_data = response.json()
                if frame_data['success']:
                    # 解码base64图像
                    import base64
                    from io import BytesIO
                    
                    # 提取base64数据
                    image_data = frame_data['image'].split(',')[1]
                    image_bytes = base64.b64decode(image_data)
                    
                    # 转换为OpenCV格式
                    image_array = np.frombuffer(image_bytes, np.uint8)
                    frame = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
                    
                    if frame is not None:
                        # 执行AI检测
                        start_time = time.time()
                        
                        if demo is None:
                            return jsonify({'success': False, 'message': 'AI检测模块未加载'})
                        
                        pred_result = demo.cal_segmentation(frame)
                        
                        # 后处理
                        overlay_img, colored_result = postprocess_segmentation_result(pred_result, frame)
                        
                        detection_time = time.time() - start_time
                        
                        # 保存结果
                        original_path, result_path = save_detection_result(frame, overlay_img, {
                            'detection_time': detection_time,
                            'source_type': 'camera_frame',
                            'camera_id': camera_id
                        })
                        
                        if original_path and result_path:
                            result = {
                                'success': True,
                                'original_image': image_to_base64(original_path),
                                'result_image': image_to_base64(result_path),
                                'detection_time': detection_time,
                                'timestamp': time.time(),
                                'source_type': 'camera_frame',
                                'camera_id': camera_id
                            }
                            
                            # 添加到历史记录
                            with detection_lock:
                                detection_history.append(result)
                                latest_detection_result = result
                                if len(detection_history) > 100:
                                    detection_history.pop(0)
                            
                            return jsonify(result)
                        
                    return jsonify({'success': False, 'message': '无法处理摄像头帧'})
                    
        except requests.exceptions.RequestException as e:
            return jsonify({'success': False, 'message': f'无法连接到摄像头服务器: {str(e)}'})
            
    except Exception as e:
        logger.error(f"检测摄像头帧失败: {e}")
        return jsonify({'success': False, 'message': str(e)})

@app.route('/api/continuous_camera_detect', methods=['POST'])
def continuous_camera_detect():
    """摄像头连续检测控制"""
    global continuous_detection_active
    
    try:
        data = request.get_json()
        action = data.get('action')
        camera_id = data.get('camera_id', 'camera1')
        
        if action == 'start':
            if continuous_detection_active:
                return jsonify({'success': False, 'message': '连续检测已在运行'})
            
            continuous_detection_active = True
            # 启动摄像头检测线程
            detection_thread = Thread(target=continuous_camera_detection_worker, args=(camera_id,), daemon=True)
            detection_thread.start()
            
            logger.info(f"摄像头连续检测已启动 - 摄像头ID: {camera_id}")
            return jsonify({'success': True, 'message': '摄像头连续检测已启动'})
            
        elif action == 'stop':
            continuous_detection_active = False
            logger.info("摄像头连续检测已停止")
            return jsonify({'success': True, 'message': '摄像头连续检测已停止'})
            
        else:
            return jsonify({'success': False, 'message': '无效的操作'})
            
    except Exception as e:
        logger.error(f"摄像头连续检测控制失败: {e}")
        return jsonify({'success': False, 'message': str(e)})

def continuous_camera_detection_worker(camera_id):
    """摄像头连续检测工作线程"""
    global continuous_detection_active, latest_detection_result
    
    import requests
    
    while continuous_detection_active:
        try:
            # 从摄像头服务器获取当前帧
            camera_url = f"http://localhost:8888/api/camera/base64/{camera_id}"
            
            try:
                response = requests.get(camera_url, timeout=5)
                if response.status_code == 200:
                    frame_data = response.json()
                    if frame_data['success']:
                        # 解码base64图像
                        import base64
                        
                        # 提取base64数据
                        image_data = frame_data['image'].split(',')[1]
                        image_bytes = base64.b64decode(image_data)
                        
                        # 转换为OpenCV格式
                        image_array = np.frombuffer(image_bytes, np.uint8)
                        frame = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
                        
                        if frame is not None and demo is not None:
                            # 执行AI检测
                            start_time = time.time()
                            pred_result = demo.cal_segmentation(frame)
                            
                            # 后处理
                            overlay_img, colored_result = postprocess_segmentation_result(pred_result, frame)
                            
                            detection_time = time.time() - start_time
                            
                            # 保存结果
                            original_path, result_path = save_detection_result(frame, overlay_img, {
                                'detection_time': detection_time,
                                'source_type': 'camera_continuous',
                                'camera_id': camera_id
                            })
                            
                            if original_path and result_path:
                                result = {
                                    'success': True,
                                    'original_image': image_to_base64(original_path),
                                    'result_image': image_to_base64(result_path),
                                    'detection_time': detection_time,
                                    'timestamp': time.time(),
                                    'source_type': 'camera_continuous',
                                    'camera_id': camera_id
                                }
                                
                                # 添加到历史记录
                                with detection_lock:
                                    detection_history.append(result)
                                    latest_detection_result = result
                                    if len(detection_history) > 100:
                                        detection_history.pop(0)
                                
                                logger.info(f"摄像头连续检测完成: {camera_id}, 耗时: {detection_time:.2f}s")
                        
            except requests.exceptions.RequestException as e:
                logger.error(f"摄像头连续检测 - 无法连接到摄像头服务器: {e}")
                
            # 等待一段时间再检测下一帧
            time.sleep(2)  # 每2秒检测一次
            
        except Exception as e:
            logger.error(f"摄像头连续检测工作线程错误: {e}")
            time.sleep(5)
    
    logger.info("摄像头连续检测已停止")

@app.route('/api/datac/images', methods=['GET'])
def get_datac_images():
    """获取DataC图片列表"""
    try:
        if not DATAC_PATH.exists():
            return jsonify({'success': False, 'message': 'DataC路径不存在', 'images': []})
        
        image_files = list(DATAC_PATH.glob("*.jpg"))
        images = []
        
        for image_file in image_files:
            try:
                stat = image_file.stat()
                size_kb = stat.st_size // 1024
                images.append({
                    'name': image_file.name,
                    'path': str(image_file.relative_to(AI_DETECTION_PATH)),
                    'size': f"{size_kb}KB",
                    'full_path': str(image_file)
                })
            except Exception as e:
                logger.warning(f"获取图片信息失败 {image_file}: {e}")
                continue
        
        # 按名称排序
        images.sort(key=lambda x: x['name'])
        
        logger.info(f"获取到 {len(images)} 张DataC图片")
        return jsonify({'success': True, 'images': images})
        
    except Exception as e:
        logger.error(f"获取DataC图片列表失败: {e}")
        return jsonify({'success': False, 'message': str(e), 'images': []})

@app.route('/api/datac/image', methods=['GET'])
def get_datac_image():
    """获取指定DataC图片"""
    try:
        image_path = request.args.get('path')
        if not image_path:
            return jsonify({'success': False, 'message': '缺少图片路径参数'})
        
        # 构建完整路径
        full_path = AI_DETECTION_PATH / image_path
        
        if not full_path.exists():
            logger.warning(f"图片不存在: {full_path}")
            return jsonify({'success': False, 'message': f'图片不存在: {image_path}'})
        
        # 直接发送图片文件
        return send_file(str(full_path), mimetype='image/jpeg')
        
    except Exception as e:
        logger.error(f"获取DataC图片失败: {e}")
        return jsonify({'success': False, 'message': str(e)})

@app.route('/api/datac/detect', methods=['POST'])
def detect_datac_image():
    """检测指定DataC图片"""
    try:
        data = request.get_json()
        image_path = data.get('image_path')
        image_name = data.get('image_name')
        
        if not image_path or not image_name:
            return jsonify({'success': False, 'message': '缺少图片路径或名称参数'})
        
        # 构建完整路径
        full_path = AI_DETECTION_PATH / image_path
        
        if not full_path.exists():
            return jsonify({'success': False, 'message': f'图片不存在: {image_path}'})
        
        logger.info(f"开始检测DataC图片: {image_name}")
        
        # 使用现有的图片处理函数
        result = process_single_image(full_path)
        
        if result:
            # 设置检测类型
            result['detection_type'] = 'datac_image'
            result['image_name'] = image_name
            
            # 构建图片URL
            result['original_image_url'] = f"/api/datac/image?path={image_path}"
            result['result_image_url'] = f"/api/datac/image?path={image_path}"  # 暂时使用原图
            
            # 添加到历史记录
            with detection_lock:
                detection_history.append(result)
                if len(detection_history) > 100:
                    detection_history.pop(0)
            
            logger.info(f"DataC图片检测完成: {image_name}")
            return jsonify(result)
        else:
            return jsonify({'success': False, 'message': '检测失败'})
            
    except Exception as e:
        logger.error(f"检测DataC图片失败: {e}")
        return jsonify({'success': False, 'message': str(e)})

@app.route('/api/status', methods=['GET'])
def get_status():
    """获取服务状态"""
    return jsonify({
        'success': True,
        'status': 'running',
        'continuous_active': continuous_detection_active,
        'history_count': len(detection_history),
        'ai_model_loaded': demo is not None,
        'datac_images': len(list(DATAC_PATH.glob("*.jpg"))) if DATAC_PATH.exists() else 0
    })

@app.route('/health', methods=['GET'])
def health_check():
    """健康检查"""
    return jsonify({'status': 'healthy', 'timestamp': time.time()})

if __name__ == '__main__':
    logger.info("启动AI检测服务器...")
    logger.info(f"AI检测模块路径: {AI_DETECTION_PATH}")
    logger.info(f"DataC图片路径: {DATAC_PATH}")
    logger.info(f"检测结果保存路径: {detection_results_dir}")
     # 新增调试输出
    print("DATAC_PATH实际图片列表：", list(DATAC_PATH.glob("*.jpg")))

    # 检查必要文件
    if not DATAC_PATH.exists():
        logger.warning(f"DataC路径不存在: {DATAC_PATH}")
    else:
        image_count = len(list(DATAC_PATH.glob("*.jpg")))
        logger.info(f"DataC中有 {image_count} 张图片")
    
    if demo is None:
        logger.warning("AI检测模块未成功加载，检测功能可能不可用")
    
    app.run(host='0.0.0.0', port=5001, debug=False)
