#!/usr/bin/env python3
# -*- coding: GB2312 -*-
"""
AI��������
�ṩͼ��ָ���API����
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

# ���AI���ģ��·��
AI_DETECTION_PATH = Path(__file__).parent.parent / "ai_detection"
sys.path.insert(0, str(AI_DETECTION_PATH))

print(f"AI���ģ��·��: {AI_DETECTION_PATH}")
print(f"·���Ƿ����: {AI_DETECTION_PATH.exists()}")

try:
    import train_check as demo
    print("AI���ģ����سɹ�")
except Exception as e:
    print(f"AI���ģ�����ʧ��: {e}")
    # ����ֱ�Ӵ�seg_project����
    try:
        SEG_PROJECT_PATH = Path("/home/aidlux/seg_project")
        sys.path.insert(0, str(SEG_PROJECT_PATH))
        # �л���seg_projectĿ¼�Ա����ģ���ļ�
        original_cwd = os.getcwd()
        os.chdir(str(SEG_PROJECT_PATH))
        import train_check as demo
        # �л���ԭĿ¼
        os.chdir(original_cwd)
        print("��seg_project����AI���ģ��ɹ�")
        AI_DETECTION_PATH = SEG_PROJECT_PATH
    except Exception as e2:
        print(f"��seg_project����Ҳʧ��: {e2}")
        demo = None

app = Flask(__name__)
CORS(app)

# ������־
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/home/aidlux/Cyber_Railway/back_end/ai_detection.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# ȫ�ֱ���
detection_history = []
detection_lock = Lock()
continuous_detection_active = False
detection_queue = Queue()
latest_detection_result = None

# DataCͼƬ·��
DATAC_PATH = AI_DETECTION_PATH / "DataC" / "Img"
detection_results_dir = Path(__file__).parent / "detection_results"
detection_results_dir.mkdir(exist_ok=True)

def preprocess_image_for_model(image_path):
    """Ԥ����ͼƬ����ģ������"""
    try:
        # ��ȡͼƬ
        img = cv2.imread(str(image_path))
        if img is None:
            logger.error(f"�޷���ȡͼƬ: {image_path}")
            return None
        
        return img
    except Exception as e:
        logger.error(f"ͼƬԤ����ʧ��: {e}")
        return None

def postprocess_segmentation_result(pred_result, original_image):
    """����ָ��������ɿ��ӻ�ͼƬ"""
    try:
        # pred_result��200x200�ķָ���Ĥ
        pred_array = np.array(pred_result, dtype=np.uint8)
        
        # ������ɫ�ָ�ͼ
        # ������4�����0-3������ÿ����������ɫ
        colors = [
            [0, 0, 0],      # ���0 - ��ɫ
            [255, 0, 0],    # ���1 - ��ɫ 
            [0, 255, 0],    # ���2 - ��ɫ
            [0, 0, 255],    # ���3 - ��ɫ
        ]
        
        # ������ɫͼ��
        colored_result = np.zeros((200, 200, 3), dtype=np.uint8)
        for class_id, color in enumerate(colors):
            mask = pred_array == class_id
            colored_result[mask] = color
        
        # ������Сƥ��ԭͼ
        original_height, original_width = original_image.shape[:2]
        colored_result = cv2.resize(colored_result, (original_width, original_height))
        
        # ��������ͼ��
        alpha = 0.6  # ͸����
        overlay = cv2.addWeighted(original_image, 1-alpha, colored_result, alpha, 0)
        
        return overlay, colored_result
        
    except Exception as e:
        logger.error(f"����ָ���ʧ��: {e}")
        return original_image, original_image

def save_detection_result(original_img, result_img, detection_info):
    """�����������ļ�"""
    try:
        timestamp = int(time.time() * 1000)
        
        # ����ԭͼ
        original_path = detection_results_dir / f"original_{timestamp}.jpg"
        cv2.imwrite(str(original_path), original_img)
        
        # ������ͼ
        result_path = detection_results_dir / f"result_{timestamp}.jpg"
        cv2.imwrite(str(result_path), result_img)
        
        return str(original_path), str(result_path)
        
    except Exception as e:
        logger.error(f"��������ʧ��: {e}")
        return None, None

def image_to_base64(image_path):
    """��ͼƬת��Ϊbase64����"""
    try:
        with open(image_path, 'rb') as f:
            image_data = f.read()
            base64_data = base64.b64encode(image_data).decode('utf-8')
            return f"data:image/jpeg;base64,{base64_data}"
    except Exception as e:
        logger.error(f"ͼƬתbase64ʧ��: {e}")
        return None

def process_single_image(image_path):
    """������ͼƬ"""
    try:
        start_time = time.time()
        
        # Ԥ����ͼƬ
        original_img = preprocess_image_for_model(image_path)
        if original_img is None:
            return None
        
        # ģ������
        if demo is None:
            logger.error("AI���ģ��δ����")
            return None
            
        pred_result = demo.cal_segmentation(original_img)
        
        # ����
        overlay_img, colored_result = postprocess_segmentation_result(pred_result, original_img)
        
        detection_time = time.time() - start_time
        
        # ������
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
        logger.error(f"����ͼƬʧ��: {e}")
        return None

def continuous_detection_worker():
    """������⹤���߳�"""
    global continuous_detection_active, latest_detection_result
    
    # ��ȡDataC�е�����ͼƬ
    image_files = list(DATAC_PATH.glob("*.jpg"))
    logger.info(f"�ҵ� {len(image_files)} ��ͼƬ���ڼ��")
    
    image_index = 0
    
    while continuous_detection_active:
        try:
            if image_index >= len(image_files):
                image_index = 0  # ѭ�����
            
            image_path = image_files[image_index]
            logger.info(f"���ͼƬ: {image_path.name}")
            
            # ����ͼƬ
            result = process_single_image(image_path)
            
            if result:
                with detection_lock:
                    latest_detection_result = result
                    detection_history.append(result)
                    # ������ʷ��¼����
                    if len(detection_history) > 100:
                        detection_history.pop(0)
                
                logger.info(f"������: {image_path.name}, ��ʱ: {result['detection_time']:.2f}s")
            
            image_index += 1
            
            # �ȴ�һ��ʱ���ٴ�����һ��ͼƬ
            time.sleep(3)  # ÿ3����һ��ͼƬ
            
        except Exception as e:
            logger.error(f"������⹤���̴߳���: {e}")
            time.sleep(5)
    
    logger.info("���������ֹͣ")

@app.route('/api/test_detection', methods=['POST'])
def test_detection():
    """���Լ��API - ������DataCͼƬ"""
    try:
        data = request.get_json()
        image_name = data.get('image_name') if data else None
        
        if not image_name:
            # ���ѡ��һ��ͼƬ
            image_files = list(DATAC_PATH.glob("*.jpg"))
            if not image_files:
                return jsonify({'success': False, 'message': 'DataC��û���ҵ�ͼƬ'})
            
            import random
            image_path = random.choice(image_files)
        else:
            image_path = DATAC_PATH / image_name
            if not image_path.exists():
                return jsonify({'success': False, 'message': f'ͼƬ������: {image_name}'})
        
        logger.info(f"��ʼ���Լ��: {image_path.name}")
        
        result = process_single_image(image_path)
        
        if result:
            with detection_lock:
                detection_history.append(result)
                if len(detection_history) > 100:
                    detection_history.pop(0)
            
            return jsonify(result)
        else:
            return jsonify({'success': False, 'message': '���ʧ��'})
            
    except Exception as e:
        logger.error(f"���Լ��ʧ��: {e}")
        return jsonify({'success': False, 'message': str(e)})

@app.route('/api/continuous_detect', methods=['POST'])
def continuous_detect():
    """�������API"""
    global continuous_detection_active
    
    try:
        data = request.get_json()
        action = data.get('action')
        
        if action == 'start':
            if continuous_detection_active:
                return jsonify({'success': False, 'message': '���������������'})
            
            continuous_detection_active = True
            # ��������߳�
            detection_thread = Thread(target=continuous_detection_worker, daemon=True)
            detection_thread.start()
            
            logger.info("�������������")
            return jsonify({'success': True, 'message': '�������������'})
            
        elif action == 'stop':
            continuous_detection_active = False
            logger.info("���������ֹͣ")
            return jsonify({'success': True, 'message': '���������ֹͣ'})
            
        else:
            return jsonify({'success': False, 'message': '��Ч�Ĳ���'})
            
    except Exception as e:
        logger.error(f"����������ʧ��: {e}")
        return jsonify({'success': False, 'message': str(e)})

@app.route('/api/latest_detection', methods=['GET'])
def get_latest_detection():
    """��ȡ���¼����"""
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
                'message': '���޼����',
                'continuous_active': continuous_detection_active
            })

@app.route('/api/detection_history', methods=['GET'])
def get_detection_history():
    """��ȡ�����ʷ"""
    with detection_lock:
        return jsonify({
            'success': True,
            'history': detection_history[-20:],  # �������20����¼
            'total_count': len(detection_history)
        })

@app.route('/api/clear_history', methods=['POST'])
def clear_history():
    """��ռ����ʷ"""
    global detection_history, latest_detection_result
    
    with detection_lock:
        detection_history.clear()
        latest_detection_result = None
    
    logger.info("�����ʷ�����")
    return jsonify({'success': True, 'message': '�����ʷ�����'})

@app.route('/api/detect_camera_frame', methods=['POST'])
def detect_camera_frame():
    """�������ͷ֡"""
    try:
        data = request.get_json()
        camera_id = data.get('camera_id', 'camera1')
        
        # ������ͷ��������ȡ��ǰ֡
        import requests
        camera_url = f"http://localhost:8888/api/camera/base64/{camera_id}"
        
        try:
            response = requests.get(camera_url, timeout=5)
            if response.status_code == 200:
                frame_data = response.json()
                if frame_data['success']:
                    # ����base64ͼ��
                    import base64
                    from io import BytesIO
                    
                    # ��ȡbase64����
                    image_data = frame_data['image'].split(',')[1]
                    image_bytes = base64.b64decode(image_data)
                    
                    # ת��ΪOpenCV��ʽ
                    image_array = np.frombuffer(image_bytes, np.uint8)
                    frame = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
                    
                    if frame is not None:
                        # ִ��AI���
                        start_time = time.time()
                        
                        if demo is None:
                            return jsonify({'success': False, 'message': 'AI���ģ��δ����'})
                        
                        pred_result = demo.cal_segmentation(frame)
                        
                        # ����
                        overlay_img, colored_result = postprocess_segmentation_result(pred_result, frame)
                        
                        detection_time = time.time() - start_time
                        
                        # ������
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
                            
                            # ��ӵ���ʷ��¼
                            with detection_lock:
                                detection_history.append(result)
                                latest_detection_result = result
                                if len(detection_history) > 100:
                                    detection_history.pop(0)
                            
                            return jsonify(result)
                        
                    return jsonify({'success': False, 'message': '�޷���������ͷ֡'})
                    
        except requests.exceptions.RequestException as e:
            return jsonify({'success': False, 'message': f'�޷����ӵ�����ͷ������: {str(e)}'})
            
    except Exception as e:
        logger.error(f"�������ͷ֡ʧ��: {e}")
        return jsonify({'success': False, 'message': str(e)})

@app.route('/api/continuous_camera_detect', methods=['POST'])
def continuous_camera_detect():
    """����ͷ����������"""
    global continuous_detection_active
    
    try:
        data = request.get_json()
        action = data.get('action')
        camera_id = data.get('camera_id', 'camera1')
        
        if action == 'start':
            if continuous_detection_active:
                return jsonify({'success': False, 'message': '���������������'})
            
            continuous_detection_active = True
            # ��������ͷ����߳�
            detection_thread = Thread(target=continuous_camera_detection_worker, args=(camera_id,), daemon=True)
            detection_thread.start()
            
            logger.info(f"����ͷ������������� - ����ͷID: {camera_id}")
            return jsonify({'success': True, 'message': '����ͷ�������������'})
            
        elif action == 'stop':
            continuous_detection_active = False
            logger.info("����ͷ���������ֹͣ")
            return jsonify({'success': True, 'message': '����ͷ���������ֹͣ'})
            
        else:
            return jsonify({'success': False, 'message': '��Ч�Ĳ���'})
            
    except Exception as e:
        logger.error(f"����ͷ����������ʧ��: {e}")
        return jsonify({'success': False, 'message': str(e)})

def continuous_camera_detection_worker(camera_id):
    """����ͷ������⹤���߳�"""
    global continuous_detection_active, latest_detection_result
    
    import requests
    
    while continuous_detection_active:
        try:
            # ������ͷ��������ȡ��ǰ֡
            camera_url = f"http://localhost:8888/api/camera/base64/{camera_id}"
            
            try:
                response = requests.get(camera_url, timeout=5)
                if response.status_code == 200:
                    frame_data = response.json()
                    if frame_data['success']:
                        # ����base64ͼ��
                        import base64
                        
                        # ��ȡbase64����
                        image_data = frame_data['image'].split(',')[1]
                        image_bytes = base64.b64decode(image_data)
                        
                        # ת��ΪOpenCV��ʽ
                        image_array = np.frombuffer(image_bytes, np.uint8)
                        frame = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
                        
                        if frame is not None and demo is not None:
                            # ִ��AI���
                            start_time = time.time()
                            pred_result = demo.cal_segmentation(frame)
                            
                            # ����
                            overlay_img, colored_result = postprocess_segmentation_result(pred_result, frame)
                            
                            detection_time = time.time() - start_time
                            
                            # ������
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
                                
                                # ��ӵ���ʷ��¼
                                with detection_lock:
                                    detection_history.append(result)
                                    latest_detection_result = result
                                    if len(detection_history) > 100:
                                        detection_history.pop(0)
                                
                                logger.info(f"����ͷ����������: {camera_id}, ��ʱ: {detection_time:.2f}s")
                        
            except requests.exceptions.RequestException as e:
                logger.error(f"����ͷ������� - �޷����ӵ�����ͷ������: {e}")
                
            # �ȴ�һ��ʱ���ټ����һ֡
            time.sleep(2)  # ÿ2����һ��
            
        except Exception as e:
            logger.error(f"����ͷ������⹤���̴߳���: {e}")
            time.sleep(5)
    
    logger.info("����ͷ���������ֹͣ")

@app.route('/api/datac/images', methods=['GET'])
def get_datac_images():
    """��ȡDataCͼƬ�б�"""
    try:
        if not DATAC_PATH.exists():
            return jsonify({'success': False, 'message': 'DataC·��������', 'images': []})
        
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
                logger.warning(f"��ȡͼƬ��Ϣʧ�� {image_file}: {e}")
                continue
        
        # ����������
        images.sort(key=lambda x: x['name'])
        
        logger.info(f"��ȡ�� {len(images)} ��DataCͼƬ")
        return jsonify({'success': True, 'images': images})
        
    except Exception as e:
        logger.error(f"��ȡDataCͼƬ�б�ʧ��: {e}")
        return jsonify({'success': False, 'message': str(e), 'images': []})

@app.route('/api/datac/image', methods=['GET'])
def get_datac_image():
    """��ȡָ��DataCͼƬ"""
    try:
        image_path = request.args.get('path')
        if not image_path:
            return jsonify({'success': False, 'message': 'ȱ��ͼƬ·������'})
        
        # ��������·��
        full_path = AI_DETECTION_PATH / image_path
        
        if not full_path.exists():
            logger.warning(f"ͼƬ������: {full_path}")
            return jsonify({'success': False, 'message': f'ͼƬ������: {image_path}'})
        
        # ֱ�ӷ���ͼƬ�ļ�
        return send_file(str(full_path), mimetype='image/jpeg')
        
    except Exception as e:
        logger.error(f"��ȡDataCͼƬʧ��: {e}")
        return jsonify({'success': False, 'message': str(e)})

@app.route('/api/datac/detect', methods=['POST'])
def detect_datac_image():
    """���ָ��DataCͼƬ"""
    try:
        data = request.get_json()
        image_path = data.get('image_path')
        image_name = data.get('image_name')
        
        if not image_path or not image_name:
            return jsonify({'success': False, 'message': 'ȱ��ͼƬ·�������Ʋ���'})
        
        # ��������·��
        full_path = AI_DETECTION_PATH / image_path
        
        if not full_path.exists():
            return jsonify({'success': False, 'message': f'ͼƬ������: {image_path}'})
        
        logger.info(f"��ʼ���DataCͼƬ: {image_name}")
        
        # ʹ�����е�ͼƬ������
        result = process_single_image(full_path)
        
        if result:
            # ���ü������
            result['detection_type'] = 'datac_image'
            result['image_name'] = image_name
            
            # ����ͼƬURL
            result['original_image_url'] = f"/api/datac/image?path={image_path}"
            result['result_image_url'] = f"/api/datac/image?path={image_path}"  # ��ʱʹ��ԭͼ
            
            # ��ӵ���ʷ��¼
            with detection_lock:
                detection_history.append(result)
                if len(detection_history) > 100:
                    detection_history.pop(0)
            
            logger.info(f"DataCͼƬ������: {image_name}")
            return jsonify(result)
        else:
            return jsonify({'success': False, 'message': '���ʧ��'})
            
    except Exception as e:
        logger.error(f"���DataCͼƬʧ��: {e}")
        return jsonify({'success': False, 'message': str(e)})

@app.route('/api/status', methods=['GET'])
def get_status():
    """��ȡ����״̬"""
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
    """�������"""
    return jsonify({'status': 'healthy', 'timestamp': time.time()})

if __name__ == '__main__':
    logger.info("����AI��������...")
    logger.info(f"AI���ģ��·��: {AI_DETECTION_PATH}")
    logger.info(f"DataCͼƬ·��: {DATAC_PATH}")
    logger.info(f"���������·��: {detection_results_dir}")
     # �����������
    print("DATAC_PATHʵ��ͼƬ�б�", list(DATAC_PATH.glob("*.jpg")))

    # ����Ҫ�ļ�
    if not DATAC_PATH.exists():
        logger.warning(f"DataC·��������: {DATAC_PATH}")
    else:
        image_count = len(list(DATAC_PATH.glob("*.jpg")))
        logger.info(f"DataC���� {image_count} ��ͼƬ")
    
    if demo is None:
        logger.warning("AI���ģ��δ�ɹ����أ���⹦�ܿ��ܲ�����")
    
    app.run(host='0.0.0.0', port=5001, debug=False)
