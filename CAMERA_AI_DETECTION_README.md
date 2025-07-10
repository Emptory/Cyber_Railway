# 摄像头AI检测系统使用说明

## 功能概述

本系统新增了实时摄像头监控和AI检测功能，具有以下特性：

### ? 摄像头功能
- 实时摄像头视频流显示
- 支持多种分辨率设置（640x480, 1280x720, 1920x1080）
- 自动设备检测
- 视频流截图功能

### ? AI检测功能  
- 基于深度学习的图像分割检测
- 单帧检测和连续检测模式
- 检测结果可视化显示
- 检测性能统计

### ? 历史记录
- 检测历史记录管理
- 检测结果图像保存
- 历史数据导出功能
- 检测统计信息

## 使用方法

### 1. 启动系统

```bash
# 启动所有服务
./start_all.sh
```

### 2. 访问系统

在浏览器中打开：`http://localhost:9999`

### 3. 摄像头操作

1. **点击"监控"标签**进入监控界面
2. **启动摄像头**：点击"启动摄像头"按钮
3. **查看实时视频流**：摄像头启动后会显示实时画面
4. **调整设置**：可以选择不同的分辨率和设备

### 4. AI检测操作

1. **启动检测**：点击"启动检测"按钮开始连续检测
2. **单帧检测**：点击"检测当前帧"对当前画面进行检测
3. **查看结果**：检测结果会显示在"检测结果"区域
4. **停止检测**：点击"停止检测"按钮停止连续检测

### 5. 历史记录管理

1. **查看历史**：在"检测历史"区域查看所有检测记录
2. **刷新历史**：点击"刷新历史"获取最新记录
3. **导出历史**：点击"导出历史"下载JSON格式的历史数据
4. **清空历史**：点击"清空历史"删除所有历史记录

## API接口

### 摄像头服务器 (端口8888)

- `GET /api/status` - 获取服务状态
- `GET /api/devices` - 获取可用设备列表
- `POST /api/camera/start` - 启动摄像头
- `POST /api/camera/stop` - 停止摄像头
- `GET /api/camera/mjpeg/{camera_id}` - MJPEG视频流
- `GET /api/camera/base64/{camera_id}` - 获取base64编码的帧
- `GET /api/camera/snapshot/{camera_id}` - 获取截图

### AI检测服务器 (端口5001)

- `GET /api/status` - 获取服务状态
- `POST /api/detect_camera_frame` - 检测摄像头帧
- `POST /api/continuous_camera_detect` - 控制连续检测
- `GET /api/latest_detection` - 获取最新检测结果
- `GET /api/detection_history` - 获取检测历史
- `POST /api/clear_history` - 清空历史记录

## 配置说明

### 摄像头配置
- 默认设备：`/dev/video0`
- 默认分辨率：`640x480`
- 默认帧率：`30fps`

### AI检测配置
- 连续检测间隔：2秒
- 历史记录上限：100条
- 支持的图像格式：JPG

## 故障排除

### 1. 摄像头无法启动
- 检查摄像头设备是否连接
- 确认`/dev/video0`设备文件存在
- 检查设备权限：`sudo chmod 666 /dev/video0`

### 2. AI检测失败
- 确认AI模型文件存在
- 检查`ai_detection/model.pth`路径
- 查看AI检测服务器日志

### 3. 前端无法访问
- 确认所有服务都已启动
- 检查防火墙设置
- 查看浏览器控制台错误信息

### 4. 性能问题
- 降低摄像头分辨率
- 增加检测间隔时间
- 清理历史记录

## 测试功能

启动系统后，可以使用以下curl命令测试各项功能：

### 测试摄像头服务器
```bash
# 检查服务状态
curl http://localhost:8888/api/status

# 获取设备列表
curl http://localhost:8888/api/devices

# 启动摄像头
curl -X POST -H "Content-Type: application/json" \
     -d '{"camera_id": "camera1", "device_id": 0}' \
     http://localhost:8888/api/camera/start

# 停止摄像头
curl -X POST -H "Content-Type: application/json" \
     -d '{"camera_id": "camera1"}' \
     http://localhost:8888/api/camera/stop
```

### 测试AI检测服务器
```bash
# 检查服务状态
curl http://localhost:5001/api/status

# 检测单帧（需要先启动摄像头）
curl -X POST -H "Content-Type: application/json" \
     -d '{"camera_id": "camera1"}' \
     http://localhost:5001/api/detect_camera_frame

# 获取检测历史
curl http://localhost:5001/api/detection_history
```

## 技术架构

```
前端 (HTML/CSS/JavaScript)
    ↓
摄像头服务器 (Flask, OpenCV)
    ↓
AI检测服务器 (Flask, PyTorch)
    ↓
AI模型 (深度学习分割模型)
```

## 依赖项

- Python 3.7+
- OpenCV
- Flask
- Flask-CORS
- PyTorch
- NumPy
- Pillow

## 日志文件

- 摄像头服务器：`backend.log`
- AI检测服务器：`ai_detection.log`
- 前端服务器：`frontend.log`

## 支持

如有问题，请检查：
1. 日志文件中的错误信息
2. 浏览器控制台的JavaScript错误
3. 运行测试脚本的输出结果

---

*网络铁路监控系统 - 摄像头AI检测模块*
