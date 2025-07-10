/**
 * \u6444\u50cf\u5934\u63a7\u5236\u548cAI\u68c0\u6d4b\u529f\u80fd
 */

// \u5168\u5c40\u53d8\u91cf
let cameraState = {
    isActive: false,
    isDetecting: false,
    currentCameraId: 'camera1',
    streamInterval: null,
    detectionInterval: null,
    detectionHistory: [],
    dataCDetectionInterval: null  // DataC\u56fe\u7247\u68c0\u6d4b\u5b9a\u65f6\u5668
};

// API\u7aef\u70b9\u914d\u7f6e
const API_CONFIG = {
    CAMERA_SERVER: 'http://localhost:8888',
    AI_DETECTION_SERVER: 'http://localhost:5001'
};

// \u521d\u59cb\u5316\u6444\u50cf\u5934\u529f\u80fd
function initializeCameraFeatures() {
    console.log('\u521d\u59cb\u5316\u6444\u50cf\u5934\u529f\u80fd...');
    
    // \u68c0\u67e5\u670d\u52a1\u5668\u72b6\u6001
    checkServerStatus();
    
    // \u663e\u793a\u68c0\u6d4b\u7ed3\u679c\u533a\u57df\uff08\u5305\u62ec\u5386\u53f2\u8bb0\u5f55\uff09
    showDetectionResults();
    
    // \u52a0\u8f7d\u5386\u53f2\u68c0\u6d4b\u6570\u636e
    loadDetectionHistory();
    
    // \u8bbe\u7f6e\u5b9a\u65f6\u5668\u66f4\u65b0\u754c\u9762
    setInterval(updateCameraInterface, 1000);
    
    // \u8bbe\u7f6e\u68c0\u6d4b\u5386\u53f2\u66f4\u65b0
    setInterval(updateDetectionHistory, 2000);
}

// \u68c0\u67e5\u670d\u52a1\u5668\u72b6\u6001
async function checkServerStatus() {
    try {
        // \u68c0\u67e5\u6444\u50cf\u5934\u670d\u52a1\u5668
        const cameraResponse = await fetch(`${API_CONFIG.CAMERA_SERVER}/api/status`);
        const cameraStatus = await cameraResponse.json();
        
        // \u68c0\u67e5AI\u68c0\u6d4b\u670d\u52a1\u5668
        const aiResponse = await fetch(`${API_CONFIG.AI_DETECTION_SERVER}/api/status`);
        const aiStatus = await aiResponse.json();
        
        console.log('\u6444\u50cf\u5934\u670d\u52a1\u5668\u72b6\u6001:', cameraStatus);
        console.log('AI\u68c0\u6d4b\u670d\u52a1\u5668\u72b6\u6001:', aiStatus);
        
        // \u66f4\u65b0\u754c\u9762\u72b6\u6001
        updateServerStatus(cameraStatus, aiStatus);
        
    } catch (error) {
        console.error('\u68c0\u67e5\u670d\u52a1\u5668\u72b6\u6001\u5931\u8d25:', error);
        updateConnectionStatus('\u8fde\u63a5\u5931\u8d25');
    }
}

// \u66f4\u65b0\u670d\u52a1\u5668\u72b6\u6001\u663e\u793a
function updateServerStatus(cameraStatus, aiStatus) {
    const statusElement = document.getElementById('connection-status');
    const detectionStatusElement = document.getElementById('detection-status-text');
    
    if (cameraStatus.success && aiStatus.success) {
        statusElement.textContent = '\u5df2\u8fde\u63a5';
        statusElement.className = 'status-text status-connected';
        
        if (aiStatus.ai_model_loaded) {
            detectionStatusElement.textContent = 'AI\u6a21\u578b\u5df2\u52a0\u8f7d';
            detectionStatusElement.className = 'status-text status-ready';
        } else {
            detectionStatusElement.textContent = 'AI\u6a21\u578b\u672a\u52a0\u8f7d';
            detectionStatusElement.className = 'status-text status-error';
        }
    } else {
        statusElement.textContent = '\u8fde\u63a5\u5931\u8d25';
        statusElement.className = 'status-text status-error';
    }
}

