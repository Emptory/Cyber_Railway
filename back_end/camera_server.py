#!/usr/bin/env python3
# -*- coding: GB2312 -*-
"""
Network Railway Monitoring System - Camera Server
Support multi-camera video streaming, MJPEG and WebSocket output
"""

import cv2
import threading
import time
from flask import Flask, Response, request, jsonify
from flask_cors import CORS
import base64
import json
import logging
import os
import sys
import numpy as np
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

class DataDetector:
    """数据检测器类"""
    def __init__(self):
        self.detection_enabled = False
        self.detection_results = []
        self.last_detection_time = 0
        
    def enable_detection(self):
        """启用检测"""
        self.detection_enabled = True
        logger.info("Data detection enabled")
        
    def disable_detection(self):
        """禁用检测"""
        self.detection_enabled = False
        logger.info("Data detection disabled")
        
    def detect_frame(self, frame):
        """检测帧中的数据"""
        if not self.detection_enabled:
            return None
            
        current_time = time.time()
        if current_time - self.last_detection_time < 0.5:  # 限制检测频率为每0.5秒
            return None
            
        self.last_detection_time = current_time
        
        try:
            # 基本的图像处理检测
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            
            # 边缘检测
            edges = cv2.Canny(gray, 50, 150)
            
            # 轮廓检测
            contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            # 统计信息
            detection_result = {
                'timestamp': datetime.now().isoformat(),
                'frame_size': f"{frame.shape[1]}x{frame.shape[0]}",
                'contours_count': len(contours),
                'brightness': np.mean(gray),
                'edge_density': np.sum(edges > 0) / (edges.shape[0] * edges.shape[1]),
                'status': 'detected' if len(contours) > 10 else 'normal'
            }
            
            # 保存最近的检测结果
            self.detection_results.append(detection_result)
            if len(self.detection_results) > 100:  # 只保留最近100个结果
                self.detection_results.pop(0)
                
            return detection_result
            
        except Exception as e:
            logger.error(f"Detection error: {e}")
            return None
            
    def get_detection_results(self):
        """获取检测结果"""
        return {
            'enabled': self.detection_enabled,
            'results': self.detection_results[-10:],  # 返回最近10个结果
            'total_detections': len(self.detection_results)
        }

