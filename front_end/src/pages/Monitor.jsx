import React, { useState, useEffect } from 'react';

const Monitor = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('realtime'); // 'realtime', 'history'
  const [analysisData, setAnalysisData] = useState({
    originalImage: null,
    analyzedImage: null,
    analysisResults: []
  });
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock data simulation function for backend data retrieval
  useEffect(() => {
    // 加载当前监控数据
    const loadCurrentData = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/monitor/current');
        const data = await response.json();
        
        if (data.status !== 'no_data') {
          // 使用后端数据
          const backendData = {
            originalImage: data.originalImage?.base64 ? 
              `data:image/${data.originalImage.format};base64,${data.originalImage.base64}` : 
              "/images/pexels-tuurt-179153.jpg",
            analyzedImage: data.analyzedImage?.base64 ? 
              `data:image/${data.analyzedImage.format};base64,${data.analyzedImage.base64}` : 
              "/images/pexels-photospublic-1181202.jpg",
            analysisResults: data.defectReport ? [{
              defectType: data.defectReport.defectType || String.fromCharCode(0x8868,0x9762,0x88C2,0x7EB9),
              location: String.fromCharCode(0x8DDD,0x79BB,0x8D77,0x70B9,0x0020,0x0031,0x0032,0x0035,0x002E,0x0033,0x006D),
              severity: data.defectReport.severity || String.fromCharCode(0x4E2D,0x5EA6),
              size: String.fromCharCode(0x957F,0x5EA6,0x003A,0x0020,0x0038,0x002E,0x0035,0x0063,0x006D,0x002C,0x0020,0x6DF1,0x5EA6,0x003A,0x0020,0x0032,0x002E,0x0033,0x006D,0x006D),
              recommendation: data.defectReport.description || String.fromCharCode(0x5EFA,0x8BAE,0x5728,0x4E0B,0x6B21,0x7EF4,0x62A4,0x7A97,0x53E3,0x671F,0x8FDB,0x884C,0x4FEE,0x590D)
            }] : []
          };
          setAnalysisData(backendData);
        } else {
          // 使用Mock数据作为备选
          const mockData = {
            originalImage: "/images/pexels-tuurt-179153.jpg",
            analyzedImage: "/images/pexels-photospublic-1181202.jpg",
            analysisResults: [
              {
                defectType: String.fromCharCode(0x8868,0x9762,0x88C2,0x7EB9),
                location: String.fromCharCode(0x8DDD,0x79BB,0x8D77,0x70B9,0x0020,0x0031,0x0032,0x0035,0x002E,0x0033,0x006D),
                severity: String.fromCharCode(0x4E2D,0x5EA6),
                size: String.fromCharCode(0x957F,0x5EA6,0x003A,0x0020,0x0038,0x002E,0x0035,0x0063,0x006D,0x002C,0x0020,0x6DF1,0x5EA6,0x003A,0x0020,0x0032,0x002E,0x0033,0x006D,0x006D),
                recommendation: String.fromCharCode(0x5EFA,0x8BAE,0x5728,0x4E0B,0x6B21,0x7EF4,0x62A4,0x7A97,0x53E3,0x671F,0x8FDB,0x884C,0x4FEE,0x590D)
              }
            ]
          };
          setAnalysisData(mockData);
        }
      } catch (error) {
        console.error('加载监控数据失败:', error);
        // 使用Mock数据作为备选
        const mockData = {
          originalImage: "/images/pexels-tuurt-179153.jpg",
          analyzedImage: "/images/pexels-photospublic-1181202.jpg",
          analysisResults: [
            {
              defectType: String.fromCharCode(0x8868,0x9762,0x88C2,0x7EB9),
              location: String.fromCharCode(0x8DDD,0x79BB,0x8D77,0x70B9,0x0020,0x0031,0x0032,0x0035,0x002E,0x0033,0x006D),
              severity: String.fromCharCode(0x4E2D,0x5EA6),
              size: String.fromCharCode(0x957F,0x5EA6,0x003A,0x0020,0x0038,0x002E,0x0035,0x0063,0x006D,0x002C,0x0020,0x6DF1,0x5EA6,0x003A,0x0020,0x0032,0x002E,0x0033,0x006D,0x006D),
              recommendation: String.fromCharCode(0x5EFA,0x8BAE,0x5728,0x4E0B,0x6B21,0x7EF4,0x62A4,0x7A97,0x53E3,0x671F,0x8FDB,0x884C,0x4FEE,0x590D)
            }
          ]
        };
        setAnalysisData(mockData);
      }
    };

    // 加载历史记录
    const loadHistoryData = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/monitor/history');
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          // 转换后端数据格式
          const convertedHistory = data.map((item, index) => ({
            id: index + 1,
            timestamp: item.summary?.time || new Date(item.timestamp * 1000).toLocaleString(),
            originalImage: item.image?.base64 ? 
              `data:image/${item.image.format};base64,${item.image.base64}` : 
              "/images/pexels-tuurt-179153.jpg",
            analyzedImage: item.image?.base64 ? 
              `data:image/${item.image.format};base64,${item.image.base64}` : 
              "/images/pexels-photospublic-1181202.jpg",
            defectsCount: item.summary?.hasDefect ? 1 : 0,
            severity: item.summary?.hasDefect ? String.fromCharCode(0x4E2D,0x5EA6) : String.fromCharCode(0x6B63,0x5E38),
            location: String.fromCharCode(0x8DEF,0x6BB5,0x0041,0x0020,0x004B,0x004D,0x0031,0x0032,0x0035)
          }));
          setHistoryData(convertedHistory);
        } else {
          // 使用Mock数据
          const mockHistoryData = [
            {
              id: 1,
              timestamp: "2025-07-03 14:30:15",
              originalImage: "/images/pexels-tuurt-179153.jpg",
              analyzedImage: "/images/pexels-photospublic-1181202.jpg",
              defectsCount: 2,
              severity: String.fromCharCode(0x4E2D,0x5EA6),
              location: String.fromCharCode(0x8DEF,0x6BB5,0x0041,0x0020,0x004B,0x004D,0x0031,0x0032,0x0035)
            }
          ];
          setHistoryData(mockHistoryData);
        }
      } catch (error) {
        console.error('加载历史数据失败:', error);
        // 使用Mock数据
        const mockHistoryData = [
          {
            id: 1,
            timestamp: "2025-07-03 14:30:15",
            originalImage: "/images/pexels-tuurt-179153.jpg",
            analyzedImage: "/images/pexels-photospublic-1181202.jpg",
            defectsCount: 2,
            severity: String.fromCharCode(0x4E2D,0x5EA6),
            location: String.fromCharCode(0x8DEF,0x6BB5,0x0041,0x0020,0x004B,0x004D,0x0031,0x0032,0x0035)
          }
        ];
        setHistoryData(mockHistoryData);
      }
    };

    loadCurrentData();
    loadHistoryData();

    // 设置定时刷新（每10秒）
    const interval = setInterval(() => {
      loadCurrentData();
      loadHistoryData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case String.fromCharCode(0x91CD,0x5EA6): return '#ff4444'; // 重度
      case String.fromCharCode(0x4E2D,0x5EA6): return '#ffaa00'; // 中度
      case String.fromCharCode(0x8F7B,0x5EA6): return '#00ff00'; // 轻度
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
            {String.fromCharCode(0x8F68,0x9053,0x63A2,0x4F24,0x5B9E,0x65F6,0x76D1,0x63A7)} {/* 轨道探伤实时监控 */}
          </h1>
          <p style={{ 
            color: '#cccccc', 
            margin: '5px 0 0 0' 
          }}>
            {String.fromCharCode(0x7CFB,0x7EDF,0x72B6,0x6001,0x003A,0x0020)} {/* 系统状态: */}
            {String.fromCharCode(0x6B63,0x5E38,0x8FD0,0x884C)} {/* 正常运行 */}
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

      {/* 导航标签 */}
      <div style={{
        background: '#1a1a1a',
        padding: '10px 20px',
        borderRadius: '10px',
        marginBottom: '20px',
        display: 'flex',
        gap: '20px'
      }}>
        <button
          onClick={() => setActiveTab('realtime')}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            background: activeTab === 'realtime' ? '#00ffff' : 'transparent',
            color: activeTab === 'realtime' ? '#000' : '#fff',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'all 0.3s'
          }}
        >
          {String.fromCharCode(0x5B9E,0x65F6,0x76D1,0x63A7)} {/* 实时监控 */}
        </button>
        <button
          onClick={() => setActiveTab('history')}
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            background: activeTab === 'history' ? '#00ffff' : 'transparent',
            color: activeTab === 'history' ? '#000' : '#fff',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'all 0.3s'
          }}
        >
          {String.fromCharCode(0x5386,0x53F2,0x8BB0,0x5F55)} {/* 历史记录 */}
        </button>
      </div>

      {/* 实时监控内容 */}
      {activeTab === 'realtime' && (
        <div>
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
              {String.fromCharCode(0x56FE,0x50CF,0x5206,0x6790,0x7ED3,0x679C)} {/* 图像分析结果 */}
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
                  {String.fromCharCode(0x539F,0x59CB,0x56FE,0x50CF)} {/* 原始图像 */}
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
                      alt="Original track image" 
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    <div style={{ color: '#666' }}>
                      {String.fromCharCode(0x7B49,0x5F85,0x56FE,0x50CF,0x6570,0x636E,0x002E,0x002E,0x002E)} {/* 等待图像数据... */}
                    </div>
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
                  {String.fromCharCode(0x5206,0x6790,0x7ED3,0x679C,0x56FE,0x50CF)} {/* 分析结果图像 */}
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
                      alt="Analyzed track image" 
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    <div style={{ color: '#666' }}>
                      {String.fromCharCode(0x7B49,0x5F85,0x5206,0x6790,0x7ED3,0x679C,0x002E,0x002E,0x002E)} {/* 等待分析结果... */}
                    </div>
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
              {String.fromCharCode(0x7F3A,0x9677,0x5206,0x6790,0x62A5,0x544A)} {/* 缺陷分析报告 */}
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
                        <strong style={{ color: '#00ffff' }}>
                          {String.fromCharCode(0x4F4D,0x7F6E,0x003A)} {/* 位置: */}
                        </strong> {result.location}
                      </div>
                      <div>
                        <strong style={{ color: '#00ffff' }}>
                          {String.fromCharCode(0x5C3A,0x5BF8,0x003A)} {/* 尺寸: */}
                        </strong> {result.size}
                      </div>
                    </div>
                    
                    <div style={{
                      marginTop: '15px',
                      padding: '10px',
                      background: '#2a2a2a',
                      borderRadius: '5px',
                      borderLeft: '3px solid #00ffff'
                    }}>
                      <strong style={{ color: '#00ffff' }}>
                        {String.fromCharCode(0x5904,0x7406,0x5EFA,0x8BAE,0x003A)} {/* 处理建议: */}
                      </strong>
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
                {String.fromCharCode(0x6682,0x65E0,0x68C0,0x6D4B,0x5230,0x7F3A,0x9677,0xFF0C,0x8F68,0x9053,0x72B6,0x6001,0x826F,0x597D)} {/* 暂无检测到缺陷，轨道状态良好 */}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 历史记录内容 */}
      {activeTab === 'history' && (
        <div style={{
          background: '#1a1a1a',
          padding: '30px',
          borderRadius: '10px'
        }}>
          <h2 style={{ 
            color: '#00ffff', 
            margin: '0 0 30px 0' 
          }}>
            {String.fromCharCode(0x68C0,0x6D4B,0x5386,0x53F2,0x8BB0,0x5F55)} {/* 检测历史记录 */}
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {historyData.map((record) => (
              <div
                key={record.id}
                style={{
                  background: '#232323',
                  padding: '25px',
                  borderRadius: '10px',
                  border: '1px solid #333',
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'center'
                }}
              >
                <div style={{
                  display: 'flex',
                  gap: '15px'
                }}>
                  <img 
                    src={record.originalImage} 
                    alt="Historical original"
                    style={{
                      width: '100px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '5px',
                      border: '1px solid #555'
                    }}
                  />
                  <img 
                    src={record.analyzedImage} 
                    alt="Historical analyzed"
                    style={{
                      width: '100px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '5px',
                      border: '1px solid #555'
                    }}
                  />
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '15px',
                    color: '#cccccc'
                  }}>
                    <div>
                      <strong style={{ color: '#00ffff' }}>
                        {String.fromCharCode(0x68C0,0x6D4B,0x65F6,0x95F4,0x003A)} {/* 检测时间: */}
                      </strong> {record.timestamp}
                    </div>
                    <div>
                      <strong style={{ color: '#00ffff' }}>
                        {String.fromCharCode(0x4F4D,0x7F6E,0x003A)} {/* 位置: */}
                      </strong> {record.location}
                    </div>
                    <div>
                      <strong style={{ color: '#00ffff' }}>
                        {String.fromCharCode(0x7F3A,0x9677,0x6570,0x91CF,0x003A)} {/* 缺陷数量: */}
                      </strong> {record.defectsCount}
                    </div>
                    <div>
                      <strong style={{ color: '#00ffff' }}>
                        {String.fromCharCode(0x4E25,0x91CD,0x7A0B,0x5EA6,0x003A)} {/* 严重程度: */}
                      </strong>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          background: getSeverityColor(record.severity),
                          color: '#000000',
                          marginLeft: '5px'
                        }}
                      >
                        {record.severity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Monitor;
