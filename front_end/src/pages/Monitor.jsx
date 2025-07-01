import React, { useState, useEffect } from 'react';

const Monitor = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStatus, setSystemStatus] = useState(String.fromCharCode(0x6B63,0x5E38,0x8FD0,0x884C)); // 正常运行

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const systemMetrics = [
    {
      title: String.fromCharCode(0x7F51,0x7EDC,0x5B89,0x5168), // 网络安全
      value: "98.7%",
      status: String.fromCharCode(0x826F,0x597D), // 良好
      icon: "",
      color: "#00ff00"
    },
    {
      title: String.fromCharCode(0x7CFB,0x7EDF,0x6027,0x80FD), // 系统性能
      value: "94.2%",
      status: String.fromCharCode(0x826F,0x597D), // 良好
      icon: "",
      color: "#00ff00"
    },
    {
      title: String.fromCharCode(0x5A01,0x80C1,0x68C0,0x6D4B), // 威胁检测
      value: "12",
      status: String.fromCharCode(0x6D3B,0x8DC3), // 活跃
      icon: "",
      color: "#ffff00"
    },
    {
      title: String.fromCharCode(0x6570,0x636E,0x5B8C,0x6574,0x6027), // 数据完整性
      value: "99.9%",
      status: String.fromCharCode(0x4F18,0x79C0), // 优秀
      icon: "",
      color: "#00ff00"
    }
  ];

  const recentAlerts = [
    {
      time: "14:32:15",
      type: String.fromCharCode(0x8B66,0x544A), // 警告
      message: String.fromCharCode(0x5728,0x8F68,0x9053,0x7B2C,0x0037,0x6BB5,0x68C0,0x6D4B,0x5230,0x5F02,0x5E38,0x7F51,0x7EDC,0x6D41,0x91CF), // 在轨道第7段检测到异常网络流量
      severity: String.fromCharCode(0x4E2D,0x7EA7) // 中级
    },
    {
      time: "14:28:42",
      type: String.fromCharCode(0x4FE1,0x606F), // 信息
      message: String.fromCharCode(0x4FE1,0x53F7,0x63A7,0x5236,0x5355,0x5143,0x0033,0x5B9A,0x671F,0x7EF4,0x62A4,0x5B8C,0x6210), // 信号控制单元3定期维护完成
      severity: String.fromCharCode(0x4F4E,0x7EA7) // 低级
    },
    {
      time: "14:25:18",
      type: String.fromCharCode(0x8B66,0x62A5), // 警报
      message: String.fromCharCode(0x9632,0x706B,0x5899,0x963B,0x6B62,0x4E86,0x0031,0x0035,0x6B21,0x672A,0x6388,0x6743,0x8BBF,0x95EE,0x5C1D,0x8BD5), // 防火墙阻止了15次未授权访问尝试
      severity: String.fromCharCode(0x9AD8,0x7EA7) // 高级
    },
    {
      time: "14:22:05",
      type: String.fromCharCode(0x4FE1,0x606F), // 信息
      message: String.fromCharCode(0x7CFB,0x7EDF,0x5907,0x4EFD,0x6210,0x529F,0x5B8C,0x6210), // 系统备份成功完成
      severity: String.fromCharCode(0x4F4E,0x7EA7) // 低级
    }
  ];

  const networkNodes = [
    { id: 1, name: String.fromCharCode(0x4E2D,0x592E,0x63A7,0x5236), status: String.fromCharCode(0x5728,0x7EBF), x: 50, y: 30 }, // 中央控制, 在线
    { id: 2, name: String.fromCharCode(0x8F66,0x7AD9) + " A", status: String.fromCharCode(0x5728,0x7EBF), x: 20, y: 60 }, // 车站A, 在线
    { id: 3, name: String.fromCharCode(0x8F66,0x7AD9) + " B", status: String.fromCharCode(0x5728,0x7EBF), x: 80, y: 60 }, // 车站B, 在线
    { id: 4, name: String.fromCharCode(0x4FE1,0x53F7,0x5854) + " 1", status: String.fromCharCode(0x5728,0x7EBF), x: 35, y: 80 }, // 信号塔1, 在线
    { id: 5, name: String.fromCharCode(0x4FE1,0x53F7,0x5854) + " 2", status: String.fromCharCode(0x7EF4,0x62A4,0x4E2D), x: 65, y: 80 } // 信号塔2, 维护中
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case String.fromCharCode(0x9AD8,0x7EA7): return '#ff4444'; // 高级
      case String.fromCharCode(0x4E2D,0x7EA7): return '#ffaa00'; // 中级
      case String.fromCharCode(0x4F4E,0x7EA7): return '#00ff00'; // 低级
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
        marginBottom: '30px',
        border: '1px solid #333',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ color: '#00ffff', margin: '0 0 10px 0', fontSize: '2rem' }}>
            {String.fromCharCode(0x94C1,0x8DEF,0x7CFB,0x7EDF,0x76D1,0x63A7,0x4E2D,0x5FC3)} {/* 铁路系统监控中心 */}
          </h1>
          <p style={{ margin: 0, color: '#cccccc' }}>
            {String.fromCharCode(0x5B9E,0x65F6,0x72B6,0x6001)}: {systemStatus} {/* 实时状态 */}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.5rem', color: '#00ffff', marginBottom: '5px' }}>
            {currentTime.toLocaleTimeString()}
          </div>
          <div style={{ color: '#cccccc', fontSize: '0.9rem' }}>
            {currentTime.toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* 系统指标网格 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        {systemMetrics.map((metric, index) => (
          <div
            key={index}
            style={{
              background: '#1a1a1a',
              padding: '25px',
              borderRadius: '10px',
              border: '1px solid #333',
              textAlign: 'center',
              transition: 'transform 0.3s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'
            }
          >
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{metric.icon}</div>
            <h3 style={{ color: '#ffffff', margin: '0 0 10px 0' }}>{metric.title}</h3>
            <div style={{ fontSize: '2rem', color: metric.color, marginBottom: '10px', fontWeight: 'bold' }}>
              {metric.value}
            </div>
            <div style={{ 
              padding: '5px 15px', 
              borderRadius: '20px', 
              fontSize: '0.8rem', 
              background: metric.color,
              color: '#000000',
              display: 'inline-block'
            }}>
              {metric.status}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* 最近警报 */}
        <div style={{
          background: '#1a1a1a',
          padding: '25px',
          borderRadius: '10px',
          border: '1px solid #333'
        }}>
          <h2 style={{ color: '#00ffff', marginBottom: '20px' }}>
            {String.fromCharCode(0x6700,0x8FD1,0x8B66,0x62A5)} {/* 最近警报 */}
          </h2>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {recentAlerts.map((alert, index) => (
              <div
                key={index}
                style={{
                  background: '#2a2a2a',
                  padding: '15px',
                  marginBottom: '10px',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${getSeverityColor(alert.severity)}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span style={{ 
                    background: getSeverityColor(alert.severity),
                    color: '#000000',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    {alert.type}
                  </span>
                  <span style={{ color: '#cccccc', fontSize: '0.9rem' }}>{alert.time}</span>
                </div>
                <p style={{ margin: 0, color: '#ffffff', fontSize: '0.95rem' }}>{alert.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 网络拓扑 */}
        <div style={{
          background: '#1a1a1a',
          padding: '25px',
          borderRadius: '10px',
          border: '1px solid #333'
        }}>
          <h2 style={{ color: '#00ffff', marginBottom: '20px' }}>
            {String.fromCharCode(0x7F51,0x7EDC,0x62D3,0x6251)} {/* 网络拓扑 */}
          </h2>
          <div style={{ 
            position: 'relative', 
            height: '300px', 
            background: '#2a2a2a', 
            borderRadius: '8px',
            border: '1px solid #444'
          }}>
            <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
              {/* 连接线 */}
              <line x1="50%" y1="30%" x2="20%" y2="60%" stroke="#00ffff" strokeWidth="2" />
              <line x1="50%" y1="30%" x2="80%" y2="60%" stroke="#00ffff" strokeWidth="2" />
              <line x1="20%" y1="60%" x2="35%" y2="80%" stroke="#00ffff" strokeWidth="2" />
              <line x1="80%" y1="60%" x2="65%" y2="80%" stroke="#ffaa00" strokeWidth="2" strokeDasharray="5,5" />
            </svg>
            
            {networkNodes.map((node, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)',
                  background: node.status === String.fromCharCode(0x5728,0x7EBF) ? '#00ff00' : '#ffaa00', // 在线 : 其他
                  color: '#000000',
                  padding: '8px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  minWidth: '80px',
                  border: '2px solid #ffffff'
                }}
              >
                <div>{node.name}</div>
                <div style={{ fontSize: '0.7rem', marginTop: '2px' }}>{node.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 系统日志 */}
      <div style={{
        background: '#1a1a1a',
        padding: '25px',
        borderRadius: '10px',
        border: '1px solid #333',
        marginTop: '30px'
      }}>
        <h2 style={{ color: '#00ffff', marginBottom: '20px' }}>
          {String.fromCharCode(0x7CFB,0x7EDF,0x65E5,0x5FD7)} {/* 系统日志 */}
        </h2>
        <div style={{
          background: '#000000',
          padding: '20px',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '0.9rem',
          height: '200px',
          overflowY: 'auto',
          color: '#00ff00'
        }}>
          <div>[{currentTime.toLocaleTimeString()}] {String.fromCharCode(0x7CFB,0x7EDF,0x521D,0x59CB,0x5316,0x5B8C,0x6210)}</div>
          <div>[{new Date(currentTime.getTime() - 1000).toLocaleTimeString()}] {String.fromCharCode(0x7F51,0x7EDC,0x8FDE,0x63A5,0x6B63,0x5E38)}</div>
          <div>[{new Date(currentTime.getTime() - 2000).toLocaleTimeString()}] {String.fromCharCode(0x9632,0x706B,0x5899,0x72B6,0x6001,0x6B63,0x5E38)}</div>
          <div>[{new Date(currentTime.getTime() - 3000).toLocaleTimeString()}] {String.fromCharCode(0x6570,0x636E,0x5E93,0x8FDE,0x63A5,0x6210,0x529F)}</div>
          <div>[{new Date(currentTime.getTime() - 4000).toLocaleTimeString()}] {String.fromCharCode(0x7528,0x6237,0x8EAB,0x4EFD,0x9A8C,0x8BC1,0x670D,0x52A1,0x542F,0x52A8)}</div>
        </div>
      </div>
    </div>
  );
};

export default Monitor;
