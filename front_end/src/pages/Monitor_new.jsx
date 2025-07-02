import React, { useState, useEffect } from 'react';

const Monitor = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [analysisData, setAnalysisData] = useState({
    originalImage: null,
    analyzedImage: null,
    analysisResults: []
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 模拟从后端获取数据的函数
  useEffect(() => {
    // 这里将来会被替换为真正的API调用
    const mockData = {
      originalImage: "/images/pexels-tuurt-179153.jpg", // 临时使用现有图片作为示例
      analyzedImage: "/images/pexels-photospublic-1181202.jpg", // 临时使用现有图片作为示例
      analysisResults: [
        {
          defectType: "表面裂纹",
          location: "距离起点 125.3m",
          severity: "中度",
          size: "长度: 8.5cm, 深度: 2.3mm",
          recommendation: "建议在下次维护窗口期进行修复"
        },
        {
          defectType: "磨损",
          location: "距离起点 127.8m",
          severity: "轻度", 
          size: "面积: 15.2cm?",
          recommendation: "持续监控，暂无需处理"
        },
        {
          defectType: "腐蚀点",
          location: "距离起点 129.1m",
          severity: "重度",
          size: "直径: 3.4cm, 深度: 1.8mm",
          recommendation: "紧急维修，建议立即处理"
        }
      ]
    };
    setAnalysisData(mockData);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "重度": return '#ff4444';
      case "中度": return '#ffaa00';
      case "轻度": return '#00ff00';
      default: return '#cccccc';
    }
  };

  return (
    <div style={{ 
      fontFamily: '"Noto Sans SC", "Microsoft YaHei", "SimHei", "SimSun", "Arial Unicode MS", Arial, sans-serif', 
      background: '#0a0a0a', 
      color: '#ffffff', 
      minHeight: '100vh', 
      padding: '20px' 
    }}>
      {/* 顶部状态栏 */}
      <div style={{
        background: '#1a1a1a',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ 
            color: '#00ffff', 
            margin: 0, 
            fontSize: '2rem' 
          }}>
            轨道探伤实时监控
          </h1>
          <p style={{ 
            color: '#cccccc', 
            margin: '5px 0 0 0' 
          }}>
            系统状态: 正常运行
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ 
            color: '#00ffff', 
            fontSize: '1.5rem' 
          }}>
            {currentTime.toLocaleTimeString()}
          </div>
          <div style={{ 
            color: '#cccccc', 
            fontSize: '0.9rem' 
          }}>
            {currentTime.toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* 图像显示区域 */}
      <div style={{
        background: '#1a1a1a',
        padding: '30px',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h2 style={{ 
          color: '#00ffff', 
          margin: '0 0 20px 0', 
          textAlign: 'center' 
        }}>
          图像分析结果
        </h2>
        
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          marginBottom: '30px'
        }}>
          {/* 原始图像 */}
          <div style={{
            background: '#232323',
            padding: '20px',
            borderRadius: '10px',
            border: '2px solid #333',
            textAlign: 'center',
            flex: '1',
            maxWidth: '45%'
          }}>
            <h3 style={{ 
              color: '#ffffff', 
              margin: '0 0 15px 0' 
            }}>
              原始图像
            </h3>
            <div style={{
              background: '#000',
              border: '1px solid #555',
              borderRadius: '5px',
              overflow: 'hidden',
              height: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {analysisData.originalImage ? (
                <img 
                  src={analysisData.originalImage} 
                  alt="原始轨道图像" 
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                />
              ) : (
                <div style={{ color: '#666' }}>等待图像数据...</div>
              )}
            </div>
          </div>

          {/* 分析后图像 */}
          <div style={{
            background: '#232323',
            padding: '20px',
            borderRadius: '10px',
            border: '2px solid #333',
            textAlign: 'center',
            flex: '1',
            maxWidth: '45%'
          }}>
            <h3 style={{ 
              color: '#ffffff', 
              margin: '0 0 15px 0' 
            }}>
              分析结果图像
            </h3>
            <div style={{
              background: '#000',
              border: '1px solid #555',
              borderRadius: '5px',
              overflow: 'hidden',
              height: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {analysisData.analyzedImage ? (
                <img 
                  src={analysisData.analyzedImage} 
                  alt="分析后轨道图像" 
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                />
              ) : (
                <div style={{ color: '#666' }}>等待分析结果...</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 分析结果详情 */}
      <div style={{
        background: '#1a1a1a',
        padding: '30px',
        borderRadius: '10px'
      }}>
        <h2 style={{ 
          color: '#00ffff', 
          margin: '0 0 20px 0' 
        }}>
          缺陷分析报告
        </h2>

        {analysisData.analysisResults.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {analysisData.analysisResults.map((result, index) => (
              <div
                key={index}
                style={{
                  background: '#232323',
                  padding: '20px',
                  borderRadius: '10px',
                  border: '1px solid #333',
                  borderLeft: `4px solid ${getSeverityColor(result.severity)}`
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <h3 style={{ 
                    color: '#ffffff', 
                    margin: 0,
                    fontSize: '1.2rem'
                  }}>
                    {result.defectType}
                  </h3>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      background: getSeverityColor(result.severity),
                      color: '#000000',
                      fontWeight: 'bold'
                    }}
                  >
                    {result.severity}
                  </span>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '15px',
                  color: '#cccccc'
                }}>
                  <div>
                    <strong style={{ color: '#00ffff' }}>位置:</strong> {result.location}
                  </div>
                  <div>
                    <strong style={{ color: '#00ffff' }}>尺寸:</strong> {result.size}
                  </div>
                </div>
                
                <div style={{
                  marginTop: '15px',
                  padding: '10px',
                  background: '#2a2a2a',
                  borderRadius: '5px',
                  borderLeft: '3px solid #00ffff'
                }}>
                  <strong style={{ color: '#00ffff' }}>处理建议:</strong>
                  <span style={{ color: '#ffffff', marginLeft: '10px' }}>
                    {result.recommendation}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            color: '#666',
            padding: '40px',
            fontSize: '1.1rem'
          }}>
            暂无检测到缺陷，轨道状态良好
          </div>
        )}
      </div>
    </div>
  );
};

export default Monitor;
