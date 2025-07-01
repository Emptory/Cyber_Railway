import React, { useState } from 'react';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('security');
  const [dateRange, setDateRange] = useState('last7days');

  const reportTypes = [
    { id: 'security', name: String.fromCharCode(0x5B89,0x5168,0x62A5,0x544A), icon: '' }, // 安全报告
    { id: 'performance', name: String.fromCharCode(0x6027,0x80FD,0x62A5,0x544A), icon: '' }, // 性能报告
    { id: 'maintenance', name: String.fromCharCode(0x7EF4,0x62A4,0x62A5,0x544A), icon: '' }, // 维护报告
    { id: 'traffic', name: String.fromCharCode(0x6D41,0x91CF,0x5206,0x6790), icon: '' }, // 流量分析
    { id: 'incidents', name: String.fromCharCode(0x4E8B,0x6545,0x62A5,0x544A), icon: '' } // 事故报告
  ];

  const securityData = [
    { date: '2024-01-15', threats: 23, blocked: 23, resolved: 23 },
    { date: '2024-01-14', threats: 18, blocked: 17, resolved: 18 },
    { date: '2024-01-13', threats: 31, blocked: 30, resolved: 31 },
    { date: '2024-01-12', threats: 12, blocked: 12, resolved: 12 },
    { date: '2024-01-11', threats: 7, blocked: 7, resolved: 7 }
  ];

  const performanceMetrics = [
    { metric: String.fromCharCode(0x7CFB,0x7EDF,0x6B63,0x5E38,0x65F6,0x95F4), value: '99.8%', trend: 'up' }, // 系统正常时间
    { metric: String.fromCharCode(0x54CD,0x5E94,0x65F6,0x95F4), value: '0.12s', trend: 'down' }, // 响应时间
    { metric: String.fromCharCode(0x6570,0x636E,0x541E,0x5410,0x91CF), value: '2.4 GB/s', trend: 'up' }, // 数据吞吐量
    { metric: String.fromCharCode(0x9519,0x8BEF,0x7387), value: '0.02%', trend: 'down' } // 错误率
  ];

  const recentIncidents = [
    {
      id: 'INC-2024-001',
      date: '2024-01-15 14:32',
      severity: String.fromCharCode(0x9AD8,0x7EA7), // 高级
      type: String.fromCharCode(0x5B89,0x5168,0x7A81,0x7834,0x5C1D,0x8BD5), // 安全突破尝试
      status: String.fromCharCode(0x5DF2,0x89E3,0x51B3), // 已解决
      description: String.fromCharCode(0x9632,0x706B,0x5899,0x963B,0x6B62,0x4E86,0x672A,0x6388,0x6743,0x8BBF,0x95EE,0x5C1D,0x8BD5) // 防火墙阻止了未授权访问尝试
    },
    {
      id: 'INC-2024-002',
      date: '2024-01-14 09:15',
      severity: String.fromCharCode(0x4E2D,0x7EA7), // 中级
      type: String.fromCharCode(0x7CFB,0x7EDF,0x6027,0x80FD), // 系统性能
      status: String.fromCharCode(0x5DF2,0x89E3,0x51B3), // 已解决
      description: String.fromCharCode(0x6570,0x636E,0x5904,0x7406,0x4E2D,0x7684,0x4E34,0x65F6,0x653E,0x7F13) // 数据处理中的临时放缓
    },
    {
      id: 'INC-2024-003',
      date: '2024-01-13 16:45',
      severity: String.fromCharCode(0x4F4E,0x7EA7), // 低级
      type: String.fromCharCode(0x7EF4,0x62A4,0x8B66,0x62A5), // 维护警报
      status: String.fromCharCode(0x5DF2,0x8BA1,0x5212), // 已计划
      description: String.fromCharCode(0x4FE1,0x53F7,0x5854,0x0033,0x7684,0x4F8B,0x884C,0x7EF4,0x62A4,0x5DF2,0x8BA1,0x5212) // 信号塔3的例行维护已计划
    }
  ];

  const generateReport = () => {
    const reportName = reportTypes.find(r => r.id === selectedReport)?.name;
    const dateText = {
      'last7days': String.fromCharCode(0x8FC7,0x53BB,0x0037,0x5929), // 过去7天
      'last30days': String.fromCharCode(0x8FC7,0x53BB,0x0033,0x0030,0x5929), // 过去30天
      'last3months': String.fromCharCode(0x8FC7,0x53BB,0x0033,0x4E2A,0x6708) // 过去3个月
    }[dateRange] || dateRange;
    
    alert(String.fromCharCode(0x6B63,0x5728,0x751F,0x6210) + ` ${reportName} (${dateText})`); // 正在生成
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case String.fromCharCode(0x9AD8,0x7EA7): return '#ff4444'; // 高级
      case String.fromCharCode(0x4E2D,0x7EA7): return '#ffaa00'; // 中级
      case String.fromCharCode(0x4F4E,0x7EA7): return '#00ff00'; // 低级
      default: return '#cccccc';
    }
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? '' : '';
  };

  return (
    <div style={{ fontFamily: '"Noto Sans SC", "Microsoft YaHei", "SimHei", "SimSun", "Arial Unicode MS", Arial, sans-serif', margin: 0, padding: 0, background: '#0a0a0a', color: '#ffffff', minHeight: '100vh' }}>
      {/* 头部 */}
      <section style={{ padding: '40px 20px', background: '#111111', borderBottom: '2px solid #00ffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px 0', color: '#00ffff' }}>
            {String.fromCharCode(0x62A5,0x544A,0x4E0E,0x5206,0x6790)} {/* 报告与分析 */}
          </h1>
          <p style={{ margin: 0, color: '#cccccc' }}>
            {String.fromCharCode(0x94C1,0x8DEF,0x7CFB,0x7EDF,0x6027,0x80FD,0x7684,0x5168,0x9762,0x62A5,0x544A,0x548C,0x5206,0x6790)} {/* 铁路系统性能的全面报告和分析 */}
          </p>
        </div>
      </section>

      {/* Report Controls */}
      <section style={{ padding: '40px 20px', background: '#0a0a0a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#ffffff', fontWeight: 'bold' }}>
                {String.fromCharCode(0x62A5,0x544A,0x7C7B,0x578B)} {/* 报告类型 */}
              </label>
              <select 
                value={selectedReport} 
                onChange={(e) => setSelectedReport(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '5px',
                  color: '#ffffff',
                  fontSize: '1rem'
                }}
              >
                {reportTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#ffffff', fontWeight: 'bold' }}>
                {String.fromCharCode(0x65E5,0x671F,0x8303,0x56F4)} {/* 日期范围 */}
              </label>
              <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '5px',
                  color: '#ffffff',
                  fontSize: '1rem'
                }}
              >
                <option value="last7days">{String.fromCharCode(0x8FC7,0x53BB,0x0037,0x5929)}</option>
                <option value="last30days">{String.fromCharCode(0x8FC7,0x53BB,0x0033,0x0030,0x5929)}</option>
                <option value="last3months">{String.fromCharCode(0x8FC7,0x53BB,0x0033,0x4E2A,0x6708)}</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'end' }}>
              <button 
                onClick={generateReport}
                style={{
                  background: '#00ffff',
                  color: '#000000',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  transition: 'transform 0.3s'
                }}
                onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
              >
                {String.fromCharCode(0x751F,0x6210,0x62A5,0x544A)} {/* 生成报告 */}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Report Content */}
      <section style={{ padding: '0 20px 40px', background: '#0a0a0a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Security Report */}
          {selectedReport === 'security' && (
            <div>
              <h2 style={{ color: '#00ffff', marginBottom: '20px' }}>
                {String.fromCharCode(0x5B89,0x5168,0x6570,0x636E,0x6982,0x89C8)} {/* 安全数据概览 */}
              </h2>
              <div style={{ background: '#1a1a1a', borderRadius: '10px', overflow: 'hidden', border: '1px solid #333' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#2a2a2a' }}>
                      <th style={{ padding: '15px', textAlign: 'left', color: '#00ffff', borderBottom: '1px solid #333' }}>
                        {String.fromCharCode(0x65E5,0x671F)} {/* 日期 */}
                      </th>
                      <th style={{ padding: '15px', textAlign: 'left', color: '#00ffff', borderBottom: '1px solid #333' }}>
                        {String.fromCharCode(0x68C0,0x6D4B,0x5230,0x5A01,0x80C1)} {/* 检测到威胁 */}
                      </th>
                      <th style={{ padding: '15px', textAlign: 'left', color: '#00ffff', borderBottom: '1px solid #333' }}>
                        {String.fromCharCode(0x5DF2,0x963B,0x6B62)} {/* 已阻止 */}
                      </th>
                      <th style={{ padding: '15px', textAlign: 'left', color: '#00ffff', borderBottom: '1px solid #333' }}>
                        {String.fromCharCode(0x5DF2,0x89E3,0x51B3)} {/* 已解决 */}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {securityData.map((row, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #333' }}>
                        <td style={{ padding: '15px', color: '#ffffff' }}>{row.date}</td>
                        <td style={{ padding: '15px', color: '#ffffff' }}>{row.threats}</td>
                        <td style={{ padding: '15px', color: '#00ff00' }}>{row.blocked}</td>
                        <td style={{ padding: '15px', color: '#00ff00' }}>{row.resolved}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Performance Report */}
          {selectedReport === 'performance' && (
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ color: '#00ffff', marginBottom: '20px' }}>
                {String.fromCharCode(0x6027,0x80FD,0x6307,0x6807)} {/* 性能指标 */}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                {performanceMetrics.map((metric, index) => (
                  <div
                    key={index}
                    style={{
                      background: '#1a1a1a',
                      padding: '25px',
                      borderRadius: '10px',
                      border: '1px solid #333',
                      textAlign: 'center'
                    }}
                  >
                    <h3 style={{ color: '#ffffff', marginBottom: '15px' }}>{metric.metric}</h3>
                    <div style={{ fontSize: '2rem', color: '#00ffff', marginBottom: '10px', fontWeight: 'bold' }}>
                      {metric.value}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                      <span style={{ fontSize: '1.2rem' }}>{getTrendIcon(metric.trend)}</span>
                      <span style={{ color: metric.trend === 'up' ? '#00ff00' : '#ff4444' }}>
                        {metric.trend === 'up' ? String.fromCharCode(0x4E0A,0x5347) : String.fromCharCode(0x4E0B,0x964D)} {/* 上升 : 下降 */}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Incidents Report */}
          <div>
            <h2 style={{ color: '#00ffff', marginBottom: '20px' }}>
              {String.fromCharCode(0x6700,0x8FD1,0x4E8B,0x6545)} {/* 最近事故 */}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {recentIncidents.map((incident, index) => (
                <div
                  key={index}
                  style={{
                    background: '#1a1a1a',
                    padding: '20px',
                    borderRadius: '10px',
                    border: '1px solid #333',
                    borderLeft: `4px solid ${getSeverityColor(incident.severity)}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <h3 style={{ color: '#ffffff', margin: '0 0 5px 0' }}>{incident.id}</h3>
                      <p style={{ color: '#cccccc', margin: '0 0 5px 0', fontSize: '0.9rem' }}>{incident.date}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <span style={{
                        background: getSeverityColor(incident.severity),
                        color: '#000000',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        {incident.severity}
                      </span>
                      <span style={{
                        background: '#00ffff',
                        color: '#000000',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        {incident.status}
                      </span>
                    </div>
                  </div>
                  <h4 style={{ color: '#00ffff', margin: '0 0 10px 0' }}>{incident.type}</h4>
                  <p style={{ color: '#ffffff', margin: 0, lineHeight: '1.5' }}>{incident.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reports;
