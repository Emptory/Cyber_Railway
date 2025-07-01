import React, { useState } from 'react';

const ChineseTestFixed = () => {
  const [inputValue, setInputValue] = useState('');
  
  // 使用Unicode编码生成欢迎文字
  const welcomeText = String.fromCharCode(0x6B22, 0x8FCE, 0x4F7F, 0x7528, 0x4E2D, 0x6587, 0x6D4B, 0x8BD5, 0x9875, 0x9762); // "欢迎使用中文测试页面"
  const [displayText, setDisplayText] = useState(welcomeText);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    setDisplayText(inputValue);
  };

  const testChinese = () => {
    const chineseText = String.fromCharCode(0x4F60, 0x597D, 0x4E16, 0x754C) + ' ' + 
                       String.fromCharCode(0x4E2D, 0x6587, 0x6D4B, 0x8BD5) + ' ' +
                       String.fromCharCode(0x667A, 0x6167, 0x94C1, 0x8DEF, 0x7CFB, 0x7EDF); // "你好世界 中文测试 智慧铁路系统"
    setDisplayText(chineseText);
  };

  const testNumbers = () => {
    const numbersText = String.fromCharCode(0x6570, 0x5B57, 0x6D4B, 0x8BD5) + ': 0123456789 ' + 
                        String.fromCharCode(0x4E2D, 0x6587, 0x6570, 0x5B57) + ': ' +
                        String.fromCharCode(0x96F6, 0x4E00, 0x4E8C, 0x4E09, 0x56DB, 0x4E94, 0x516D, 0x4E03, 0x516B, 0x4E5D); // "数字测试: 0123456789 中文数字: 零一二三四五六七八九"
    setDisplayText(numbersText);
  };

  const testMixed = () => {
    const mixedText = 'Hello ' + String.fromCharCode(0x4F60, 0x597D) + ' World ' + 
                      String.fromCharCode(0x4E16, 0x754C) + ' Railway ' + 
                      String.fromCharCode(0x94C1, 0x8DEF) + ' System ' +
                      String.fromCharCode(0x7CFB, 0x7EDF); // "Hello 你好 World 世界 Railway 铁路 System 系统"
    setDisplayText(mixedText);
  };

  const fontStyle = {
    fontFamily: '"Noto Sans SC", "Microsoft YaHei", "SimHei", "SimSun", "Arial Unicode MS", Arial, sans-serif'
  };

  // 生成页面标题
  const pageTitle = String.fromCharCode(0x4E2D, 0x6587, 0x5B57, 0x7B26, 0x6D4B, 0x8BD5, 0x9875, 0x9762); // "中文字符测试页面"
  const testChineseBtn = String.fromCharCode(0x6D4B, 0x8BD5, 0x4E2D, 0x6587); // "测试中文"
  const testNumbersBtn = String.fromCharCode(0x6D4B, 0x8BD5, 0x6570, 0x5B57); // "测试数字"
  const testMixedBtn = String.fromCharCode(0x6D4B, 0x8BD5, 0x6DF7, 0x5408, 0x6587, 0x672C); // "测试混合文本"
  const inputLabel = String.fromCharCode(0x8F93, 0x5165, 0x6D4B, 0x8BD5) + ':'; // "输入测试:"
  const inputPlaceholder = String.fromCharCode(0x8BF7, 0x8F93, 0x5165, 0x4E2D, 0x6587) + '、' + 
                          String.fromCharCode(0x82F1, 0x6587) + '或' + 
                          String.fromCharCode(0x6570, 0x5B57) + '...'; // "请输入中文、英文或数字..."
  const updateBtn = String.fromCharCode(0x66F4, 0x65B0, 0x663E, 0x793A); // "更新显示"
  const resultLabel = String.fromCharCode(0x663E, 0x793A, 0x7ED3, 0x679C) + ':'; // "显示结果:"
  const exampleLabel = String.fromCharCode(0x5B57, 0x4F53, 0x6D4B, 0x8BD5, 0x793A, 0x4F8B) + ':'; // "字体测试示例:"
  const systemInfoLabel = String.fromCharCode(0x7CFB, 0x7EDF, 0x4FE1, 0x606F) + ':'; // "系统信息:"

  return (
    <div style={{ 
      ...fontStyle,
      padding: '40px', 
      maxWidth: '800px', 
      margin: '0 auto',
      background: '#1a1a1a',
      color: '#ffffff',
      borderRadius: '10px',
      marginTop: '40px'
    }}>
      <h1 style={{ 
        ...fontStyle,
        color: '#00ffff', 
        textAlign: 'center', 
        marginBottom: '30px' 
      }}>
        {pageTitle}
      </h1>
      
      <div style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={testChinese} style={{ ...fontStyle, background: '#00ffff', color: '#000000', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          {testChineseBtn}
        </button>
        <button onClick={testNumbers} style={{ ...fontStyle, background: '#00ff00', color: '#000000', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          {testNumbersBtn}
        </button>
        <button onClick={testMixed} style={{ ...fontStyle, background: '#ffaa00', color: '#000000', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          {testMixedBtn}
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ ...fontStyle, color: '#00ffff', marginBottom: '15px' }}>{inputLabel}</h3>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={inputPlaceholder}
          style={{
            ...fontStyle,
            width: '100%',
            padding: '12px',
            fontSize: '1rem',
            border: '1px solid #333',
            borderRadius: '5px',
            background: '#2a2a2a',
            color: '#ffffff',
            marginBottom: '10px'
          }}
        />
        <button onClick={handleSubmit} style={{ ...fontStyle, background: '#00ffff', color: '#000000', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          {updateBtn}
        </button>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ ...fontStyle, color: '#00ffff', marginBottom: '15px' }}>{resultLabel}</h3>
        <div style={{
          ...fontStyle,
          background: '#2a2a2a',
          padding: '20px',
          borderRadius: '5px',
          border: '1px solid #333',
          minHeight: '60px',
          fontSize: '1.5rem',
          textAlign: 'center'
        }}>
          {displayText}
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ ...fontStyle, color: '#00ffff', marginBottom: '15px' }}>{exampleLabel}</h3>
        <div style={{
          ...fontStyle,
          background: '#2a2a2a',
          padding: '20px',
          borderRadius: '5px',
          border: '1px solid #333'
        }}>
          <div style={{ marginBottom: '10px', fontSize: '1.2rem' }}>
            <strong>{String.fromCharCode(0x7B80, 0x4F53, 0x4E2D, 0x6587)}:</strong>{String.fromCharCode(0x4F60, 0x597D, 0x4E16, 0x754C)} {String.fromCharCode(0x4E2D, 0x6587, 0x6D4B, 0x8BD5)} {String.fromCharCode(0x667A, 0x6167, 0x94C1, 0x8DEF, 0x7CFB, 0x7EDF)}
          </div>
          <div style={{ marginBottom: '10px', fontSize: '1.2rem' }}>
            <strong>{String.fromCharCode(0x7E41, 0x4F53, 0x4E2D, 0x6587)}:</strong>{String.fromCharCode(0x4F60, 0x597D, 0x4E16, 0x754C)} {String.fromCharCode(0x667A, 0x6167, 0x9435, 0x8DEF, 0x7CFB, 0x7D71)}
          </div>
          <div style={{ marginBottom: '10px', fontSize: '1.2rem' }}>
            <strong>{String.fromCharCode(0x6570, 0x5B57)}:</strong>1234567890
          </div>
          <div style={{ marginBottom: '10px', fontSize: '1.2rem' }}>
            <strong>{String.fromCharCode(0x82F1, 0x6587)}:</strong>Hello World ABC abc
          </div>
          <div style={{ fontSize: '1.2rem' }}>
            <strong>{String.fromCharCode(0x6DF7, 0x5408, 0x6587, 0x672C)}:</strong>Hello {String.fromCharCode(0x4F60, 0x597D)} 123 World {String.fromCharCode(0x4E16, 0x754C)}
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ ...fontStyle, color: '#00ffff', marginBottom: '15px' }}>{systemInfoLabel}</h3>
        <ul style={{ ...fontStyle, color: '#cccccc', lineHeight: '1.6' }}>
          <li>{String.fromCharCode(0x9875, 0x9762, 0x7F16, 0x7801)}:UTF-8</li>
          <li>{String.fromCharCode(0x4E3B, 0x8981, 0x5B57, 0x4F53)}:Noto Sans SC (Google Fonts)</li>
          <li>{String.fromCharCode(0x5907, 0x7528, 0x5B57, 0x4F53)}:Microsoft YaHei, SimHei, SimSun</li>
          <li>Unicode {String.fromCharCode(0x652F, 0x6301)}:{String.fromCharCode(0x5B8C, 0x6574, 0x652F, 0x6301)}</li>
          <li>{String.fromCharCode(0x6D4F, 0x89C8, 0x5668, 0x652F, 0x6301)}:{String.fromCharCode(0x73B0, 0x4EE3, 0x6D4F, 0x89C8, 0x5668, 0x5B8C, 0x5168, 0x652F, 0x6301)}</li>
          <li>React {String.fromCharCode(0x7248, 0x672C)}:{String.fromCharCode(0x6700, 0x65B0, 0x7248, 0x672C)}，{String.fromCharCode(0x652F, 0x6301, 0x6240, 0x6709)} Unicode {String.fromCharCode(0x5B57, 0x7B26)}</li>
        </ul>
      </div>
    </div>
  );
};

export default ChineseTestFixed;
