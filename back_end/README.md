# 网络铁路监控系统 - 后端摄像头服务

## 功能简介

本后端服务专门用于处理本地嵌入式设备的摄像头视频流，支持多路摄像头同时接入，提供RESTful API接口供前端调用。

## 主要特性

### ? 摄像头支持
- **多设备支持**: 自动扫描 `/dev/video0` 到 `/dev/video9`
- **实时流媒体**: MJPEG格式视频流输出
- **多分辨率**: 支持自定义分辨率设置
- **帧率控制**: 可调节帧率和画质

### ? API接口
- **设备管理**: 获取可用摄像头列表
- **流控制**: 启动/停止视频流
- **实时截图**: 单帧图像获取
- **状态监控**: 摄像头运行状态查询

### ? 网络功能
- **跨域支持**: CORS配置，支持前端调用
- **多线程**: 高并发处理能力
- **异常处理**: 完善的错误处理机制

## 文件结构

```
back_end/
├── camera_server.py           # 主服务器文件
├── start_camera_server.sh     # 启动脚本
├── requirements.txt           # Python依赖
└── README.md                 # 说明文档
```

## 快速开始

### 1. 安装依赖

```bash
cd back_end
./start_camera_server.sh
```

### 2. 手动安装

```bash
cd back_end
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 camera_server.py
```

## API接口说明

### 基础信息
- **服务地址**: http://localhost:8888
- **数据格式**: JSON
- **跨域**: 已启用CORS

### 接口列表

#### 1. 获取设备列表
```
GET /api/devices
```

**响应示例**:
```json
{
    "success": true,
    "devices": [
        {
            "id": 0,
            "path": "/dev/video0",
            "name": "摄像头 0",
            "resolution": "640x480"
        }
    ]
}
```

#### 2. 启动摄像头
```
POST /api/camera/start
Content-Type: application/json
```

**请求参数**:
```json
{
    "camera_id": "camera1",
    "device_id": 0,
    "width": 640,
    "height": 480
}
```

#### 3. 停止摄像头
```
POST /api/camera/stop
Content-Type: application/json
```

**请求参数**:
```json
{
    "camera_id": "camera1"
}
```

#### 4. 获取摄像头信息
```
GET /api/camera/info/{camera_id}
```

#### 5. MJPEG视频流
```
GET /api/camera/mjpeg/{camera_id}
```

#### 6. 获取截图
```
GET /api/camera/snapshot/{camera_id}
```

#### 7. 获取Base64图像
```
GET /api/camera/base64/{camera_id}
```

## 使用示例

### JavaScript前端调用

```javascript
// 1. 获取可用设备
fetch('http://localhost:8888/api/devices')
    .then(response => response.json())
    .then(data => console.log(data.devices));

// 2. 启动摄像头
fetch('http://localhost:8888/api/camera/start', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        camera_id: 'camera1',
        device_id: 0,
        width: 1280,
        height: 720
    })
});

// 3. 在HTML中显示MJPEG流
<img src="http://localhost:8888/api/camera/mjpeg/camera1" alt="摄像头1">
```

### Python客户端调用

```python
import requests

# 启动摄像头
response = requests.post('http://localhost:8888/api/camera/start', json={
    'camera_id': 'camera1',
    'device_id': 0,
    'width': 640,
    'height': 480
})

print(response.json())
```

## 配置说明

### 摄像头参数
- **device_id**: 摄像头设备编号 (0=/dev/video0, 1=/dev/video1...)
- **width/height**: 视频分辨率
- **fps**: 帧率设置 (默认30fps)

### 服务器参数
- **host**: 服务器监听地址 (默认 0.0.0.0)
- **port**: 服务器端口 (默认 8888)
- **debug**: 调试模式 (默认 False)

## 故障排除

### 常见问题

1. **摄像头设备无法访问**
   ```bash
   # 检查设备权限
   ls -la /dev/video*
   # 添加用户到video组
   sudo usermod -a -G video $USER
   ```

2. **依赖安装失败**
   ```bash
   # 更新系统包
   sudo apt update
   sudo apt install python3-dev python3-pip
   sudo apt install libopencv-dev python3-opencv
   ```

3. **端口被占用**
   ```bash
   # 检查端口占用
   netstat -tlnp | grep :8888
   # 或修改camera_server.py中的端口号
   ```

### 性能优化

1. **调整帧率**: 根据网络带宽调整FPS
2. **分辨率设置**: 选择合适的分辨率
3. **JPEG质量**: 修改压缩质量参数

## 扩展功能

### 计划中的特性
- [ ] H.264视频编码
- [ ] WebRTC支持
- [ ] 录像功能
- [ ] 运动检测
- [ ] 多路音视频同步

## 技术支持

- **操作系统**: Linux (Ubuntu/Debian推荐)
- **Python版本**: 3.7+
- **摄像头支持**: USB摄像头、CSI摄像头
- **浏览器支持**: Chrome、Firefox、Safari

## 许可证

MIT License