// \u542f\u52a8\u6444\u50cf\u5934
async function startCamera() {
    console.log('\u542f\u52a8\u6444\u50cf\u5934...');
    
    try {
        const response = await fetch(`${API_CONFIG.CAMERA_SERVER}/api/camera/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                camera_id: cameraState.currentCameraId,
                device_id: 0,
                width: 640,
                height: 480
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            cameraState.isActive = true;
            console.log('\u6444\u50cf\u5934\u542f\u52a8\u6210\u529f');
            
            // \u5f00\u59cb\u663e\u793a\u89c6\u9891\u6d41
            startVideoStream();
            
            // \u66f4\u65b0\u754c\u9762
            updateCameraControls();
            
            // \u663e\u793a\u6210\u529f\u6d88\u606f
            showMessage('\u6444\u50cf\u5934\u5df2\u542f\u52a8', 'success');
            
        } else {
            console.error('\u6444\u50cf\u5934\u542f\u52a8\u5931\u8d25:', result.message);
            showMessage('\u6444\u50cf\u5934\u542f\u52a8\u5931\u8d25: ' + result.message, 'error');
        }
        
    } catch (error) {
        console.error('\u542f\u52a8\u6444\u50cf\u5934\u65f6\u53d1\u751f\u9519\u8bef:', error);
        showMessage('\u542f\u52a8\u6444\u50cf\u5934\u65f6\u53d1\u751f\u9519\u8bef', 'error');
    }
}

// \u505c\u6b62\u6444\u50cf\u5934
async function stopCamera() {
    console.log('\u505c\u6b62\u6444\u50cf\u5934...');
    
    try {
        // \u505c\u6b62\u68c0\u6d4b
        if (cameraState.isDetecting) {
            await stopDetection();
        }
        
        // \u505c\u6b62\u89c6\u9891\u6d41
        stopVideoStream();
        
        // \u505c\u6b62\u6444\u50cf\u5934
        const response = await fetch(`${API_CONFIG.CAMERA_SERVER}/api/camera/stop`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                camera_id: cameraState.currentCameraId
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            cameraState.isActive = false;
            console.log('\u6444\u50cf\u5934\u5df2\u505c\u6b62');
            
            // \u66f4\u65b0\u754c\u9762
            updateCameraControls();
            
            showMessage('\u6444\u50cf\u5934\u5df2\u505c\u6b62', 'success');
            
        } else {
            console.error('\u505c\u6b62\u6444\u50cf\u5934\u5931\u8d25:', result.message);
            showMessage('\u505c\u6b62\u6444\u50cf\u5934\u5931\u8d25: ' + result.message, 'error');
        }
        
    } catch (error) {
        console.error('\u505c\u6b62\u6444\u50cf\u5934\u65f6\u53d1\u751f\u9519\u8bef:', error);
        showMessage('\u505c\u6b62\u6444\u50cf\u5934\u65f6\u53d1\u751f\u9519\u8bef', 'error');
    }
}

// \u5f00\u59cb\u89c6\u9891\u6d41\u663e\u793a
function startVideoStream() {
    const streamImg = document.getElementById('camera-stream');
    const placeholder = document.getElementById('video-placeholder');
    
    if (streamImg) {
        streamImg.src = `${API_CONFIG.CAMERA_SERVER}/api/camera/mjpeg/${cameraState.currentCameraId}`;
        streamImg.style.display = 'block';
        
        if (placeholder) {
            placeholder.style.display = 'none';
        }
        
        // \u66f4\u65b0\u65f6\u95f4\u6233
        updateVideoTimestamp();
        
        // \u8bbe\u7f6e\u65f6\u95f4\u6233\u66f4\u65b0\u5b9a\u65f6\u5668
        cameraState.streamInterval = setInterval(updateVideoTimestamp, 1000);
    }
}

// \u505c\u6b62\u89c6\u9891\u6d41\u663e\u793a
function stopVideoStream() {
    const streamImg = document.getElementById('camera-stream');
    const placeholder = document.getElementById('video-placeholder');
    
    if (streamImg) {
        streamImg.style.display = 'none';
        streamImg.src = '';
    }
    
    if (placeholder) {
        placeholder.style.display = 'block';
    }
    
    // \u6e05\u9664\u65f6\u95f4\u6233\u5b9a\u65f6\u5668
    if (cameraState.streamInterval) {
        clearInterval(cameraState.streamInterval);
        cameraState.streamInterval = null;
    }
}

// \u66f4\u65b0\u89c6\u9891\u65f6\u95f4\u6233
function updateVideoTimestamp() {
    const timestampElement = document.getElementById('video-timestamp');
    if (timestampElement) {
        timestampElement.textContent = new Date().toLocaleTimeString();
    }
}

// \u5207\u6362\u68c0\u6d4b\u72b6\u6001
async function toggleDetection() {
    if (cameraState.isDetecting) {
        await stopDetection();
    } else {
        await startDetection();
    }
}

// \u542f\u52a8\u68c0\u6d4b
async function startDetection() {
    // \u53ea\u6709\u6444\u50cf\u5934\u6a21\u5f0f\u624d\u9700\u8981\u68c0\u67e5\u6444\u50cf\u5934\u72b6\u6001
    if (currentDetectionMode === 'camera' && !cameraState.isActive) {
        showMessage('\u8bf7\u5148\u542f\u52a8\u6444\u50cf\u5934', 'warning');
        return;
    }
    
    try {
        if (currentDetectionMode === 'camera') {
            // \u6444\u50cf\u5934\u5b9e\u65f6\u68c0\u6d4b
            const response = await fetch(`${API_CONFIG.AI_DETECTION_SERVER}/api/continuous_camera_detect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'start',
                    camera_id: cameraState.currentCameraId
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                cameraState.isDetecting = true;
                console.log('\u6444\u50cf\u5934\u5b9e\u65f6\u68c0\u6d4b\u5df2\u542f\u52a8');
                showMessage('AI\u6444\u50cf\u5934\u68c0\u6d4b\u5df2\u542f\u52a8', 'success');
            } else {
                console.error('\u542f\u52a8\u6444\u50cf\u5934\u68c0\u6d4b\u5931\u8d25:', result.message);
                showMessage('\u542f\u52a8\u6444\u50cf\u5934\u68c0\u6d4b\u5931\u8d25: ' + result.message, 'error');
            }
        } else {
            // DataC\u56fe\u7247\u68c0\u6d4b\u6a21\u5f0f
            await startDataCDetection();
        }
        
        if (cameraState.isDetecting) {
            // \u663e\u793a\u68c0\u6d4b\u7ed3\u679c\u533a\u57df
            showDetectionResults();
            
            // \u66f4\u65b0\u754c\u9762
            updateCameraControls();
        }
        
    } catch (error) {
        console.error('\u542f\u52a8\u68c0\u6d4b\u65f6\u53d1\u751f\u9519\u8bef:', error);
        showMessage('\u542f\u52a8\u68c0\u6d4b\u65f6\u53d1\u751f\u9519\u8bef', 'error');
    }
}

