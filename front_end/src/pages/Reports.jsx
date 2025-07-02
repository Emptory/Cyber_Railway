import React, { useState, useEffect } from 'react';

const Reports = () => {
  const [statisticsData, setStatisticsData] = useState({});

  useEffect(() => {
    // �Ӻ��API��ȡͳ������
    const loadStatisticsData = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/reports/statistics');
        const data = await response.json();
        
        if (data && Object.keys(data).length > 0) {
          // ʹ�ú�����ݣ�ת���ֶ���Ϊ�����ʽ
          const convertedData = {
            totalInspections: data.totalInspections || 0,
            totalDefects: data.totalDefects || 0,
            defectsByType: {},
            defectsBySeverity: {},
            weeklyTrend: data.weeklyTrend || [],
            monthlyComparison: data.monthlyComparison || []
          };

          // ת��ȱ����������
          if (data.defectsByType) {
            Object.keys(data.defectsByType).forEach(key => {
              let encodedKey;
              switch(key) {
                case '��������':
                  encodedKey = String.fromCharCode(0x8868,0x9762,0x88C2,0x7EB9);
                  break;
                case 'ĥ��':
                  encodedKey = String.fromCharCode(0x78E8,0x635F);
                  break;
                case '��ʴ��':
                  encodedKey = String.fromCharCode(0x8150,0x8680,0x70B9);
                  break;
                default:
                  encodedKey = key;
              }
              convertedData.defectsByType[encodedKey] = data.defectsByType[key];
            });
          }

          // ת�����س̶�����
          if (data.defectsBySeverity) {
            Object.keys(data.defectsBySeverity).forEach(key => {
              let encodedKey;
              switch(key) {
                case '�ض�':
                  encodedKey = String.fromCharCode(0x91CD,0x5EA6);
                  break;
                case '�ж�':
                  encodedKey = String.fromCharCode(0x4E2D,0x5EA6);
                  break;
                case '���':
                  encodedKey = String.fromCharCode(0x8F7B,0x5EA6);
                  break;
                default:
                  encodedKey = key;
              }
              convertedData.defectsBySeverity[encodedKey] = data.defectsBySeverity[key];
            });
          }

          // ת���¶ȶԱ�����
          if (data.monthlyComparison) {
            convertedData.monthlyComparison = data.monthlyComparison.map(item => ({
              ...item,
              month: item.month // ���ֺ�˷��ص��·ݸ�ʽ
            }));
          }

          setStatisticsData(convertedData);
        } else {
          // ʹ��Mock������Ϊ��ѡ
          useMockData();
        }
      } catch (error) {
        console.error('����ͳ������ʧ��:', error);
        // ʹ��Mock������Ϊ��ѡ
        useMockData();
      }
    };

    const useMockData = () => {
      const mockStatisticsData = {
        totalInspections: 245,
        totalDefects: 89,
        defectsByType: {
          [String.fromCharCode(0x8868,0x9762,0x88C2,0x7EB9)]: 45,
          [String.fromCharCode(0x78E8,0x635F)]: 28,
          [String.fromCharCode(0x8150,0x8680,0x70B9)]: 16
        },
        defectsBySeverity: {
          [String.fromCharCode(0x91CD,0x5EA6)]: 12,
          [String.fromCharCode(0x4E2D,0x5EA6)]: 34,
          [String.fromCharCode(0x8F7B,0x5EA6)]: 43
        },
        weeklyTrend: [
          { date: "2025-06-26", defects: 8 },
          { date: "2025-06-27", defects: 12 },
          { date: "2025-06-28", defects: 6 },
          { date: "2025-06-29", defects: 15 },
          { date: "2025-06-30", defects: 9 },
          { date: "2025-07-01", defects: 11 },
          { date: "2025-07-02", defects: 7 }
        ],
        monthlyComparison: [
          { month: String.fromCharCode(0x4E00,0x6708), inspections: 198, defects: 67 },
          { month: String.fromCharCode(0x4E8C,0x6708), inspections: 203, defects: 71 },
          { month: String.fromCharCode(0x4E09,0x6708), inspections: 215, defects: 78 },
          { month: String.fromCharCode(0x56DB,0x6708), inspections: 231, defects: 82 },
          { month: String.fromCharCode(0x4E94,0x6708), inspections: 228, defects: 85 },
          { month: String.fromCharCode(0x516D,0x6708), inspections: 245, defects: 89 }
        ]
      };
      setStatisticsData(mockStatisticsData);
    };

    loadStatisticsData();

    // ���ö�ʱˢ�£�ÿ30�룩
    const interval = setInterval(loadStatisticsData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case String.fromCharCode(0x91CD,0x5EA6): return '#ff4444'; // �ض�
      case String.fromCharCode(0x4E2D,0x5EA6): return '#ffaa00'; // �ж�
      case String.fromCharCode(0x8F7B,0x5EA6): return '#00ff00'; // ���
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
      {/* ҳ����� */}
      <div style={{
        background: '#1a1a1a',
        padding: '30px',
        borderRadius: '10px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          color: '#00ffff', 
          margin: 0, 
          fontSize: '2.5rem' 
        }}>
          {String.fromCharCode(0x8F68,0x9053,0x63A2,0x4F24,0x62A5,0x544A,0x5206,0x6790)} {/* ���̽�˱������ */}
        </h1>
        <p style={{ 
          color: '#cccccc', 
          margin: '10px 0 0 0',
          fontSize: '1.1rem'
        }}>
          {String.fromCharCode(0x7EFC,0x5408,0x6570,0x636E,0x7EDF,0x8BA1,0x4E0E,0x8D8B,0x52BF,0x5206,0x6790)} {/* �ۺ�����ͳ�������Ʒ��� */}
        </p>
      </div>

      {/* ͳ�Ƹ��� */}
      <div style={{
        background: '#1a1a1a',
        padding: '30px',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h2 style={{ 
          color: '#00ffff', 
          margin: '0 0 30px 0' 
        }}>
          {String.fromCharCode(0x7EDF,0x8BA1,0x6982,0x89C8)} {/* ͳ�Ƹ��� */}
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            background: '#232323',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center',
            border: '1px solid #333'
          }}>
            <div style={{ color: '#00ffff', fontSize: '2rem', fontWeight: 'bold' }}>
              {statisticsData.totalInspections}
            </div>
            <div style={{ color: '#cccccc', marginTop: '5px' }}>
              {String.fromCharCode(0x603B,0x68C0,0x6D4B,0x6B21,0x6570)} {/* �ܼ����� */}
            </div>
          </div>
          
          <div style={{
            background: '#232323',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center',
            border: '1px solid #333'
          }}>
            <div style={{ color: '#ff4444', fontSize: '2rem', fontWeight: 'bold' }}>
              {statisticsData.totalDefects}
            </div>
            <div style={{ color: '#cccccc', marginTop: '5px' }}>
              {String.fromCharCode(0x53D1,0x73B0,0x7F3A,0x9677,0x6570)} {/* ����ȱ���� */}
            </div>
          </div>
          
          <div style={{
            background: '#232323',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center',
            border: '1px solid #333'
          }}>
            <div style={{ color: '#ffaa00', fontSize: '2rem', fontWeight: 'bold' }}>
              {statisticsData.totalInspections && statisticsData.totalDefects ? 
                ((statisticsData.totalDefects / statisticsData.totalInspections) * 100).toFixed(1) : 0}%
            </div>
            <div style={{ color: '#cccccc', marginTop: '5px' }}>
              {String.fromCharCode(0x7F3A,0x9677,0x53D1,0x73B0,0x7387)} {/* ȱ�ݷ����� */}
            </div>
          </div>
          
          <div style={{
            background: '#232323',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center',
            border: '1px solid #333'
          }}>
            <div style={{ color: '#00ff00', fontSize: '2rem', fontWeight: 'bold' }}>
              {statisticsData.defectsBySeverity && statisticsData.defectsBySeverity[String.fromCharCode(0x91CD,0x5EA6)] || 0}
            </div>
            <div style={{ color: '#cccccc', marginTop: '5px' }}>
              {String.fromCharCode(0x7D27,0x6025,0x7EF4,0x4FEE,0x9879)} {/* ����ά���� */}
            </div>
          </div>
        </div>
      </div>

      {/* ȱ�����ͷֲ� */}
      <div style={{
        background: '#1a1a1a',
        padding: '30px',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h3 style={{ 
          color: '#00ffff', 
          margin: '0 0 20px 0' 
        }}>
          {String.fromCharCode(0x7F3A,0x9677,0x7C7B,0x578B,0x5206,0x5E03)} {/* ȱ�����ͷֲ� */}
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {statisticsData.defectsByType && Object.entries(statisticsData.defectsByType).map(([type, count]) => (
            <div key={type} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <div style={{ minWidth: '120px', color: '#ffffff' }}>
                {type}
              </div>
              <div style={{
                flex: 1,
                background: '#333',
                height: '20px',
                borderRadius: '10px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(count / Math.max(...Object.values(statisticsData.defectsByType))) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #00ffff, #0080ff)',
                  transition: 'width 0.5s ease'
                }} />
              </div>
              <div style={{ minWidth: '40px', color: '#cccccc', textAlign: 'right' }}>
                {count}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ���س̶ȷֲ� */}
      <div style={{
        background: '#1a1a1a',
        padding: '30px',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h3 style={{ 
          color: '#00ffff', 
          margin: '0 0 20px 0' 
        }}>
          {String.fromCharCode(0x4E25,0x91CD,0x7A0B,0x5EA6,0x5206,0x5E03)} {/* ���س̶ȷֲ� */}
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '20px'
        }}>
          {statisticsData.defectsBySeverity && Object.entries(statisticsData.defectsBySeverity).map(([severity, count]) => (
            <div key={severity} style={{
              background: '#232323',
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center',
              border: `2px solid ${getSeverityColor(severity)}`
            }}>
              <div style={{ 
                color: getSeverityColor(severity), 
                fontSize: '1.5rem', 
                fontWeight: 'bold' 
              }}>
                {count}
              </div>
              <div style={{ color: '#cccccc', marginTop: '5px' }}>
                {severity}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ��һ��ȱ������ */}
      <div style={{
        background: '#1a1a1a',
        padding: '30px',
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h3 style={{ 
          color: '#00ffff', 
          margin: '0 0 20px 0' 
        }}>
          {String.fromCharCode(0x8FD1,0x4E00,0x5468,0x7F3A,0x9677,0x8D8B,0x52BF)} {/* ��һ��ȱ������ */}
        </h3>
        
        <div style={{
          display: 'flex',
          alignItems: 'end',
          gap: '10px',
          height: '200px',
          padding: '20px 0'
        }}>
          {statisticsData.weeklyTrend && statisticsData.weeklyTrend.map((day, index) => (
            <div key={index} style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{ color: '#cccccc', fontSize: '0.8rem' }}>
                {day.defects}
              </div>
              <div style={{
                width: '100%',
                background: 'linear-gradient(180deg, #00ffff, #0080ff)',
                borderRadius: '3px',
                height: `${(day.defects / 20) * 150}px`,
                minHeight: '5px'
              }} />
              <div style={{ color: '#cccccc', fontSize: '0.7rem', textAlign: 'center' }}>
                {day.date.split('-').slice(1).join('/')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* �¶ȶԱȷ��� */}
      <div style={{
        background: '#1a1a1a',
        padding: '30px',
        borderRadius: '10px'
      }}>
        <h3 style={{ 
          color: '#00ffff', 
          margin: '0 0 20px 0' 
        }}>
          {String.fromCharCode(0x6708,0x5EA6,0x5BF9,0x6BD4,0x5206,0x6790)} {/* �¶ȶԱȷ��� */}
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          {statisticsData.monthlyComparison && statisticsData.monthlyComparison.map((month, index) => (
            <div key={index} style={{
              background: '#232323',
              padding: '20px',
              borderRadius: '10px',
              border: '1px solid #333'
            }}>
              <h4 style={{ color: '#ffffff', margin: '0 0 15px 0', textAlign: 'center' }}>
                {month.month}
              </h4>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}>
                <span style={{ color: '#cccccc' }}>
                  {String.fromCharCode(0x68C0,0x6D4B,0x6B21,0x6570,0x003A)} {/* ������: */}
                </span>
                <span style={{ color: '#00ffff', fontWeight: 'bold' }}>
                  {month.inspections}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}>
                <span style={{ color: '#cccccc' }}>
                  {String.fromCharCode(0x7F3A,0x9677,0x6570,0x91CF,0x003A)} {/* ȱ������: */}
                </span>
                <span style={{ color: '#ff4444', fontWeight: 'bold' }}>
                  {month.defects}
                </span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span style={{ color: '#cccccc' }}>
                  {String.fromCharCode(0x53D1,0x73B0,0x7387,0x003A)} {/* ������: */}
                </span>
                <span style={{ color: '#ffaa00', fontWeight: 'bold' }}>
                  {((month.defects / month.inspections) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;