class CameraManager:
    def __init__(self):
        self.cameras = {}
        self.camera_threads = {}
        self.running = True
        self.detector = DataDetector()  # 添加检测器
        self.available_devices = self.scan_video_devices()
        logger.info(f"Found video devices: {self.available_devices}")
    
    def scan_video_devices(self):
        """Scan available video devices"""
        devices = []
        for i in range(10):  # Check video0 to video9
            device_path = f"/dev/video{i}"
            if os.path.exists(device_path):
                try:
                    # Try to open device to check availability
                    cap = cv2.VideoCapture(i)
                    if cap.isOpened():
                        ret, frame = cap.read()
                        if ret:
                            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
                            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
                            devices.append({
                                'id': i,
                                'path': device_path,
                                'name': f"Camera {i}",
                                'resolution': f"{width}x{height}",
                                'default_width': width,
                                'default_height': height
                            })
                    cap.release()
                except Exception as e:
                    logger.warning(f"Cannot access device {device_path}: {e}")
        return devices
    
    def start_camera(self, camera_id, device_id=0, width=640, height=480):
        """Start specified camera"""
        if camera_id in self.cameras:
            logger.warning(f"Camera {camera_id} is already running")
            return False
        
        try:
            cap = cv2.VideoCapture(device_id)
            if not cap.isOpened():
                logger.error(f"Cannot open camera device {device_id}")
                return False
            
            # Set camera parameters
            cap.set(cv2.CAP_PROP_FRAME_WIDTH, width)
            cap.set(cv2.CAP_PROP_FRAME_HEIGHT, height)
            cap.set(cv2.CAP_PROP_FPS, 30)
            cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)  # Reduce buffer size for real-time streaming
            
            # Check if we can read frames
            ret, frame = cap.read()
            if not ret:
                logger.error(f"Cannot read frames from camera {device_id}")
                cap.release()
                return False
            
            self.cameras[camera_id] = {
                'cap': cap,
                'frame': frame,
                'last_update': time.time(),
                'device_id': device_id,
                'width': width,
                'height': height,
                'fps': 0,
                'frame_count': 0,
                'lock': threading.Lock()
            }
            
            # Start camera thread
            thread = threading.Thread(target=self._camera_thread, args=(camera_id,))
            thread.daemon = True
            thread.start()
            self.camera_threads[camera_id] = thread
            
            logger.info(f"Camera {camera_id} started successfully (device: {device_id}, resolution: {width}x{height})")
            return True
            
        except Exception as e:
            logger.error(f"Failed to start camera: {e}")
            return False
    
    def _camera_thread(self, camera_id):
        """Camera capture thread"""
        camera = self.cameras[camera_id]
        cap = camera['cap']
        last_fps_time = time.time()
        
        while self.running and camera_id in self.cameras:
            try:
                ret, frame = cap.read()
                if ret:
                    with camera['lock']:
                        camera['frame'] = frame.copy()
                        camera['last_update'] = time.time()
                        camera['frame_count'] += 1
                    
                    # 执行数据检测
                    if self.detector.detection_enabled:
                        detection_result = self.detector.detect_frame(frame)
                        if detection_result:
                            logger.info(f"Detection result for {camera_id}: {detection_result['status']}")
                    
                    # Calculate FPS
                    current_time = time.time()
                    if current_time - last_fps_time >= 1.0:
                        camera['fps'] = camera['frame_count']
                        camera['frame_count'] = 0
                        last_fps_time = current_time
                else:
                    logger.warning(f"Camera {camera_id} failed to read frame")
                    time.sleep(0.1)
                    
                # Control frame rate
                time.sleep(1/30)  # Target 30 FPS
                    
            except Exception as e:
                logger.error(f"Camera {camera_id} thread error: {e}")
                break
                
        logger.info(f"Camera {camera_id} thread ended")
    
    def stop_camera(self, camera_id):
        """Stop specified camera"""
        if camera_id in self.cameras:
            self.cameras[camera_id]['cap'].release()
            del self.cameras[camera_id]
            if camera_id in self.camera_threads:
                del self.camera_threads[camera_id]
            logger.info(f"Camera {camera_id} stopped")
            return True
        return False
    
    def get_frame(self, camera_id):
        """Get camera frame (thread-safe)"""
        if camera_id in self.cameras:
            camera = self.cameras[camera_id]
            with camera['lock']:
                return camera['frame'].copy() if camera['frame'] is not None else None
        return None
    
    def get_camera_info(self, camera_id):
        """Get camera information"""
        if camera_id in self.cameras:
            camera = self.cameras[camera_id]
            return {
                'camera_id': camera_id,
                'device_id': camera['device_id'],
                'width': camera['width'],
                'height': camera['height'],
                'fps': camera['fps'],
                'last_update': camera['last_update'],
                'status': 'running'
            }
        return None
    
    def stop_all(self):
        """Stop all cameras"""
        self.running = False
        for camera_id in list(self.cameras.keys()):
            self.stop_camera(camera_id)

# Global camera manager
camera_manager = CameraManager()