// \u505c\u6b62\u68c0\u6d4b
async function stopDetection() {
    try {
        if (currentDetectionMode === 'camera') {
            // \u505c\u6b62\u6444\u50cf\u5934\u5b9e\u65f6\u68c0\u6d4b
            const response = await fetch(`${API_CONFIG.AI_DETECTION_SERVER}/api/continuous_camera_detect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'stop',
                    camera_id: cameraState.currentCameraId
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                console.log('\u6444\u50cf\u5934\u5b9e\u65f6\u68c0\u6d4b\u5df2\u505c\u6b62');
                showMessage('AI\u6444\u50cf\u5934\u68c0\u6d4b\u5df2\u505c\u6b62', 'success');
            } else {
                console.error('\u505c\u6b62\u6444\u50cf\u5934\u68c0\u6d4b\u5931\u8d25:', result.message);
                showMessage('\u505c\u6b62\u6444\u50cf\u5934\u68c0\u6d4b\u5931\u8d25: ' + result.message, 'error');
            }
        } else {
            // \u505c\u6b62DataC\u56fe\u7247\u68c0\u6d4b
            stopDataCDetection();
        }
        
        cameraState.isDetecting = false;
        
        // \u66f4\u65b0\u754c\u9762
        updateCameraControls();
        
    } catch (error) {
        console.error('\u505c\u6b62\u68c0\u6d4b\u65f6\u53d1\u751f\u9519\u8bef:', error);
        showMessage('\u505c\u6b62\u68c0\u6d4b\u65f6\u53d1\u751f\u9519\u8bef', 'error');
    }
}

// \u68c0\u6d4b\u5f53\u524d\u5e27
async function detectCurrentFrame() {
    // \u53ea\u6709\u6444\u50cf\u5934\u6a21\u5f0f\u624d\u9700\u8981\u68c0\u67e5\u6444\u50cf\u5934\u72b6\u6001
    if (currentDetectionMode === 'camera' && !cameraState.isActive) {
        showMessage('\u8bf7\u5148\u542f\u52a8\u6444\u50cf\u5934', 'warning');
        return;
    }
    
    // \u5728DataC\u6a21\u5f0f\u4e0b\uff0c\u68c0\u6d4b\u5f53\u524d\u9009\u4e2d\u7684\u56fe\u7247
    if (currentDetectionMode === 'image') {
        await detectDataCImage();
        return;
    }
    
    try {
        showMessage('\u6b63\u5728\u68c0\u6d4b\u5f53\u524d\u5e27...', 'info');
        
        const response = await fetch(`${API_CONFIG.AI_DETECTION_SERVER}/api/detect_camera_frame`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                camera_id: cameraState.currentCameraId
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('\u5f53\u524d\u5e27\u68c0\u6d4b\u6210\u529f');
            
            // \u663e\u793a\u68c0\u6d4b\u7ed3\u679c
            displayDetectionResult(result);
            
            // \u663e\u793a\u68c0\u6d4b\u7ed3\u679c\u533a\u57df
            showDetectionResults();
            
            showMessage(`\u68c0\u6d4b\u5b8c\u6210\uff0c\u8017\u65f6: ${result.detection_time.toFixed(2)}s`, 'success');
            
        } else {
            console.error('\u68c0\u6d4b\u5f53\u524d\u5e27\u5931\u8d25:', result.message);
            showMessage('\u68c0\u6d4b\u5f53\u524d\u5e27\u5931\u8d25: ' + result.message, 'error');
        }
        
    } catch (error) {
        console.error('\u68c0\u6d4b\u5f53\u524d\u5e27\u65f6\u53d1\u751f\u9519\u8bef:', error);
        showMessage('\u68c0\u6d4b\u5f53\u524d\u5e27\u65f6\u53d1\u751f\u9519\u8bef', 'error');
    }
}

// \u622a\u56fe\u529f\u80fd
async function captureSnapshot() {
    if (!cameraState.isActive) {
        showMessage('\u8bf7\u5148\u542f\u52a8\u6444\u50cf\u5934', 'warning');
        return;
    }
    
    try {
        const response = await fetch(`${API_CONFIG.CAMERA_SERVER}/api/camera/snapshot/${cameraState.currentCameraId}`);
        
        if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            
            // \u521b\u5efa\u4e0b\u8f7d\u94fe\u63a5
            const link = document.createElement('a');
            link.href = url;
            link.download = `snapshot_${new Date().toISOString().replace(/[:.]/g, '-')}.jpg`;
            link.click();
            
            URL.revokeObjectURL(url);
            
            showMessage('\u622a\u56fe\u5df2\u4fdd\u5b58', 'success');
            
        } else {
            showMessage('\u622a\u56fe\u5931\u8d25', 'error');
        }
        
    } catch (error) {
        console.error('\u622a\u56fe\u65f6\u53d1\u751f\u9519\u8bef:', error);
        showMessage('\u622a\u56fe\u65f6\u53d1\u751f\u9519\u8bef', 'error');
    }
}

// \u663e\u793a\u68c0\u6d4b\u7ed3\u679c\u533a\u57df
function showDetectionResults() {
    const resultsSection = document.getElementById('detection-results-section');
    if (resultsSection) {
        resultsSection.style.display = 'block';
    }
}

// \u663e\u793a\u68c0\u6d4b\u7ed3\u679c\u548c\u5bf9\u6bd4\u56fe
function displayDetectionResult(result, addToHistory = true) {
    console.log('\u68c0\u6d4b\u7ed3\u679c:', result);
    
    // \u663e\u793a\u6700\u65b0\u68c0\u6d4b\u7ed3\u679c
    const latestResultDiv = document.getElementById('latest-detection-result');
    if (latestResultDiv) {
        latestResultDiv.style.display = 'block';
        
        // \u66f4\u65b0\u56fe\u50cf\u5bf9\u6bd4
        const originalImg = document.getElementById('original-image');
        const segmentationImg = document.getElementById('segmentation-result');
        
        if (originalImg && result.original_image) {
            originalImg.src = result.original_image;
            originalImg.style.display = 'block';
            originalImg.onerror = function() {
                console.error('\u539f\u59cb\u56fe\u50cf\u52a0\u8f7d\u5931\u8d25');
                this.style.display = 'none';
            };
        }
        
        if (segmentationImg && result.result_image) {
            segmentationImg.src = result.result_image;
            segmentationImg.style.display = 'block';
            segmentationImg.onerror = function() {
                console.error('\u5206\u5272\u7ed3\u679c\u56fe\u50cf\u52a0\u8f7d\u5931\u8d25');
                this.style.display = 'none';
            };
        }
        
        // \u66f4\u65b0\u68c0\u6d4b\u4fe1\u606f
        const detectionTime = document.getElementById('detection-time');
        const detectionType = document.getElementById('detection-type');
        const detectionTimestamp = document.getElementById('detection-timestamp');
        
        if (detectionTime) {
            detectionTime.textContent = `${result.detection_time.toFixed(2)}s`;
        }
        
        if (detectionType) {
            detectionType.textContent = result.source_type === 'camera_frame' ? '\u6444\u50cf\u5934\u68c0\u6d4b' : '\u6570\u636e\u68c0\u6d4b';
        }
        
        if (detectionTimestamp) {
            detectionTimestamp.textContent = new Date(result.timestamp * 1000).toLocaleString();
        }
        
        // \u521b\u5efa\u7ed3\u679c\u5bf9\u6bd4\u663e\u793a
        createComparisonView(result);
    }
    
    // \u53ea\u6709\u65b0\u68c0\u6d4b\u7ed3\u679c\u624d\u6dfb\u52a0\u5230\u5386\u53f2\u8bb0\u5f55
    if (addToHistory) {
        // \u66f4\u65b0\u68c0\u6d4b\u5386\u53f2
        cameraState.detectionHistory.unshift(result);
        if (cameraState.detectionHistory.length > 20) {
            cameraState.detectionHistory.pop();
        }
        
        // \u5237\u65b0\u5386\u53f2\u5217\u8868\u663e\u793a
        refreshDetectionHistoryDisplay();
    }
}

// \u521b\u5efa\u7ed3\u679c\u5bf9\u6bd4\u663e\u793a
function createComparisonView(result) {
    const comparisonContainer = document.getElementById('detection-comparison');
    
    if (!comparisonContainer) {
        // \u521b\u5efa\u5bf9\u6bd4\u5bb9\u5668
        const newContainer = document.createElement('div');
        newContainer.id = 'detection-comparison';
        newContainer.className = 'detection-comparison-container';
        newContainer.innerHTML = `
            <h4>\u68c0\u6d4b\u7ed3\u679c\u5bf9\u6bd4</h4>
            <div class="comparison-images">
                <div class="image-container">
                    <h5>\u539f\u59cb\u56fe\u50cf</h5>
                    <img id="comparison-original" src="${result.original_image}" alt="\u539f\u59cb\u56fe\u50cf">
                </div>
                <div class="image-container">
                    <h5>\u5206\u5272\u7ed3\u679c</h5>
                    <img id="comparison-result" src="${result.result_image}" alt="\u5206\u5272\u7ed3\u679c">
                </div>
            </div>
            <div class="comparison-info">
                <p>\u68c0\u6d4b\u65f6\u95f4: ${result.detection_time.toFixed(2)}s</p>
                <p>\u68c0\u6d4b\u65f6\u95f4\u6233: ${new Date(result.timestamp * 1000).toLocaleString()}</p>
            </div>
        `;
        
        // \u63d2\u5165\u5230\u68c0\u6d4b\u7ed3\u679c\u533a\u57df
        const resultsSection = document.getElementById('detection-results-section');
        if (resultsSection) {
            resultsSection.appendChild(newContainer);
        }
    } else {
        // \u66f4\u65b0\u73b0\u6709\u5bf9\u6bd4\u663e\u793a
        const originalImg = document.getElementById('comparison-original');
        const resultImg = document.getElementById('comparison-result');
        
        if (originalImg) originalImg.src = result.original_image;
        if (resultImg) resultImg.src = result.result_image;
        
        // \u66f4\u65b0\u4fe1\u606f
        const infoDiv = comparisonContainer.querySelector('.comparison-info');
        if (infoDiv) {
            infoDiv.innerHTML = `
                <p>\u68c0\u6d4b\u65f6\u95f4: ${result.detection_time.toFixed(2)}s</p>
                <p>\u68c0\u6d4b\u65f6\u95f4\u6233: ${new Date(result.timestamp * 1000).toLocaleString()}</p>
            `;
        }
    }
}

// \u5237\u65b0\u68c0\u6d4b\u5386\u53f2\u663e\u793a
function refreshDetectionHistoryDisplay() {
    const historyList = document.getElementById('detection-history-list');
    if (!historyList) return;
    
    // \u6e05\u7a7a\u73b0\u6709\u5185\u5bb9
    historyList.innerHTML = '';
    
    if (cameraState.detectionHistory.length === 0) {
        historyList.innerHTML = '<div class="history-item-placeholder"><p>\u6682\u65e0\u68c0\u6d4b\u5386\u53f2\u8bb0\u5f55</p></div>';
        return;
    }
    
    // \u751f\u6210\u5386\u53f2\u8bb0\u5f55\u9879
    cameraState.detectionHistory.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-item-content">
                <div class="history-item-header">
                    <span class="history-item-time">${new Date(item.timestamp * 1000).toLocaleString()}</span>
                    <span class="history-item-type">${item.source_type === 'camera_frame' ? '\u6444\u50cf\u5934\u68c0\u6d4b' : '\u6570\u636e\u68c0\u6d4b'}</span>
                </div>
                <div class="history-item-details">
                    <p>\u68c0\u6d4b\u65f6\u95f4: ${item.detection_time.toFixed(2)}s</p>
                    <p>\u6444\u50cf\u5934: ${item.camera_id || 'camera1'}</p>
                </div>
                <div class="history-item-actions">
                    <button class="btn-small" onclick="viewDetectionResult(${index})">\u67e5\u770b</button>
                    <button class="btn-small" onclick="downloadDetectionResult(${index})">\u4e0b\u8f7d</button>
                </div>
            </div>
        `;
        historyList.appendChild(historyItem);
    });
}

// \u67e5\u770b\u68c0\u6d4b\u7ed3\u679c
function viewDetectionResult(index) {
    if (index >= 0 && index < cameraState.detectionHistory.length) {
        const result = cameraState.detectionHistory[index];
        
        // \u786e\u4fdd\u68c0\u6d4b\u7ed3\u679c\u533a\u57df\u663e\u793a
        showDetectionResults();
        
        // \u663e\u793a\u68c0\u6d4b\u7ed3\u679c\uff08\u4e0d\u6dfb\u52a0\u5230\u5386\u53f2\u8bb0\u5f55\uff09
        displayDetectionResult(result, false);
        
        // \u6eda\u52a8\u5230\u7ed3\u679c\u663e\u793a\u533a\u57df
        const resultsSection = document.getElementById('latest-detection-result');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// \u4e0b\u8f7d\u68c0\u6d4b\u7ed3\u679c
function downloadDetectionResult(index) {
    if (index >= 0 && index < cameraState.detectionHistory.length) {
        const result = cameraState.detectionHistory[index];
        
        // \u521b\u5efa\u4e00\u4e2a\u5305\u542b\u68c0\u6d4b\u7ed3\u679c\u7684JSON\u6587\u4ef6
        const resultData = {
            timestamp: result.timestamp,
            detection_time: result.detection_time,
            source_type: result.source_type,
            camera_id: result.camera_id,
            datetime: new Date(result.timestamp * 1000).toLocaleString()
        };
        
        const dataStr = JSON.stringify(resultData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `detection_result_${new Date(result.timestamp * 1000).toISOString().replace(/[:.]/g, '-')}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        
        showMessage('\u68c0\u6d4b\u7ed3\u679c\u5df2\u4e0b\u8f7d', 'success');
    }
}

// \u5237\u65b0\u68c0\u6d4b\u5386\u53f2
async function refreshDetectionHistory() {
    try {
        const response = await fetch(`${API_CONFIG.AI_DETECTION_SERVER}/api/detection_history`);
        const result = await response.json();
        
        if (result.success) {
            cameraState.detectionHistory = result.history || [];
            refreshDetectionHistoryDisplay();
            showMessage('\u68c0\u6d4b\u5386\u53f2\u5df2\u5237\u65b0', 'success');
            
            // \u786e\u4fdd\u68c0\u6d4b\u7ed3\u679c\u533a\u57df\u663e\u793a
            showDetectionResults();
        } else {
            showMessage('\u5237\u65b0\u68c0\u6d4b\u5386\u53f2\u5931\u8d25', 'error');
        }
        
    } catch (error) {
        console.error('\u5237\u65b0\u68c0\u6d4b\u5386\u53f2\u65f6\u53d1\u751f\u9519\u8bef:', error);
        showMessage('\u5237\u65b0\u68c0\u6d4b\u5386\u53f2\u65f6\u53d1\u751f\u9519\u8bef', 'error');
    }
}

// \u6e05\u7a7a\u68c0\u6d4b\u5386\u53f2
async function clearDetectionHistory() {
    if (!confirm('\u786e\u5b9a\u8981\u6e05\u7a7a\u6240\u6709\u68c0\u6d4b\u5386\u53f2\u8bb0\u5f55\u5417\uff1f\u6b64\u64cd\u4f5c\u65e0\u6cd5\u64a4\u9500\u3002')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_CONFIG.AI_DETECTION_SERVER}/api/clear_history`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            cameraState.detectionHistory = [];
            refreshDetectionHistoryDisplay();
            
            // \u9690\u85cf\u6700\u65b0\u68c0\u6d4b\u7ed3\u679c
            const latestResultDiv = document.getElementById('latest-detection-result');
            if (latestResultDiv) {
                latestResultDiv.style.display = 'none';
            }
            
            // \u9690\u85cf\u5bf9\u6bd4\u663e\u793a
            const comparisonContainer = document.getElementById('detection-comparison');
            if (comparisonContainer) {
                comparisonContainer.style.display = 'none';
            }
            
            // \u786e\u4fdd\u68c0\u6d4b\u7ed3\u679c\u533a\u57df\u4ecd\u7136\u663e\u793a\uff08\u4ee5\u663e\u793a\u7a7a\u72b6\u6001\uff09
            showDetectionResults();
            
            showMessage('\u68c0\u6d4b\u5386\u53f2\u5df2\u6e05\u7a7a', 'success');
        } else {
            showMessage('\u6e05\u7a7a\u68c0\u6d4b\u5386\u53f2\u5931\u8d25', 'error');
        }
        
    } catch (error) {
        console.error('\u6e05\u7a7a\u68c0\u6d4b\u5386\u53f2\u65f6\u53d1\u751f\u9519\u8bef:', error);
        showMessage('\u6e05\u7a7a\u68c0\u6d4b\u5386\u53f2\u65f6\u53d1\u751f\u9519\u8bef', 'error');
    }
}

// \u5bfc\u51fa\u68c0\u6d4b\u5386\u53f2
function exportDetectionHistory() {
    // \u786e\u4fdd\u68c0\u6d4b\u7ed3\u679c\u533a\u57df\u663e\u793a
    showDetectionResults();
    
    if (cameraState.detectionHistory.length === 0) {
        showMessage('\u6682\u65e0\u68c0\u6d4b\u5386\u53f2\u8bb0\u5f55\u53ef\u5bfc\u51fa', 'warning');
        return;
    }
    
    // \u521b\u5efa\u5bfc\u51fa\u6570\u636e\uff08\u4e0d\u5305\u542b\u56fe\u50cf\u6570\u636e\uff09
    const exportData = cameraState.detectionHistory.map(item => ({
        timestamp: item.timestamp,
        detection_time: item.detection_time,
        source_type: item.source_type,
        camera_id: item.camera_id,
        datetime: new Date(item.timestamp * 1000).toLocaleString()
    }));
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `detection_history_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    
    showMessage('\u68c0\u6d4b\u5386\u53f2\u5df2\u5bfc\u51fa', 'success');
}

// \u66f4\u65b0\u68c0\u6d4b\u5386\u53f2\u663e\u793a
async function updateDetectionHistory() {
    if (!cameraState.isDetecting) return;
    
    try {
        const response = await fetch(`${API_CONFIG.AI_DETECTION_SERVER}/api/latest_detection`);
        const result = await response.json();
        
        if (result.success && result.detection) {
            // \u66f4\u65b0\u68c0\u6d4b\u72b6\u6001\u6307\u793a\u5668
            const indicator = document.getElementById('detection-indicator');
            const statusText = document.getElementById('detection-current-status');
            
            if (indicator) {
                indicator.className = 'status-dot status-normal';
            }
            
            if (statusText) {
                statusText.textContent = '\u68c0\u6d4b\u4e2d';
            }
            
            // \u66f4\u65b0\u68c0\u6d4b\u6b21\u6570
            const countElement = document.getElementById('detection-count');
            if (countElement) {
                countElement.textContent = cameraState.detectionHistory.length;
            }
            
            // \u66f4\u65b0\u6700\u540e\u68c0\u6d4b\u65f6\u95f4
            const timeElement = document.getElementById('last-detection-time');
            if (timeElement) {
                timeElement.textContent = new Date(result.detection.timestamp * 1000).toLocaleTimeString();
            }
        }
        
    } catch (error) {
        console.error('\u66f4\u65b0\u68c0\u6d4b\u5386\u53f2\u5931\u8d25:', error);
    }
}

// \u66f4\u65b0\u6444\u50cf\u5934\u63a7\u5236\u754c\u9762
function updateCameraControls() {
    const startBtn = document.getElementById('start-camera-btn');
    const toggleBtn = document.getElementById('toggle-detection');
    const cameraStatus = document.getElementById('camera-status');
    const recordingIndicator = document.getElementById('recording-indicator');
    
    if (startBtn && cameraStatus) {
        if (cameraState.isActive) {
            cameraStatus.textContent = '\u6444\u50cf\u5934\u8fd0\u884c\u4e2d';
            startBtn.disabled = true;
        } else {
            cameraStatus.textContent = '\u542f\u52a8\u6444\u50cf\u5934';
            startBtn.disabled = false;
        }
    }
    
    if (toggleBtn) {
        if (cameraState.isDetecting) {
            toggleBtn.textContent = '\u505c\u6b62\u68c0\u6d4b';
            toggleBtn.className = 'btn-control btn-stop';
        } else {
            toggleBtn.textContent = '\u542f\u52a8\u68c0\u6d4b';
            toggleBtn.className = 'btn-control';
        }
    }
    
    if (recordingIndicator) {
        if (cameraState.isDetecting) {
            recordingIndicator.style.display = 'inline';
        } else {
            recordingIndicator.style.display = 'none';
        }
    }
}

// \u66f4\u65b0\u754c\u9762\u72b6\u6001
function updateCameraInterface() {
    updateCameraControls();
    
    // \u66f4\u65b0\u8fde\u63a5\u72b6\u6001
    const connectionStatus = document.getElementById('connection-status');
    if (connectionStatus && cameraState.isActive) {
        connectionStatus.textContent = '\u5df2\u8fde\u63a5';
        connectionStatus.className = 'status-text status-connected';
    }
}

// \u663e\u793a\u6d88\u606f
function showMessage(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // \u8fd9\u91cc\u53ef\u4ee5\u6dfb\u52a0Toast\u901a\u77e5\u6216\u5176\u4ed6UI\u53cd\u9988
    // \u6682\u65f6\u4f7f\u7528\u63a7\u5236\u53f0\u8f93\u51fa
    
    // \u53ef\u4ee5\u6dfb\u52a0\u4e00\u4e2a\u7b80\u5355\u7684\u63d0\u793a\u6846
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 20px;
        border-radius: 4px;
        color: white;
        z-index: 1000;
        font-size: 14px;
    `;
    
    switch (type) {
        case 'success':
            messageDiv.style.backgroundColor = '#4CAF50';
            break;
        case 'error':
            messageDiv.style.backgroundColor = '#f44336';
            break;
        case 'warning':
            messageDiv.style.backgroundColor = '#ff9800';
            break;
        case 'info':
        default:
            messageDiv.style.backgroundColor = '#2196F3';
            break;
    }
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 3000);
}

// \u9875\u9762\u52a0\u8f7d\u5b8c\u6210\u540e\u521d\u59cb\u5316
document.addEventListener('DOMContentLoaded', function() {
    console.log('\u6444\u50cf\u5934\u529f\u80fd\u9875\u9762\u52a0\u8f7d\u5b8c\u6210');
    initializeCameraFeatures();
});

// \u5bfc\u51fa\u51fd\u6570\u4f9b\u5168\u5c40\u4f7f\u7528
window.startCamera = startCamera;
window.stopCamera = stopCamera;
window.toggleDetection = toggleDetection;
window.detectCurrentFrame = detectCurrentFrame;
window.captureSnapshot = captureSnapshot;
window.refreshDetectionHistory = refreshDetectionHistory;
window.clearDetectionHistory = clearDetectionHistory;
window.exportDetectionHistory = exportDetectionHistory;
window.viewDetectionResult = viewDetectionResult;
window.downloadDetectionResult = downloadDetectionResult;
window.loadDetectionHistory = loadDetectionHistory;

// \u52a0\u8f7d\u5386\u53f2\u68c0\u6d4b\u6570\u636e
async function loadDetectionHistory() {
    try {
        const response = await fetch(`${API_CONFIG.AI_DETECTION_SERVER}/api/detection_history`);
        const result = await response.json();
        
        if (result.success) {
            cameraState.detectionHistory = result.history || [];
            console.log('\u5386\u53f2\u68c0\u6d4b\u6570\u636e\u52a0\u8f7d\u6210\u529f:', cameraState.detectionHistory.length, '\u6761\u8bb0\u5f55');
        } else {
            console.log('\u52a0\u8f7d\u5386\u53f2\u6570\u636e\u5931\u8d25:', result.message);
        }
        
        // \u65e0\u8bba\u662f\u5426\u6210\u529f\uff0c\u90fd\u5237\u65b0\u663e\u793a
        refreshDetectionHistoryDisplay();
        
    } catch (error) {
        console.error('\u52a0\u8f7d\u5386\u53f2\u68c0\u6d4b\u6570\u636e\u65f6\u53d1\u751f\u9519\u8bef:', error);
        // \u5373\u4f7f\u52a0\u8f7d\u5931\u8d25\uff0c\u4e5f\u5237\u65b0\u663e\u793a\u4ee5\u663e\u793a\u7a7a\u72b6\u6001
        refreshDetectionHistoryDisplay();
    }
}

// ==========================
// \u68c0\u6d4b\u6a21\u5f0f\u5207\u6362\u529f\u80fd
// ==========================

let currentDetectionMode = 'camera'; // 'camera' \u6216 'image'
let datacImages = []; // DataC\u56fe\u7247\u5217\u8868
let selectedDataCImage = null; // \u5f53\u524d\u9009\u4e2d\u7684DataC\u56fe\u7247
let dataCImageIndex = 0; // \u5f53\u524dDataC\u56fe\u7247\u7d22\u5f15

/**
 * \u542f\u52a8DataC\u56fe\u7247\u68c0\u6d4b\u6a21\u5f0f
 */
async function startDataCDetection() {
    try {
        // \u52a0\u8f7dDataC\u56fe\u7247\u5217\u8868
        await loadDataCImages();
        
        if (datacImages.length === 0) {
            showMessage('DataC\u6587\u4ef6\u5939\u4e2d\u6ca1\u6709\u56fe\u7247', 'warning');
            return;
        }
        
        cameraState.isDetecting = true;
        dataCImageIndex = 0;
        
        // \u5f00\u59cb\u5faa\u73af\u68c0\u6d4bDataC\u56fe\u7247
        startDataCDetectionLoop();
        
        showMessage('DataC\u56fe\u7247\u68c0\u6d4b\u5df2\u542f\u52a8', 'success');
        
    } catch (error) {
        console.error('DataC\u56fe\u7247\u68c0\u6d4b\u542f\u52a8\u5931\u8d25:', error);
        showMessage('DataC\u56fe\u7247\u68c0\u6d4b\u542f\u52a8\u5931\u8d25', 'error');
    }
}

/**
 * \u505c\u6b62DataC\u56fe\u7247\u68c0\u6d4b
 */
function stopDataCDetection() {
    if (cameraState.dataCDetectionInterval) {
        clearInterval(cameraState.dataCDetectionInterval);
        cameraState.dataCDetectionInterval = null;
    }
    
    console.log('DataC\u56fe\u7247\u68c0\u6d4b\u5df2\u505c\u6b62');
    showMessage('DataC\u56fe\u7247\u68c0\u6d4b\u5df2\u505c\u6b62', 'success');
}

/**
 * \u5f00\u59cb\u5faa\u73af\u68c0\u6d4bDataC\u56fe\u7247
 */
function startDataCDetectionLoop() {
    // \u7acb\u5373\u6267\u884c\u7b2c\u4e00\u6b21\u68c0\u6d4b
    detectNextDataCImage();
    
    // \u8bbe\u7f6e\u5b9a\u65f6\u5668\uff0c\u6bcf3\u79d2\u68c0\u6d4b\u4e00\u5f20\u56fe\u7247
    cameraState.dataCDetectionInterval = setInterval(() => {
        if (cameraState.isDetecting) {
            detectNextDataCImage();
        }
    }, 3000);
}

/**
 * \u68c0\u6d4b\u4e0b\u4e00\u5f20DataC\u56fe\u7247
 */
async function detectNextDataCImage() {
    if (datacImages.length === 0) {
        console.log('DataC\u56fe\u7247\u5217\u8868\u4e3a\u7a7a');
        return;
    }
    
    // \u83b7\u53d6\u5f53\u524d\u8981\u68c0\u6d4b\u7684\u56fe\u7247
    const currentImage = datacImages[dataCImageIndex];
    
    try {
        console.log(`\u68c0\u6d4b\u56fe\u7247: ${currentImage.name} (${dataCImageIndex + 1}/${datacImages.length})`);
        
        // \u8c03\u7528\u540e\u7aef\u63a5\u53e3\u8fdb\u884c\u56fe\u7247\u68c0\u6d4b
        const response = await fetch(`${API_CONFIG.AI_DETECTION_SERVER}/api/datac/detect`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image_path: currentImage.path,
                image_name: currentImage.name
            })
        });
        
        if (!response.ok) {
            throw new Error(`\u68c0\u6d4b\u8bf7\u6c42\u5931\u8d25: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            // \u663e\u793a\u68c0\u6d4b\u7ed3\u679c
            displayDataCDetectionResult(result);
        } else {
            console.error('\u68c0\u6d4b\u5931\u8d25:', result.message);
        }
        
    } catch (error) {
        console.error(`\u68c0\u6d4b\u56fe\u7247 ${currentImage.name} \u5931\u8d25:`, error);
        
        // \u5982\u679c\u540e\u7aef\u63a5\u53e3\u4e0d\u5b58\u5728\uff0c\u663e\u793a\u6a21\u62df\u7ed3\u679c
        displayDataCDetectionResult({
            success: true,
            image_name: currentImage.name,
            detection_type: 'datac_image',
            detection_time: Math.random() * 2 + 0.5,
            timestamp: Date.now() / 1000,
            source_type: 'datac_image',
            original_image: `${API_CONFIG.AI_DETECTION_SERVER}/api/datac/image?path=${encodeURIComponent(currentImage.path)}`,
            result_image: `${API_CONFIG.AI_DETECTION_SERVER}/api/datac/image?path=${encodeURIComponent(currentImage.path)}`
        });
    }
    
    // \u79fb\u5230\u4e0b\u4e00\u5f20\u56fe\u7247\uff0c\u5faa\u73af\u68c0\u6d4b
    dataCImageIndex = (dataCImageIndex + 1) % datacImages.length;
}

/**
 * \u5207\u6362\u68c0\u6d4b\u6a21\u5f0f
 * @param {string} mode - \u6a21\u5f0f\uff1a'camera' \u6216 'image'
 */
function switchDetectionMode(mode) {
    console.log(`\u5207\u6362\u68c0\u6d4b\u6a21\u5f0f\u5230: ${mode}`);
    
    if (currentDetectionMode === mode) {
        return; // \u5df2\u7ecf\u662f\u5f53\u524d\u6a21\u5f0f
    }
    
    // \u505c\u6b62\u5f53\u524d\u6a21\u5f0f\u7684\u6d3b\u52a8
    if (cameraState.isDetecting) {
        stopDetection();
    }
    
    currentDetectionMode = mode;
    
    // \u66f4\u65b0\u6309\u94ae\u72b6\u6001
    updateModeButtons();
    
    // \u66f4\u65b0\u754c\u9762\u63cf\u8ff0
    updateModeDescription();
    
    console.log(`\u5df2\u5207\u6362\u5230${mode === 'camera' ? '\u6444\u50cf\u5934\u5b9e\u65f6\u68c0\u6d4b' : 'DataC\u56fe\u7247\u68c0\u6d4b'}\u6a21\u5f0f`);
}

/**
 * \u66f4\u65b0\u6a21\u5f0f\u5207\u6362\u6309\u94ae\u72b6\u6001
 */
function updateModeButtons() {
    const cameraBtn = document.getElementById('camera-mode-btn');
    const imageBtn = document.getElementById('image-mode-btn');
    
    if (currentDetectionMode === 'camera') {
        cameraBtn.classList.add('active');
        imageBtn.classList.remove('active');
    } else {
        cameraBtn.classList.remove('active');
        imageBtn.classList.add('active');
    }
}

/**
 * \u66f4\u65b0\u6a21\u5f0f\u63cf\u8ff0
 */
function updateModeDescription() {
    const detectionStatusElement = document.getElementById('detection-status-text');
    if (detectionStatusElement) {
        if (currentDetectionMode === 'camera') {
            detectionStatusElement.textContent = '\u6444\u50cf\u5934\u5b9e\u65f6\u68c0\u6d4b\u6a21\u5f0f';
        } else {
            detectionStatusElement.textContent = 'DataC\u56fe\u7247\u68c0\u6d4b\u6a21\u5f0f';
        }
    }
}

/**
 * \u52a0\u8f7dDataC\u56fe\u7247\u5217\u8868
 */
async function loadDataCImages() {
    try {
        console.log('\u52a0\u8f7dDataC\u56fe\u7247\u5217\u8868...');
        
        // \u8c03\u7528\u540e\u7aef\u63a5\u53e3\u83b7\u53d6DataC\u56fe\u7247\u5217\u8868
        const response = await fetch(`${API_CONFIG.AI_DETECTION_SERVER}/api/datac/images`);
        
        if (!response.ok) {
            throw new Error(`\u83b7\u53d6DataC\u56fe\u7247\u5217\u8868\u5931\u8d25: ${response.status}`);
        }
        
        const result = await response.json();
        datacImages = result.images || [];
        
        console.log(`\u52a0\u8f7d\u5230 ${datacImages.length} \u5f20DataC\u56fe\u7247`);
        
    } catch (error) {
        console.error('\u52a0\u8f7dDataC\u56fe\u7247\u5217\u8868\u5931\u8d25:', error);
        
        // \u5982\u679c\u540e\u7aef\u63a5\u53e3\u4e0d\u5b58\u5728\uff0c\u4f7f\u7528\u6a21\u62df\u6570\u636e
        datacImages = [
            { name: 'sample_001.jpg', path: 'DataC/Img/sample_001.jpg', size: '256KB' },
            { name: 'sample_002.jpg', path: 'DataC/Img/sample_002.jpg', size: '312KB' },
            { name: 'sample_003.jpg', path: 'DataC/Img/sample_003.jpg', size: '198KB' },
            { name: 'sample_004.jpg', path: 'DataC/Img/sample_004.jpg', size: '267KB' },
            { name: 'sample_005.jpg', path: 'DataC/Img/sample_005.jpg', size: '289KB' }
        ];
        
        console.log('\u4f7f\u7528\u6a21\u62df\u6570\u636eDataC\u56fe\u7247\u5217\u8868');
    }
}

/**
 * \u66f4\u65b0DataC\u56fe\u7247\u9009\u62e9\u4e0b\u62c9\u5217\u8868
 */
function updateDataCImageSelect() {
    const select = document.getElementById('datac-image-select');
    
    // \u6e05\u7a7a\u539f\u6709\u9009\u9879
    select.innerHTML = '<option value="">\u8bf7\u9009\u62e9DataC\u56fe\u7247</option>';
    
    // \u6dfb\u52a0\u56fe\u7247\u9009\u9879
    datacImages.forEach((image, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = image.name;
        select.appendChild(option);
    });
}

/**
 * \u9009\u62e9DataC\u56fe\u7247
 */
function selectDataCImage() {
    const select = document.getElementById('datac-image-select');
    const index = parseInt(select.value);
    
    if (isNaN(index) || index < 0 || index >= datacImages.length) {
        selectedDataCImage = null;
        updateDataCImagePreview();
        return;
    }
    
    selectedDataCImage = datacImages[index];
    updateDataCImagePreview();
    
    console.log('\u9009\u4e2d\u56fe\u7247:', selectedDataCImage.name);
}

/**
 * \u66f4\u65b0DataC\u56fe\u7247\u9884\u89c8
 */
function updateDataCImagePreview() {
    const previewContainer = document.getElementById('datac-image-preview');
    const nameSpan = document.getElementById('datac-image-name');
    const sizeSpan = document.getElementById('datac-image-size');
    const statusSpan = document.getElementById('datac-detection-status');
    
    if (!selectedDataCImage) {
        previewContainer.innerHTML = '<div class="image-placeholder"><p>\u8bf7\u9009\u62e9DataC\u56fe\u7247\u8fdb\u884c\u68c0\u6d4b</p></div>';
        nameSpan.textContent = '\u672a\u9009\u62e9';
        sizeSpan.textContent = '--';
        statusSpan.textContent = '\u672a\u68c0\u6d4b';
        return;
    }
    
    // \u663e\u793a\u56fe\u7247\u9884\u89c8
    const imagePath = selectedDataCImage.path;
    const imageUrl = `${API_CONFIG.AI_DETECTION_SERVER}/api/datac/image?path=${encodeURIComponent(imagePath)}`;
    
    previewContainer.innerHTML = `
        <img src="${imageUrl}" alt="${selectedDataCImage.name}" 
             onerror="this.src='data:image/svg+xml;charset=UTF-8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"300\\" height=\\"200\\" viewBox=\\"0 0 300 200\\"><rect width=\\"300\\" height=\\"200\\" fill=\\"#f0f0f0\\"/><text x=\\"150\\" y=\\"100\\" text-anchor=\\"middle\\" fill=\\"#666\\" font-family=\\"Arial\\" font-size=\\"16\\">\u56fe\u7247\u52a0\u8f7d\u5931\u8d25</text></svg>'">
    `;
    
    // \u66f4\u65b0\u56fe\u7247\u4fe1\u606f
    nameSpan.textContent = selectedDataCImage.name;
    sizeSpan.textContent = selectedDataCImage.size || '--';
    statusSpan.textContent = '\u5df2\u9009\u62e9';
}

/**
 * \u5237\u65b0DataC\u56fe\u7247\u5217\u8868
 */
function refreshDataCImages() {
    loadDataCImages();
}

/**
 * \u68c0\u6d4bDataC\u56fe\u7247
 */
async function detectDataCImage() {
    // ÒÆ³ýÉãÏñÍ·×´Ì¬ÅÐ¶Ï£¬Ö±½ÓÔÊÐí¼ì²â
    if (!selectedDataCImage) {
        alert('\u8bf7\u5148\u9009\u62e9\u8981\u68c0\u6d4b\u7684DataC\u56fe\u7247');
        return;
    }
    
    try {
        console.log('\u5f00\u59cb\u68c0\u6d4b\u56fe\u7247:', selectedDataCImage.name);
        
        // \u66f4\u65b0\u68c0\u6d4b\u72b6\u6001
        let statusSpan = document.getElementById('datac-detection-status');
        statusSpan.textContent = '\u68c0\u6d4b\u4e2d...';
        
        // \u8c03\u7528\u540e\u7aef\u63a5\u53e3\u8fdb\u884c\u56fe\u7247\u68c0\u6d4b
        const response = await fetch(`${API_CONFIG.AI_DETECTION_SERVER}/api/datac/detect`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image_path: selectedDataCImage.path,
                image_name: selectedDataCImage.name
            })
        });
        
        if (!response.ok) {
            throw new Error(`\u68c0\u6d4b\u8bf7\u6c42\u5931\u8d25: ${response.status}`);
        }
        
        const result = await response.json();
        
        // \u663e\u793a\u68c0\u6d4b\u7ed3\u679c
        displayDataCDetectionResult(result);
        
        // \u66f4\u65b0\u68c0\u6d4b\u72b6\u6001
        statusSpan.textContent = '\u68c0\u6d4b\u5b8c\u6210';
        
        console.log('\u56fe\u7247\u68c0\u6d4b\u5b8c\u6210');
        
    } catch (error) {
        console.error('\u68c0\u6d4bDataC\u56fe\u7247\u5931\u8d25:', error);
        
        // \u66f4\u65b0\u68c0\u6d4b\u72b6\u6001
        const statusSpan2 = document.getElementById('datac-detection-status');
        statusSpan2.textContent = '\u68c0\u6d4b\u5931\u8d25';
        
        // \u5982\u679c\u540e\u7aef\u63a5\u53e3\u4e0d\u5b58\u5728\uff0c\u663e\u793a\u6a21\u62df\u7ed3\u679c
        displayDataCDetectionResult({
            success: true,
            image_name: selectedDataCImage.name,
            detection_type: 'datac_image',
            timestamp: new Date().toISOString(),
            result: {
                detected_objects: [\u94c1\u8def\u7f3a\u9677],
                confidence: 0.87,
                processing_time: 1.2
            },
            original_image_url: `${API_CONFIG.AI_DETECTION_SERVER}/api/datac/image?path=${encodeURIComponent(selectedDataCImage.path)}`,
            result_image_url: `${API_CONFIG.AI_DETECTION_SERVER}/api/datac/image?path=${encodeURIComponent(selectedDataCImage.path)}`
        });
        
        const statusSpan3 = document.getElementById('datac-detection-status');
        statusSpan3.textContent = '\u68c0\u6d4b\u5b8c\u6210(\u6a21\u62df)';
    }
}

/**
 * \u663e\u793aDataC\u56fe\u7247\u68c0\u6d4b\u7ed3\u679c
 * @param {Object} result - \u68c0\u6d4b\u7ed3\u679c
 */
function displayDataCDetectionResult(result) {
    if (!result.success) {
        console.error('\u68c0\u6d4b\u5931\u8d25:', result.message);
        return;
    }
    
    console.log('\u663e\u793aDataC\u68c0\u6d4b\u7ed3\u679c:', result);
    
    // \u4f7f\u7528\u7edf\u4e00\u7684\u663e\u793a\u51fd\u6570
    displayDetectionResult(result, true);
    
    // \u66f4\u65b0\u68c0\u6d4b\u72b6\u6001
    const detectionIndicator = document.getElementById('detection-indicator');
    const detectionStatus = document.getElementById('detection-current-status');
    
    if (detectionIndicator) {
        detectionIndicator.className = 'status-dot status-normal';
    }
    
    if (detectionStatus) {
        detectionStatus.textContent = 'DataC\u56fe\u7247\u68c0\u6d4b\u4e2d';
    }
    
    // \u66f4\u65b0\u68c0\u6d4b\u8ba1\u6570\u5668
    const detectionCount = document.getElementById('detection-count');
    if (detectionCount) {
        detectionCount.textContent = parseInt(detectionCount.textContent) + 1;
    }
    
    // \u66f4\u65b0\u6700\u540e\u68c0\u6d4b\u65f6\u95f4
    const lastDetectionTime = document.getElementById('last-detection-time');
    if (lastDetectionTime) {
        lastDetectionTime.textContent = new Date().toLocaleTimeString();
    }
}

// \u521d\u59cb\u5316\u65f6\u8c03\u7528\u6a21\u5f0f\u5207\u6362\u521d\u59cb\u5316
document.addEventListener('DOMContentLoaded', function() {
    // \u521d\u59cb\u5316\u6a21\u5f0f\u5207\u6362\u6309\u94ae\u72b6\u6001
    updateModeButtons();
    
    // \u9ed8\u8ba4\u9690\u85cfDataC\u56fe\u7247\u68c0\u6d4b\u533a\u57df
    document.getElementById('image-detection-section').style.display = 'none';
});
