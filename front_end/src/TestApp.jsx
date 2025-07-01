import React from 'react';

function TestApp() {
  return (
    <div style={{
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      <h1 style={{ color: '#00aeff', fontSize: '2rem', marginBottom: '20px' }}>
        ? Cyber Railway System Test
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#333' }}>
        React is working correctly!
      </p>
      <p style={{ fontSize: '1rem', color: '#666', marginTop: '10px' }}>
        If you see this, the basic React setup is functioning.
      </p>
      <div style={{ marginTop: '30px' }}>
        <h2 style={{ color: '#333', fontSize: '1.5rem' }}>中文测试</h2>
        <p style={{ fontSize: '1.1rem', color: '#555' }}>
          这是中文字符测试 ???
        </p>
        <p style={{ fontSize: '1rem', color: '#777' }}>
          Mixed: Hello 你好 World 世界 123 ?
        </p>
      </div>
    </div>
  );
}

export default TestApp;
