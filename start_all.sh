#!/bin/bash

echo "=============================================="
echo "    Network Railway Monitoring System"
echo "=============================================="
echo ""

# Set environment
export LANG=C
export LC_ALL=C

# Function to check port availability
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 1
    else
        return 0
    fi
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to detect video devices
detect_video_devices() {
    local devices=()
    for i in {0..9}; do
        if [ -e "/dev/video$i" ]; then
            devices+=("/dev/video$i")
        fi
    done
    echo "${devices[@]}"
}

# Function to stop services
stop_services() {
    echo ""
    echo "Stopping services..."
    
    # Kill frontend
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo "Frontend server stopped"
    fi
    
    # Kill backend
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo "Backend server stopped"
    fi
    
    # Kill AI detection server
    if [ ! -z "$AI_DETECTION_PID" ]; then
        kill $AI_DETECTION_PID 2>/dev/null
        echo "AI Detection server stopped"
    fi
    
    # Kill any remaining processes
    pkill -f "python.*camera_server.py" 2>/dev/null
    pkill -f "python.*ai_detection_server.py" 2>/dev/null
    pkill -f "python.*http.server.*9999" 2>/dev/null
    
    echo "All services stopped"
    exit 0
}

# Trap for cleanup
trap stop_services SIGINT SIGTERM

echo "Starting Network Railway Monitoring System..."
echo ""

# System information
echo "System Information:"
echo "  OS: $(uname -s) $(uname -r)"
echo "  Python: $(python3 --version 2>/dev/null || echo 'Not found')"
echo "  Working Directory: $(pwd)"

# Detect video devices
VIDEO_DEVICES=($(detect_video_devices))
echo "  Video Devices: ${VIDEO_DEVICES[@]:-None detected}"
echo ""

# Start Backend Camera Server
echo "Step 1: Starting Backend Camera Server..."
cd back_end

if [ ! -f "camera_server.py" ]; then
    echo "Error: camera_server.py not found in back_end directory"
    exit 1
fi

# Check Python and dependencies
if ! command_exists python3; then
    echo "Error: Python 3 not found"
    exit 1
fi

echo "Checking Python dependencies..."
python3 -c "
try:
    import cv2, flask, flask_cors
    print('  OpenCV version:', cv2.__version__)
    print('  Flask version:', flask.__version__)
    print('  All dependencies OK')
except ImportError as e:
    print('  Missing dependency:', e)
    exit(1)
" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Error: Required Python packages not found"
    echo "Attempting to install dependencies..."
    pip3 install flask flask-cors opencv-python 2>/dev/null || {
        echo "Warning: Could not install dependencies automatically"
        echo "Please install manually: pip3 install flask flask-cors opencv-python"
    }
fi

# Check if backend port is available
if ! check_port 8888; then
    echo "Port 8888 is already in use - stopping existing service..."
    pkill -f "camera_server.py"
    sleep 3
    if ! check_port 8888; then
        echo "Error: Could not free port 8888"
        exit 1
    fi
fi

# Start backend
echo "Starting backend camera server on port 8888..."
python3 camera_server.py >> ../backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to start
echo "Waiting for backend to initialize..."
for i in {1..10}; do
    sleep 1
    if curl -s http://localhost:8888/api/status >/dev/null 2>&1; then
        echo "Backend is responding"
        break
    fi
    echo "  Attempt $i/10..."
done

# Check if backend is running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "Error: Backend failed to start"
    echo "Check backend.log for details:"
    tail -n 10 ../backend.log 2>/dev/null || echo "No log file found"
    exit 1
fi

echo "Backend started successfully"

# Start AI Detection Server
echo ""
echo "Step 2: Starting AI Detection Server..."
cd ../back_end

if [ ! -f "ai_detection_server.py" ]; then
    echo "Error: ai_detection_server.py not found in back_end directory"
    exit 1
fi

# Check if AI detection port is available
if ! check_port 5001; then
    echo "Port 5001 is already in use - stopping existing service..."
    pkill -f "ai_detection_server.py"
    sleep 3
    if ! check_port 5001; then
        echo "Error: Could not free port 5001"
        stop_services
        exit 1
    fi
fi

# Start AI detection server
echo "Starting AI detection server on port 5001..."
python3 ai_detection_server.py >> ../ai_detection.log 2>&1 &
AI_DETECTION_PID=$!
echo "AI Detection PID: $AI_DETECTION_PID"

