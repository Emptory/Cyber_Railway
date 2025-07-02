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

  // ģ��Ӻ�˻�ȡ���ݵĺ���
  useEffect(() => {
    // ���ｫ���ᱻ�滻Ϊ������API����
    const mockData = {
      originalImage: "/images/pexels-tuurt-179153.jpg", // ��ʱʹ������ͼƬ��Ϊʾ��
      analyzedImage: "/images/pexels-photospublic-1181202.jpg", // ��ʱʹ������ͼƬ��Ϊʾ��
      analysisResults: [
        {
          defectType: "��������",
          location: "������� 125.3m",
          severity: "�ж�",
          size: "����: 8.5cm, ���: 2.3mm",
          recommendation: "�������´�ά�������ڽ����޸�"
        },
        {
          defectType: "ĥ��",
          location: "������� 127.8m",
          severity: "���", 
          size: "���: 15.2cm?",
          recommendation: "������أ������账��"
        },
        {
          defectType: "��ʴ��",
          location: "������� 129.1m",
          severity: "�ض�",
          size: "ֱ��: 3.4cm, ���: 1.8mm",
          recommendation: "����ά�ޣ�������������"
        }
      ]
    };
    setAnalysisData(mockData);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "�ض�": return '#ff4444';
      case "�ж�": return '#ffaa00';
      case "���": return '#00ff00';
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
      {/* ����״̬�� */}
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
            ���̽��ʵʱ���
          </h1>
          <p style={{ 
            color: '#cccccc', 
            margin: '5px 0 0 0' 
          }}>
            ϵͳ״̬: ��������
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

      {/* ͼ����ʾ���� */}
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
          ͼ��������
        </h2>
        
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          marginBottom: '30px'
        }}>
          {/* ԭʼͼ�� */}
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
              ԭʼͼ��
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
                  alt="ԭʼ���ͼ��" 
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                />
              ) : (
                <div style={{ color: '#666' }}>�ȴ�ͼ������...</div>
              )}
            </div>
          </div>

          {/* ������ͼ�� */}
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
              �������ͼ��
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
                  alt="��������ͼ��" 
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                />
              ) : (
                <div style={{ color: '#666' }}>�ȴ��������...</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ����������� */}
      <div style={{
        background: '#1a1a1a',
        padding: '30px',
        borderRadius: '10px'
      }}>
        <h2 style={{ 
          color: '#00ffff', 
          margin: '0 0 20px 0' 
        }}>
          ȱ�ݷ�������
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
                    <strong style={{ color: '#00ffff' }}>λ��:</strong> {result.location}
                  </div>
                  <div>
                    <strong style={{ color: '#00ffff' }}>�ߴ�:</strong> {result.size}
                  </div>
                </div>
                
                <div style={{
                  marginTop: '15px',
                  padding: '10px',
                  background: '#2a2a2a',
                  borderRadius: '5px',
                  borderLeft: '3px solid #00ffff'
                }}>
                  <strong style={{ color: '#00ffff' }}>������:</strong>
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
            ���޼�⵽ȱ�ݣ����״̬����
          </div>
        )}
      </div>
    </div>
  );
};

export default Monitor;