def generate_mjpeg_stream(camera_id):
    """Generate MJPEG video stream"""
    while True:
        frame = camera_manager.get_frame(camera_id)
        if frame is not None:
            try:
                # Encode as JPEG with good quality
                encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 85]
                ret, jpeg = cv2.imencode('.jpg', frame, encode_param)
                if ret:
                    yield (b'--frame\r\n'
                           b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n')
                else:
                    logger.warning(f"Cannot encode frame for camera {camera_id}")
            except Exception as e:
                logger.error(f"MJPEG stream generation error: {e}")
        else:
            # Send empty frame or wait
            time.sleep(0.033)  # ~30 FPS

@app.route('/')
def index():
    """API documentation page"""
    return """
    <h1>Network Railway Monitoring System - Camera API</h1>
    <h2>Available Endpoints:</h2>
    <ul>
        <li>GET /api/devices - Get available device list</li>
        <li>POST /api/camera/start - Start camera</li>
        <li>POST /api/camera/stop - Stop camera</li>
        <li>GET /api/camera/info/&lt;camera_id&gt; - Get camera info</li>
        <li>GET /api/camera/mjpeg/&lt;camera_id&gt; - MJPEG video stream</li>
        <li>GET /api/camera/snapshot/&lt;camera_id&gt; - Take snapshot</li>
        <li>GET /api/camera/base64/&lt;camera_id&gt; - Get Base64 encoded frame</li>
        <li>POST /api/detection/toggle - Toggle detection on/off</li>
        <li>GET /api/detection/results - Get detection results</li>
        <li>GET /api/detection/snapshot/&lt;camera_id&gt; - Detect single frame</li>
        <li>GET /api/status - Server status</li>
    </ul>
    <h2>Server Status:</h2>
    <p>Available devices: {}</p>
    <p>Active cameras: {}</p>
    <p>Detection enabled: {}</p>
    """.format(len(camera_manager.available_devices), len(camera_manager.cameras), camera_manager.detector.detection_enabled)

@app.route('/api/devices')
def get_devices():
    """Get available device list"""
    return jsonify({
        'success': True,
        'devices': camera_manager.available_devices
    })

@app.route('/api/camera/start', methods=['POST'])
def start_camera():
    """Start camera"""
    data = request.get_json()
    camera_id = data.get('camera_id', 'camera1')
    device_id = data.get('device_id', 0)
    width = data.get('width', 640)
    height = data.get('height', 480)
    
    success = camera_manager.start_camera(camera_id, device_id, width, height)
    
    return jsonify({
        'success': success,
        'message': f"Camera {camera_id} {'started successfully' if success else 'failed to start'}"
    })

@app.route('/api/camera/stop', methods=['POST'])
def stop_camera():
    """Stop camera"""
    data = request.get_json()
    camera_id = data.get('camera_id')
    
    if not camera_id:
        return jsonify({
            'success': False,
            'message': 'camera_id is required'
        }), 400
    
    success = camera_manager.stop_camera(camera_id)
    
    return jsonify({
        'success': success,
        'message': f"Camera {camera_id} {'stopped successfully' if success else 'failed to stop'}"
    })

@app.route('/api/camera/info/<camera_id>')
def get_camera_info(camera_id):
    """Get camera information"""
    info = camera_manager.get_camera_info(camera_id)
    
    if info:
        return jsonify({
            'success': True,
            'info': info
        })
    else:
        return jsonify({
            'success': False,
            'message': f"Camera {camera_id} not found"
        }), 404

@app.route('/api/camera/mjpeg/<camera_id>')
def mjpeg_stream(camera_id):
    """MJPEG video stream"""
    if camera_id not in camera_manager.cameras:
        return jsonify({
            'success': False,
            'message': f"Camera {camera_id} not started"
        }), 404
    
    return Response(
        generate_mjpeg_stream(camera_id),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )

@app.route('/api/camera/snapshot/<camera_id>')
def snapshot(camera_id):
    """Get camera snapshot"""
    frame = camera_manager.get_frame(camera_id)
    
    if frame is not None:
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 90]
        ret, jpeg = cv2.imencode('.jpg', frame, encode_param)
        if ret:
            return Response(jpeg.tobytes(), mimetype='image/jpeg')
    
    return jsonify({
        'success': False,
        'message': f"Cannot get snapshot from camera {camera_id}"
    }), 404

