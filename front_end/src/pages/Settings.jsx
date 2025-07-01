import React, { useState } from 'react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('system');
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true,
      severity: 'medium'
    },
    security: {
      twoFactor: true,
      autoLock: 30,
      passwordExpiry: 90,
      sessionTimeout: 60
    },
    system: {
      autoUpdate: true,
      backup: 'daily',
      logRetention: 365,
      monitoring: true
    },
    display: {
      theme: 'dark',
      language: 'zh-cn',
      timezone: 'UTC+8',
      refreshRate: 5
    }
  });

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const saveSettings = () => {
    alert(String.fromCharCode(0x8BBE,0x7F6E,0x4FDD,0x5B58,0x6210,0x529F,0xFF01)); // ���ñ���ɹ���
  };

  const resetSettings = () => {
    const confirmText = String.fromCharCode(0x60A8,0x786E,0x5B9A,0x8981,0x91CD,0x7F6E,0x6240,0x6709,0x8BBE,0x7F6E,0x4E3A,0x9ED8,0x8BA4,0x503C,0x5417,0xFF1F); // ��ȷ��Ҫ������������ΪĬ��ֵ��
    if (confirm(confirmText)) {
      alert(String.fromCharCode(0x8BBE,0x7F6E,0x5DF2,0x91CD,0x7F6E,0x4E3A,0x9ED8,0x8BA4,0x503C,0x3002)); // ����������ΪĬ��ֵ��
    }
  };

  const tabs = [
    { id: 'system', name: String.fromCharCode(0x7CFB,0x7EDF), icon: '' }, // ϵͳ
    { id: 'security', name: String.fromCharCode(0x5B89,0x5168), icon: '' }, // ��ȫ
    { id: 'notifications', name: String.fromCharCode(0x901A,0x77E5), icon: '' }, // ֪ͨ
    { id: 'display', name: String.fromCharCode(0x663E,0x793A), icon: '' } // ��ʾ
  ];

  const renderSwitch = (checked, onChange) => (
    <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '24px' }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ opacity: 0, width: 0, height: 0 }}
      />
      <span style={{
        position: 'absolute',
        cursor: 'pointer',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: checked ? '#00ffff' : '#ccc',
        transition: '0.4s',
        borderRadius: '24px'
      }}>
        <span style={{
          position: 'absolute',
          content: '',
          height: '18px',
          width: '18px',
          left: checked ? '26px' : '3px',
          bottom: '3px',
          background: '#ffffff',
          transition: '0.4s',
          borderRadius: '50%'
        }}></span>
      </span>
    </label>
  );

  return (
    <div style={{ 
      fontFamily: '"Noto Sans SC", "Microsoft YaHei", "SimHei", "SimSun", "Arial Unicode MS", Arial, sans-serif', 
      background: '#0a0a0a', 
      color: '#ffffff', 
      minHeight: '100vh' 
    }}>
      {/* ͷ�� */}
      <section style={{ padding: '40px 20px', background: '#111111', borderBottom: '2px solid #00ffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 10px 0', color: '#00ffff' }}>
            {String.fromCharCode(0x7CFB,0x7EDF,0x8BBE,0x7F6E)} {/* ϵͳ���� */}
          </h1>
          <p style={{ margin: 0, color: '#cccccc' }}>
            {String.fromCharCode(0x914D,0x7F6E,0x548C,0x7BA1,0x7406,0x60A8,0x7684,0x94C1,0x8DEF,0x7F51,0x7EDC,0x5B89,0x5168,0x7CFB,0x7EDF)} {/* ���ú͹���������·���簲ȫϵͳ */}
          </p>
        </div>
      </section>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* ��ǩҳ���� */}
        <div style={{ 
          display: 'flex', 
          marginBottom: '40px', 
          borderBottom: '1px solid #333',
          overflowX: 'auto',
          gap: '20px'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? '#00ffff' : 'transparent',
                color: activeTab === tab.id ? '#000000' : '#ffffff',
                border: 'none',
                padding: '15px 25px',
                borderRadius: '5px 5px 0 0',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                whiteSpace: 'nowrap'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* ϵͳ���� */}
        {activeTab === 'system' && (
          <div>
            <h2 style={{ color: '#00ffff', marginBottom: '30px' }}>
              {String.fromCharCode(0x7CFB,0x7EDF,0x8BBE,0x7F6E)} {/* ϵͳ���� */}
            </h2>
            <div style={{ display: 'grid', gap: '25px' }}>
              <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '10px', border: '1px solid #333' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ color: '#ffffff', margin: '0 0 5px 0' }}>
                      {String.fromCharCode(0x81EA,0x52A8,0x66F4,0x65B0)} {/* �Զ����� */}
                    </h3>
                    <p style={{ color: '#cccccc', margin: 0, fontSize: '0.9rem' }}>
                      {String.fromCharCode(0x542F,0x7528,0x7CFB,0x7EDF,0x81EA,0x52A8,0x66F4,0x65B0,0x529F,0x80FD)} {/* ����ϵͳ�Զ����¹��� */}
                    </p>
                  </div>
                  {renderSwitch(
                    settings.system.autoUpdate,
                    (e) => handleSettingChange('system', 'autoUpdate', e.target.checked)
                  )}
                </div>
              </div>

              <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '10px', border: '1px solid #333' }}>
                <div style={{ marginBottom: '15px' }}>
                  <h3 style={{ color: '#ffffff', margin: '0 0 5px 0' }}>
                    {String.fromCharCode(0x5907,0x4EFD,0x9891,0x7387)} {/* ����Ƶ�� */}
                  </h3>
                  <p style={{ color: '#cccccc', margin: 0, fontSize: '0.9rem' }}>
                    {String.fromCharCode(0x9009,0x62E9,0x7CFB,0x7EDF,0x6570,0x636E,0x5907,0x4EFD,0x9891,0x7387)} {/* ѡ��ϵͳ���ݱ���Ƶ�� */}
                  </p>
                </div>
                <select
                  value={settings.system.backup}
                  onChange={(e) => handleSettingChange('system', 'backup', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#2a2a2a',
                    border: '1px solid #444',
                    borderRadius: '5px',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                >
                  <option value="hourly">{String.fromCharCode(0x6BCF,0x5C0F,0x65F6)}</option>
                  <option value="daily">{String.fromCharCode(0x6BCF,0x5929)}</option>
                  <option value="weekly">{String.fromCharCode(0x6BCF,0x5468)}</option>
                  <option value="monthly">{String.fromCharCode(0x6BCF,0x6708)}</option>
                </select>
              </div>

              <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '10px', border: '1px solid #333' }}>
                <div style={{ marginBottom: '15px' }}>
                  <h3 style={{ color: '#ffffff', margin: '0 0 5px 0' }}>
                    {String.fromCharCode(0x65E5,0x5FD7,0x4FDD,0x7559,0x5929,0x6570)} {/* ��־�������� */}
                  </h3>
                  <p style={{ color: '#cccccc', margin: 0, fontSize: '0.9rem' }}>
                    {String.fromCharCode(0x7CFB,0x7EDF,0x65E5,0x5FD7,0x6587,0x4EF6,0x7684,0x4FDD,0x7559,0x5929,0x6570)} {/* ϵͳ��־�ļ��ı������� */}
                  </p>
                </div>
                <input
                  type="number"
                  value={settings.system.logRetention}
                  onChange={(e) => handleSettingChange('system', 'logRetention', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#2a2a2a',
                    border: '1px solid #444',
                    borderRadius: '5px',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                  min="1"
                  max="3650"
                />
              </div>

              <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '10px', border: '1px solid #333' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ color: '#ffffff', margin: '0 0 5px 0' }}>
                      {String.fromCharCode(0x5B9E,0x65F6,0x76D1,0x63A7)} {/* ʵʱ��� */}
                    </h3>
                    <p style={{ color: '#cccccc', margin: 0, fontSize: '0.9rem' }}>
                      {String.fromCharCode(0x542F,0x7528,0x7CFB,0x7EDF,0x5B9E,0x65F6,0x6027,0x80FD,0x76D1,0x63A7)} {/* ����ϵͳʵʱ���ܼ�� */}
                    </p>
                  </div>
                  {renderSwitch(
                    settings.system.monitoring,
                    (e) => handleSettingChange('system', 'monitoring', e.target.checked)
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ��ȫ���� */}
        {activeTab === 'security' && (
          <div>
            <h2 style={{ color: '#00ffff', marginBottom: '30px' }}>
              {String.fromCharCode(0x5B89,0x5168,0x8BBE,0x7F6E)} {/* ��ȫ���� */}
            </h2>
            <div style={{ display: 'grid', gap: '25px' }}>
              <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '10px', border: '1px solid #333' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ color: '#ffffff', margin: '0 0 5px 0' }}>
                      {String.fromCharCode(0x53CC,0x91CD,0x8EAB,0x4EFD,0x9A8C,0x8BC1)} {/* ˫�������֤ */}
                    </h3>
                    <p style={{ color: '#cccccc', margin: 0, fontSize: '0.9rem' }}>
                      {String.fromCharCode(0x542F,0x7528,0x53CC,0x91CD,0x8EAB,0x4EFD,0x9A8C,0x8BC1,0x589E,0x5F3A,0x8D26,0x6237,0x5B89,0x5168)} {/* ����˫�������֤��ǿ�˻���ȫ */}
                    </p>
                  </div>
                  {renderSwitch(
                    settings.security.twoFactor,
                    (e) => handleSettingChange('security', 'twoFactor', e.target.checked)
                  )}
                </div>
              </div>

              <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '10px', border: '1px solid #333' }}>
                <div style={{ marginBottom: '15px' }}>
                  <h3 style={{ color: '#ffffff', margin: '0 0 5px 0' }}>
                    {String.fromCharCode(0x81EA,0x52A8,0x9501,0x5C4F,0x65F6,0x95F4)} {/* �Զ�����ʱ�� */}
                  </h3>
                  <p style={{ color: '#cccccc', margin: '0 0 15px 0', fontSize: '0.9rem' }}>
                    {String.fromCharCode(0x7CFB,0x7EDF,0x95F2,0x7F6E,0x65F6,0x81EA,0x52A8,0x9501,0x5C4F,0x7684,0x65F6,0x95F4,0xFF08,0x5206,0x949F,0xFF09)} {/* ϵͳ����ʱ�Զ�������ʱ�䣨���ӣ� */}
                  </p>
                </div>
                <input
                  type="number"
                  value={settings.security.autoLock}
                  onChange={(e) => handleSettingChange('security', 'autoLock', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#2a2a2a',
                    border: '1px solid #444',
                    borderRadius: '5px',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                  min="5"
                  max="240"
                />
              </div>

              <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '10px', border: '1px solid #333' }}>
                <div style={{ marginBottom: '15px' }}>
                  <h3 style={{ color: '#ffffff', margin: '0 0 5px 0' }}>
                    {String.fromCharCode(0x5BC6,0x7801,0x8FC7,0x671F,0x5929,0x6570)} {/* ����������� */}
                  </h3>
                  <p style={{ color: '#cccccc', margin: '0 0 15px 0', fontSize: '0.9rem' }}>
                    {String.fromCharCode(0x5BC6,0x7801,0x5FC5,0x987B,0x66F4,0x6539,0x7684,0x5929,0x6570)} {/* ���������ĵ����� */}
                  </p>
                </div>
                <input
                  type="number"
                  value={settings.security.passwordExpiry}
                  onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#2a2a2a',
                    border: '1px solid #444',
                    borderRadius: '5px',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                  min="30"
                  max="365"
                />
              </div>

              <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '10px', border: '1px solid #333' }}>
                <div style={{ marginBottom: '15px' }}>
                  <h3 style={{ color: '#ffffff', margin: '0 0 5px 0' }}>
                    {String.fromCharCode(0x4F1A,0x8BDD,0x8D85,0x65F6,0x65F6,0x95F4)} {/* �Ự��ʱʱ�� */}
                  </h3>
                  <p style={{ color: '#cccccc', margin: '0 0 15px 0', fontSize: '0.9rem' }}>
                    {String.fromCharCode(0x7528,0x6237,0x4F1A,0x8BDD,0x81EA,0x52A8,0x8D85,0x65F6,0x65F6,0x95F4,0xFF08,0x5206,0x949F,0xFF09)} {/* �û��Ự�Զ���ʱʱ�䣨���ӣ� */}
                  </p>
                </div>
                <input
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#2a2a2a',
                    border: '1px solid #444',
                    borderRadius: '5px',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                  min="15"
                  max="480"
                />
              </div>
            </div>
          </div>
        )}

        {/* ֪ͨ���� */}
        {activeTab === 'notifications' && (
          <div>
            <h2 style={{ color: '#00ffff', marginBottom: '30px' }}>
              {String.fromCharCode(0x901A,0x77E5,0x8BBE,0x7F6E)} {/* ֪ͨ���� */}
            </h2>
            <div style={{ display: 'grid', gap: '25px' }}>
              <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '10px', border: '1px solid #333' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ color: '#ffffff', margin: '0 0 5px 0' }}>
                      {String.fromCharCode(0x90AE,0x4EF6,0x901A,0x77E5)} {/* �ʼ�֪ͨ */}
                    </h3>
                    <p style={{ color: '#cccccc', margin: 0, fontSize: '0.9rem' }}>
                      {String.fromCharCode(0x63A5,0x6536,0x7CFB,0x7EDF,0x8B66,0x62A5,0x548C,0x66F4,0x65B0,0x7684,0x90AE,0x4EF6,0x901A,0x77E5)} {/* ����ϵͳ�����͸��µ��ʼ�֪ͨ */}
                    </p>
                  </div>
                  {renderSwitch(
                    settings.notifications.email,
                    (e) => handleSettingChange('notifications', 'email', e.target.checked)
                  )}
                </div>
              </div>

              <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '10px', border: '1px solid #333' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ color: '#ffffff', margin: '0 0 5px 0' }}>
                      {String.fromCharCode(0x77ED,0x4FE1,0x901A,0x77E5)} {/* ����֪ͨ */}
                    </h3>
                    <p style={{ color: '#cccccc', margin: 0, fontSize: '0.9rem' }}>
                      {String.fromCharCode(0x63A5,0x6536,0x7D27,0x6025,0x8B66,0x62A5,0x7684,0x77ED,0x4FE1,0x901A,0x77E5)} {/* ���ս��������Ķ���֪ͨ */}
                    </p>
                  </div>
                  {renderSwitch(
                    settings.notifications.sms,
                    (e) => handleSettingChange('notifications', 'sms', e.target.checked)
                  )}
                </div>
              </div>

              <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '10px', border: '1px solid #333' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ color: '#ffffff', margin: '0 0 5px 0' }}>
                      {String.fromCharCode(0x63A8,0x9001,0x901A,0x77E5)} {/* ����֪ͨ */}
                    </h3>
                    <p style={{ color: '#cccccc', margin: 0, fontSize: '0.9rem' }}>
                      {String.fromCharCode(0x542F,0x7528,0x6D4F,0x89C8,0x5668,0x63A8,0x9001,0x901A,0x77E5)} {/* �������������֪ͨ */}
                    </p>
                  </div>
                  {renderSwitch(
                    settings.notifications.push,
                    (e) => handleSettingChange('notifications', 'push', e.target.checked)
                  )}
                </div>
              </div>

              <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '10px', border: '1px solid #333' }}>
                <div style={{ marginBottom: '15px' }}>
                  <h3 style={{ color: '#ffffff', margin: '0 0 5px 0' }}>
                    {String.fromCharCode(0x901A,0x77E5,0x4E25,0x91CD,0x7B49,0x7EA7)} {/* ֪ͨ���صȼ� */}
                  </h3>
                  <p style={{ color: '#cccccc', margin: '0 0 15px 0', fontSize: '0.9rem' }}>
                    {String.fromCharCode(0x9009,0x62E9,0x63A5,0x6536,0x901A,0x77E5,0x7684,0x6700,0x4F4E,0x4E25,0x91CD,0x7B49,0x7EA7)} {/* ѡ�����֪ͨ��������صȼ� */}
                  </p>
                </div>
                <select
                  value={settings.notifications.severity}
                  onChange={(e) => handleSettingChange('notifications', 'severity', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#2a2a2a',
                    border: '1px solid #444',
                    borderRadius: '5px',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                >
                  <option value="low">{String.fromCharCode(0x4F4E,0x7EA7)}</option>
                  <option value="medium">{String.fromCharCode(0x4E2D,0x7EA7)}</option>
                  <option value="high">{String.fromCharCode(0x9AD8,0x7EA7)}</option>
                  <option value="critical">{String.fromCharCode(0x5173,0x952E)}</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ��ʾ���� */}
        {activeTab === 'display' && (
          <div>
            <h2 style={{ color: '#00ffff', marginBottom: '30px' }}>
              {String.fromCharCode(0x663E,0x793A,0x8BBE,0x7F6E)} {/* ��ʾ���� */}
            </h2>
            <div style={{ display: 'grid', gap: '25px' }}>
              <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '10px', border: '1px solid #333' }}>
                <div style={{ marginBottom: '15px' }}>
                  <h3 style={{ color: '#ffffff', margin: '0 0 5px 0' }}>
                    {String.fromCharCode(0x754C,0x9762,0x4E3B,0x9898)} {/* �������� */}
                  </h3>
                  <p style={{ color: '#cccccc', margin: '0 0 15px 0', fontSize: '0.9rem' }}>
                    {String.fromCharCode(0x9009,0x62E9,0x754C,0x9762,0x7684,0x989C,0x8272,0x4E3B,0x9898)} {/* ѡ��������ɫ���� */}
                  </p>
                </div>
                <select
                  value={settings.display.theme}
                  onChange={(e) => handleSettingChange('display', 'theme', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#2a2a2a',
                    border: '1px solid #444',
                    borderRadius: '5px',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                >
                  <option value="dark">{String.fromCharCode(0x6697,0x8272,0x4E3B,0x9898)}</option>
                  <option value="light">{String.fromCharCode(0x4EAE,0x8272,0x4E3B,0x9898)}</option>
                  <option value="auto">{String.fromCharCode(0x81EA,0x52A8)}</option>
                </select>
              </div>

              <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '10px', border: '1px solid #333' }}>
                <div style={{ marginBottom: '15px' }}>
                  <h3 style={{ color: '#ffffff', margin: '0 0 5px 0' }}>
                    {String.fromCharCode(0x8BED,0x8A00)} {/* ���� */}
                  </h3>
                  <p style={{ color: '#cccccc', margin: '0 0 15px 0', fontSize: '0.9rem' }}>
                    {String.fromCharCode(0x9009,0x62E9,0x7CFB,0x7EDF,0x754C,0x9762,0x8BED,0x8A00)} {/* ѡ��ϵͳ�������� */}
                  </p>
                </div>
                <select
                  value={settings.display.language}
                  onChange={(e) => handleSettingChange('display', 'language', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#2a2a2a',
                    border: '1px solid #444',
                    borderRadius: '5px',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                >
                  <option value="zh-cn">{String.fromCharCode(0x4E2D,0x6587,0xFF08,0x7B80,0x4F53,0xFF09)}</option>
                  <option value="zh-tw">{String.fromCharCode(0x4E2D,0x6587,0xFF08,0x7E41,0x9AD4,0xFF09)}</option>
                  <option value="en">{String.fromCharCode(0x82F1,0x8BED)}</option>
                  <option value="ja">{String.fromCharCode(0x65E5,0x672C,0x8A9E)}</option>
                </select>
              </div>

              <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '10px', border: '1px solid #333' }}>
                <div style={{ marginBottom: '15px' }}>
                  <h3 style={{ color: '#ffffff', margin: '0 0 5px 0' }}>
                    {String.fromCharCode(0x65F6,0x533A)} {/* ʱ�� */}
                  </h3>
                  <p style={{ color: '#cccccc', margin: '0 0 15px 0', fontSize: '0.9rem' }}>
                    {String.fromCharCode(0x8BBE,0x7F6E,0x7CFB,0x7EDF,0x663E,0x793A,0x7684,0x65F6,0x533A)} {/* ����ϵͳ��ʾ��ʱ�� */}
                  </p>
                </div>
                <select
                  value={settings.display.timezone}
                  onChange={(e) => handleSettingChange('display', 'timezone', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#2a2a2a',
                    border: '1px solid #444',
                    borderRadius: '5px',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                >
                  <option value="UTC+8">{String.fromCharCode(0x5317,0x4EAC,0x65F6,0x95F4)} (UTC+8)</option>
                  <option value="UTC">{String.fromCharCode(0x534F,0x8C03,0x4E16,0x754C,0x65F6)} (UTC)</option>
                  <option value="UTC-5">{String.fromCharCode(0x4E1C,0x90E8,0x65F6,0x95F4)} (UTC-5)</option>
                  <option value="UTC-8">{String.fromCharCode(0x592A,0x5E73,0x6D0B,0x65F6,0x95F4)} (UTC-8)</option>
                </select>
              </div>

              <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '10px', border: '1px solid #333' }}>
                <div style={{ marginBottom: '15px' }}>
                  <h3 style={{ color: '#ffffff', margin: '0 0 5px 0' }}>
                    {String.fromCharCode(0x5237,0x65B0,0x7387)} {/* ˢ���� */}
                  </h3>
                  <p style={{ color: '#cccccc', margin: '0 0 15px 0', fontSize: '0.9rem' }}>
                    {String.fromCharCode(0x6570,0x636E,0x81EA,0x52A8,0x5237,0x65B0,0x95F4,0x9694,0xFF08,0x79D2,0xFF09)} {/* �����Զ�ˢ�¼�����룩 */}
                  </p>
                </div>
                <input
                  type="number"
                  value={settings.display.refreshRate}
                  onChange={(e) => handleSettingChange('display', 'refreshRate', parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#2a2a2a',
                    border: '1px solid #444',
                    borderRadius: '5px',
                    color: '#ffffff',
                    fontSize: '1rem'
                  }}
                  min="1"
                  max="60"
                />
              </div>
            </div>
          </div>
        )}

        {/* ������ť */}
        <div style={{ 
          marginTop: '50px', 
          padding: '30px 0', 
          borderTop: '1px solid #333',
          display: 'flex', 
          gap: '20px', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={saveSettings}
            style={{
              background: '#00ffff',
              color: '#000000',
              border: 'none',
              padding: '15px 40px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              transition: 'transform 0.3s'
            }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          >
            {String.fromCharCode(0x4FDD,0x5B58,0x8BBE,0x7F6E)} {/* �������� */}
          </button>
          
          <button
            onClick={resetSettings}
            style={{
              background: '#ff4444',
              color: '#ffffff',
              border: 'none',
              padding: '15px 40px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              transition: 'transform 0.3s'
            }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          >
            {String.fromCharCode(0x91CD,0x7F6E,0x8BBE,0x7F6E)} {/* �������� */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
