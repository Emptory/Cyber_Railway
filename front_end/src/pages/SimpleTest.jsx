import React, { useState } from 'react';

const SimpleTest = () => {
  const [inputValue, setInputValue] = useState('');
  const [displayText, setDisplayText] = useState(String.fromCharCode(0x6B22,0x8FCE,0x4F7F,0x7528,0x6D4B,0x8BD5,0x9875,0x9762)); // 欢迎使用测试页面

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    setDisplayText(inputValue);
  };

  const testEnglish = () => {
    setDisplayText(String.fromCharCode(0x4F60,0x597D,0x4E16,0x754C) + ' - ' + String.fromCharCode(0x82F1,0x8BED,0x6D4B,0x8BD5)); // 你好世界 - 英语测试
  };

  const testNumbers = () => {
    setDisplayText(String.fromCharCode(0x6570,0x5B57,0x6D4B,0x8BD5) + ': 1234567890'); // 数字测试: 1234567890
  };

  const testChineseDirect = () => {
    // 使用Unicode编码动态生成中文，避免源文件编码问题
    const chinese = String.fromCharCode(0x4F60, 0x597D, 0x4E16, 0x754C); // "你好世界"
    setDisplayText(chinese);
  };

  const testChinese2 = () => {
    // 测试更多中文字符
    const chinese = String.fromCharCode(0x4E2D, 0x6587, 0x6D4B, 0x8BD5); // "中文测试"
    setDisplayText(chinese);
  };

  const testChineseRailway = () => {
    // 测试铁路相关中文
    const chinese = String.fromCharCode(0x94C1, 0x8DEF, 0x7CFB, 0x7EDF); // "铁路系统"
    setDisplayText(chinese);
  };

  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '800px', 
      margin: '0 auto',
      background: '#1a1a1a',
      color: '#ffffff',
      borderRadius: '10px',
      marginTop: '40px',
      fontFamily: '"Noto Sans SC", "Microsoft YaHei", "SimHei", sans-serif'
    }}>
      <h1 style={{ 
        color: '#00ffff', 
        textAlign: 'center', 
        marginBottom: '30px' 
      }}>
        {String.fromCharCode(0x7B80,0x5355,0x5B57,0x7B26,0x6D4B,0x8BD5,0x9875,0x9762)} {/* 简单字符测试页面 */}
      </h1>
      
      <div style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={testEnglish} style={{ background: '#00ffff', color: '#000000', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          {String.fromCharCode(0x6D4B,0x8BD5,0x82F1,0x6587)} {/* 测试英文 */}
        </button>
        <button onClick={testNumbers} style={{ background: '#00ff00', color: '#000000', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          {String.fromCharCode(0x6D4B,0x8BD5,0x6570,0x5B57)} {/* 测试数字 */}
        </button>
        <button onClick={testChineseDirect} style={{ background: '#ff6600', color: '#000000', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          {String.fromCharCode(0x4F60,0x597D,0x4E16,0x754C)} {/* 你好世界 */}
        </button>
        <button onClick={testChinese2} style={{ background: '#ff3366', color: '#000000', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          {String.fromCharCode(0x4E2D,0x6587,0x6D4B,0x8BD5)} {/* 中文测试 */}
        </button>
        <button onClick={testChineseRailway} style={{ background: '#9966ff', color: '#000000', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          {String.fromCharCode(0x94C1,0x8DEF,0x7CFB,0x7EDF)} {/* 铁路系统 */}
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#00ffff', marginBottom: '15px' }}>
          {String.fromCharCode(0x8F93,0x5165,0x6D4B,0x8BD5) + ':'} {/* 输入测试: */}
        </h3>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={String.fromCharCode(0x8BF7,0x8F93,0x5165,0x4EFB,0x4F55,0x5185,0x5BB9) + '...'} // 请输入任何内容...
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '1rem',
            border: '1px solid #333',
            borderRadius: '5px',
            background: '#2a2a2a',
            color: '#ffffff',
            marginBottom: '10px',
            fontFamily: '"Noto Sans SC", "Microsoft YaHei", "SimHei", sans-serif'
          }}
        />
        <button onClick={handleSubmit} style={{ background: '#00ffff', color: '#000000', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          {String.fromCharCode(0x66F4,0x65B0,0x663E,0x793A)} {/* 更新显示 */}
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#00ffff', marginBottom: '15px' }}>
          {String.fromCharCode(0x663E,0x793A,0x7ED3,0x679C) + ':'} {/* 显示结果: */}
        </h3>
        <div style={{
          background: '#2a2a2a',
          padding: '20px',
          borderRadius: '5px',
          border: '1px solid #333',
          minHeight: '60px',
          fontSize: '1.5rem',
          textAlign: 'center',
          fontFamily: '"Noto Sans SC", "Microsoft YaHei", "SimHei", sans-serif'
        }}>
          {displayText}
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: '#00ffff', marginBottom: '15px' }}>
          {String.fromCharCode(0x5B57,0x4F53,0x6D4B,0x8BD5,0x793A,0x4F8B) + ':'} {/* 字体测试示例: */}
        </h3>
        <div style={{
          background: '#2a2a2a',
          padding: '20px',
          borderRadius: '5px',
          border: '1px solid #333'
        }}>
          <div style={{ marginBottom: '10px', fontSize: '1.2rem' }}>
            <strong>{String.fromCharCode(0x82F1,0x6587)}:</strong> Hello World ABC abc
          </div>
          <div style={{ marginBottom: '10px', fontSize: '1.2rem' }}>
            <strong>{String.fromCharCode(0x6570,0x5B57)}:</strong> 1234567890
          </div>
          <div style={{ fontSize: '1.2rem' }}>
            <strong>{String.fromCharCode(0x6DF7,0x5408,0x6587,0x672C)}:</strong> Hello {String.fromCharCode(0x4F60,0x597D)} 123 World {String.fromCharCode(0x4E16,0x754C)}
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ color: '#00ffff', marginBottom: '15px' }}>
          {String.fromCharCode(0x7CFB,0x7EDF,0x4FE1,0x606F) + ':'} {/* 系统信息: */}
        </h3>
        <ul style={{ color: '#cccccc', lineHeight: '1.6' }}>
          <li>{String.fromCharCode(0x9875,0x9762,0x7F16,0x7801)}: UTF-8</li>
          <li>{String.fromCharCode(0x4E3B,0x8981,0x5B57,0x4F53)}: Noto Sans SC</li>
          <li>{String.fromCharCode(0x5907,0x7528,0x5B57,0x4F53)}: Microsoft YaHei, SimHei, sans-serif</li>
          <li>Unicode {String.fromCharCode(0x652F,0x6301)}: {String.fromCharCode(0x6D4B,0x8BD5,0x4E2D)}</li>
          <li>{String.fromCharCode(0x6D4F,0x89C8,0x5668,0x652F,0x6301)}: {String.fromCharCode(0x73B0,0x4EE3,0x6D4F,0x89C8,0x5668)}</li>
          <li>React {String.fromCharCode(0x7248,0x672C)}: {String.fromCharCode(0x6700,0x65B0,0x7248,0x672C)}，{String.fromCharCode(0x652F,0x6301,0x6240,0x6709)} Unicode {String.fromCharCode(0x5B57,0x7B26)}</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleTest;