# Wait for AI detection server to start
echo "Waiting for AI detection server to initialize..."
for i in {1..15}; do
    sleep 1
    if curl -s http://localhost:5001/health >/dev/null 2>&1; then
        echo "AI Detection server is responding"
        break
    fi
    echo "  Attempt $i/15..."
done

# Check if AI detection server is running
if ! kill -0 $AI_DETECTION_PID 2>/dev/null; then
    echo "Warning: AI Detection server failed to start"
    echo "Check ai_detection.log for details:"
    tail -n 10 ../ai_detection.log 2>/dev/null || echo "No log file found"
    echo "Continuing without AI detection functionality..."
    AI_DETECTION_PID=""
else
    echo "AI Detection server started successfully"
fi

# Start Frontend Server
echo ""
echo "Step 3: Starting Frontend Server..."
cd ../front_end

if [ ! -f "index.html" ]; then
    echo "Error: index.html not found in front_end directory"
    exit 1
fi

# Check if frontend port is available
if ! check_port 9999; then
    echo "Port 9999 is already in use - stopping existing service..."
    pkill -f "http.server.*9999"
    sleep 3
    if ! check_port 9999; then
        echo "Error: Could not free port 9999"
        stop_services
        exit 1
    fi
fi

# Start frontend
echo "Starting frontend web server on port 9999..."
python3 -m http.server 9999 >> ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

# Wait for frontend to start
echo "Waiting for frontend to initialize..."
sleep 3

# Check if frontend is running
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "Error: Frontend failed to start"
    echo "Check frontend.log for details:"
    tail -n 10 ../frontend.log 2>/dev/null || echo "No log file found"
    stop_services
    exit 1
fi

echo "Frontend started successfully"

# Test connectivity
echo ""
echo "Testing system connectivity..."
if curl -s http://localhost:8888/api/status >/dev/null 2>&1; then
    echo "  Backend API: OK"
else
    echo "  Backend API: Failed"
fi

if curl -s http://localhost:5001/health >/dev/null 2>&1; then
    echo "  AI Detection API: OK"
else
    echo "  AI Detection API: Failed"
fi

if curl -s http://localhost:9999/ >/dev/null 2>&1; then
    echo "  Frontend: OK"
else
    echo "  Frontend: Failed"
fi

# Display status
echo ""
echo "=============================================="
echo "    System Status"
echo "=============================================="
echo ""
echo "Backend Camera Server:"
echo "  URL: http://localhost:8888"
echo "  API Documentation: http://localhost:8888"
echo "  Device API: http://localhost:8888/api/devices"
echo "  Status API: http://localhost:8888/api/status"
echo "  Status: Running (PID: $BACKEND_PID)"
echo ""
echo "AI Detection Server:"
if [ ! -z "$AI_DETECTION_PID" ]; then
    echo "  URL: http://localhost:5001"
    echo "  Health Check: http://localhost:5001/health"
    echo "  Status API: http://localhost:5001/api/status"
    echo "  Status: Running (PID: $AI_DETECTION_PID)"
else
    echo "  Status: Not Running"
fi
echo ""
echo "Frontend Website:"
echo "  URL: http://localhost:9999"
echo "  Monitor Page: http://localhost:9999#monitor"
echo "  Status: Running (PID: $FRONTEND_PID)"
echo ""
echo "Video Devices Detected: ${#VIDEO_DEVICES[@]}"
for device in "${VIDEO_DEVICES[@]}"; do
    echo "  - $device"
done
echo ""
echo "Log Files:"
echo "  Backend: backend.log"
echo "  AI Detection: ai_detection.log"
echo "  Frontend: frontend.log"
echo ""
echo "To stop all services: Press Ctrl+C"
echo "=============================================="

# Keep script running and monitor services
echo ""
echo "Monitoring services... (Press Ctrl+C to stop)"
while true; do
    # Check if processes are still running
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo "$(date): Warning - Backend process died (PID: $BACKEND_PID)"
        break
    fi
    
    if [ ! -z "$AI_DETECTION_PID" ] && ! kill -0 $AI_DETECTION_PID 2>/dev/null; then
        echo "$(date): Warning - AI Detection process died (PID: $AI_DETECTION_PID)"
        # Don't break, AI detection is optional
    fi
    
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo "$(date): Warning - Frontend process died (PID: $FRONTEND_PID)"
        break
    fi
    
    sleep 10
done

stop_services