@app.route('/api/camera/base64/<camera_id>')
def get_base64_frame(camera_id):
    """Get Base64 encoded frame"""
    frame = camera_manager.get_frame(camera_id)
    
    if frame is not None:
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 85]
        ret, jpeg = cv2.imencode('.jpg', frame, encode_param)
        if ret:
            base64_string = base64.b64encode(jpeg.tobytes()).decode('utf-8')
            return jsonify({
                'success': True,
                'image': f"data:image/jpeg;base64,{base64_string}",
                'timestamp': time.time()
            })
    
    return jsonify({
        'success': False,
        'message': f"Cannot get frame from camera {camera_id}"
    }), 404

@app.route('/api/detection/toggle', methods=['POST'])
def toggle_detection():
    """切换检测状态"""
    data = request.get_json()
    enable = data.get('enable', True)
    
    if enable:
        camera_manager.detector.enable_detection()
        message = "Detection enabled"
    else:
        camera_manager.detector.disable_detection()
        message = "Detection disabled"
    
    return jsonify({
        'success': True,
        'message': message,
        'enabled': camera_manager.detector.detection_enabled
    })

@app.route('/api/detection/results')
def get_detection_results():
    """获取检测结果"""
    results = camera_manager.detector.get_detection_results()
    return jsonify({
        'success': True,
        'detection': results
    })

@app.route('/api/detection/snapshot/<camera_id>')
def detect_snapshot(camera_id):
    """对单帧进行检测"""
    frame = camera_manager.get_frame(camera_id)
    
    if frame is not None:
        # 临时启用检测
        original_state = camera_manager.detector.detection_enabled
        camera_manager.detector.enable_detection()
        
        detection_result = camera_manager.detector.detect_frame(frame)
        
        # 恢复原始状态
        if not original_state:
            camera_manager.detector.disable_detection()
        
        if detection_result:
            return jsonify({
                'success': True,
                'detection': detection_result
            })
    
    return jsonify({
        'success': False,
        'message': f"Cannot detect frame from camera {camera_id}"
    }), 404

@app.route('/api/status')
def get_status():
    """Get server status"""
    return jsonify({
        'success': True,
        'status': 'running',
        'available_devices': len(camera_manager.available_devices),
        'active_cameras': len(camera_manager.cameras),
        'detection_enabled': camera_manager.detector.detection_enabled,
        'devices': camera_manager.available_devices,
        'cameras': {
            camera_id: camera_manager.get_camera_info(camera_id) 
            for camera_id in camera_manager.cameras.keys()
        }
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'message': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'message': 'Internal server error'
    }), 500

if __name__ == '__main__':
    try:
        print("="*60)
        print("    Network Railway Monitoring System - Camera Server")
        print("="*60)
        print(f"Available devices: {len(camera_manager.available_devices)}")
        for device in camera_manager.available_devices:
            print(f"  - {device['name']}: {device['path']} ({device['resolution']})")
        print("")
        print("Starting Flask server...")
        print("API Address: http://localhost:8888")
        print("API Documentation: http://localhost:8888")
        print("Press Ctrl+C to stop server")
        print("="*60)
        
        # Auto-start first camera for demo if available
        if camera_manager.available_devices:
            first_device = camera_manager.available_devices[0]
            success = camera_manager.start_camera('camera1', first_device['id'])
            if success:
                print(f"Auto-started camera: {first_device['name']}")
                print(f"MJPEG Stream: http://localhost:8888/api/camera/mjpeg/camera1")
        
        app.run(host='0.0.0.0', port=8888, debug=False, threaded=True)
        
    except KeyboardInterrupt:
        print("\nShutting down server...")
        camera_manager.stop_all()
        print("Server stopped successfully")
    except Exception as e:
        logger.error(f"Server startup failed: {e}")
        camera_manager.stop_all()
        sys.exit(1)
