import React, { useState, useEffect } from 'react';

const Operation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Chinese slide content
  const slides = [
    {
      image: "/images/pexels-tuurt-179153.jpg",
      title: String.fromCharCode(0x667A,0x80FD,0x94C1,0x8DEF,0x63A2,0x4F24), // 智能铁路探伤
      subtitle: String.fromCharCode(0x73B0,0x4EE3,0x94C1,0x8DEF,0x7F51,0x7EDC,0x7684,0x9AD8,0x6548,0x7EF4,0x62A4,0x7CFB,0x7EDF) // 现代铁路网络的高效维护系统
    },
    {
      image: "/images/pexels-photospublic-1181202.jpg",
      title: String.fromCharCode(0x8F68,0x9053,0x4F24,0x60C5,0x7F51,0x7EDC), // 轨道伤情网络
      subtitle: String.fromCharCode(0x94C1,0x9053,0x7EF4,0x62A4,0x7684,0x9AD8,0x6548,0x89E3,0x51B3,0x65B9,0x6848) // 铁道维护的高效解决方案
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Manual navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Chinese service content
  const services = [
    {
      icon: '',
      title: String.fromCharCode(0x8F68,0x9053,0x63A2,0x4F24,0x68C0,0x6D4B), // 轨道探伤检测
      description: String.fromCharCode(0x9AD8,0x7CBE,0x5EA6,0x8D85,0x58F0,0x6CE2,0x3001,0x6DA1,0x6D41,0x3001,0x78C1,0x7C89,0x63A2,0x4F24,0x6280,0x672F,0xFF0C,0x5168,0x9762,0x68C0,0x6D4B,0x8F68,0x9053,0x5185,0x90E8,0x53CA,0x8868,0x9762,0x7F3A,0x9677) // 高精度超声波、涡流、磁粉探伤技术，全面检测轨道内部及表面缺陷
    },
    {
      icon: '',
      title: String.fromCharCode(0x591A,0x8F68,0x5236,0x517C,0x5BB9), // 多轨制兼容
      description: String.fromCharCode(0x9002,0x7528,0x4E8E,0x9AD8,0x94C1,0x3001,0x52A8,0x8F66,0x3001,0x666E,0x901A,0x94C1,0x8DEF,0x3001,0x8F7B,0x8F68,0x3001,0x5730,0x94C1,0x7B49,0x5404,0x7C7B,0x8F68,0x9053,0x7CFB,0x7EDF) // 适用于高铁、动车、普通铁路、轻轨、地铁等各类轨道系统
    },
    {
      icon: '',
      title: String.fromCharCode(0x667A,0x80FD,0x6570,0x636E,0x5206,0x6790), // 智能数据分析
      description: String.fromCharCode(0x0041,0x0049,0x7B97,0x6CD5,0x81EA,0x52A8,0x8BC6,0x522B,0x4F24,0x635F,0x7C7B,0x578B,0xFF0C,0x751F,0x6210,0x8BE6,0x7EC6,0x68C0,0x6D4B,0x62A5,0x544A,0x548C,0x7EF4,0x62A4,0x5EFA,0x8BAE) // AI算法自动识别伤损类型，生成详细检测报告和维护建议
    },
    {
      icon: '',
      title: String.fromCharCode(0x5B9E,0x65F6,0x76D1,0x6D4B,0x9884,0x8B66), // 实时监测预警
      description: String.fromCharCode(0x0032,0x0034,0x5C0F,0x65F6,0x8FDE,0x7EED,0x76D1,0x6D4B,0xFF0C,0x53CA,0x65F6,0x53D1,0x73B0,0x5B89,0x5168,0x9690,0x60A3,0xFF0C,0x4FDD,0x969C,0x884C,0x8F66,0x5B89,0x5168) // 24小时连续监测，及时发现安全隐患，保障行车安全
    }
  ];

  // Chinese system components
  const systemComponents = [
    {
      title: String.fromCharCode(0x8D85,0x58F0,0x6CE2,0x63A2,0x4F24,0x6A21,0x5757), // 超声波探伤模块
      description: String.fromCharCode(0x9AD8,0x9891,0x8D85,0x58F0,0x6CE2,0x68C0,0x6D4B,0x8F68,0x9053,0x5185,0x90E8,0x88C2,0x7EB9,0x3001,0x6C14,0x6CE1,0x7B49,0x7F3A,0x9677), // 高频超声波检测轨道内部裂纹、气泡等缺陷
      status: String.fromCharCode(0x6B63,0x5E38), // 正常
      icon: ''
    },
    {
      title: String.fromCharCode(0x6DA1,0x6D41,0x68C0,0x6D4B,0x7CFB,0x7EDF), // 涡流检测系统
      description: String.fromCharCode(0x7535,0x78C1,0x611F,0x5E94,0x6280,0x672F,0x68C0,0x6D4B,0x8F68,0x9053,0x8868,0x9762,0x88C2,0x7EB9,0x548C,0x6750,0x8D28,0x53D8,0x5316), // 电磁感应技术检测轨道表面裂纹和材质变化
      status: String.fromCharCode(0x6B63,0x5E38), // 正常
      icon: ''
    },
    {
      title: String.fromCharCode(0x78C1,0x7C89,0x63A2,0x4F24,0x88C5,0x7F6E), // 磁粉探伤装置
      description: String.fromCharCode(0x78C1,0x5316,0x68C0,0x6D4B,0x6280,0x672F,0x53D1,0x73B0,0x8F68,0x9053,0x8868,0x9762,0x53CA,0x8FD1,0x8868,0x9762,0x7F3A,0x9677), // 磁化检测技术发现轨道表面及近表面缺陷
      status: String.fromCharCode(0x6B63,0x5E38), // 正常
      icon: ''
    },
    {
      title: String.fromCharCode(0x6570,0x636E,0x5904,0x7406,0x4E2D,0x5FC3), // 数据处理中心
      description: String.fromCharCode(0x96C6,0x6210,0x0041,0x0049,0x7B97,0x6CD5,0x7684,0x7F3A,0x9677,0x8BC6,0x522B,0x4E0E,0x5206,0x6790,0x7CFB,0x7EDF), // 集成AI算法的缺陷识别与分析系统
      status: String.fromCharCode(0x8FD0,0x884C,0x4E2D), // 运行中
      icon: ''
    },
    {
      title: String.fromCharCode(0x79FB,0x52A8,0x68C0,0x6D4B,0x5E73,0x53F0), // 移动检测平台
      description: String.fromCharCode(0x81EA,0x9002,0x5E94,0x8F68,0x9053,0x5BBD,0x5EA6,0x7684,0x667A,0x80FD,0x68C0,0x6D4B,0x8F66,0x8F7D,0x7CFB,0x7EDF), // 自适应轨道宽度的智能检测车载系统
      status: String.fromCharCode(0x5F85,0x673A), // 待机
      icon: ''
    }
  ];

  // 合作伙伴
  const partners = [
    { name: String.fromCharCode(0x4E2D,0x56FD,0x94C1,0x8DEF,0x603B,0x516C,0x53F8), logo: '' }, // 中国铁路总公司
    { name: String.fromCharCode(0x5730,0x94C1,0x8FD0,0x8425,0x96C6,0x56E2), logo: '' }, // 地铁运营集团
    { name: String.fromCharCode(0x63A2,0x4F24,0x8BBE,0x5907,0x5236,0x9020), logo: '' }, // 探伤设备制造
    { name: String.fromCharCode(0x8F68,0x9053,0x68C0,0x6D4B,0x670D,0x52A1), logo: '' } // 轨道检测服务
  ];

  return (
    <div style={{ 
      fontFamily: '"Noto Sans SC", "Microsoft YaHei", "SimHei", "SimSun", "Arial Unicode MS", Arial, sans-serif', 
      margin: 0, 
      padding: 0, 
      background: '#0a0a0a', 
      color: '#ffffff' 
    }}>
      {/* 幻灯片 */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        {slides.map((slide, index) => (
          <div
            key={index}
            style={{
              display: index === currentSlide ? 'block' : 'none',
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0
            }}
          >
            <img src={slide.image} alt="slide" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
            <div style={{ position: 'absolute', top: '30%', left: '10%', color: '#00ffff', zIndex: 2 }}>
              <h1 style={{ fontSize: '3rem', margin: 0 }}>{slide.title}</h1>
              <p style={{ fontSize: '1.5rem', marginTop: '20px' }}>{slide.subtitle}</p>
            </div>
          </div>
        ))}
        
        {/* 左箭头 */}
        <button
          onClick={prevSlide}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0, 0, 0, 0.5)',
            border: 'none',
            color: '#ffffff',
            fontSize: '24px',
            padding: '15px 20px',
            cursor: 'pointer',
            borderRadius: '5px',
            zIndex: 3,
            transition: 'background 0.3s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0, 255, 255, 0.7)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)'}
        >
          &#8249;
        </button>
        
        {/* 右箭头 */}
        <button
          onClick={nextSlide}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0, 0, 0, 0.5)',
            border: 'none',
            color: '#ffffff',
            fontSize: '24px',
            padding: '15px 20px',
            cursor: 'pointer',
            borderRadius: '5px',
            zIndex: 3,
            transition: 'background 0.3s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0, 255, 255, 0.7)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)'}
        >
          &#8250;
        </button>
        
        {/* 指示点 */}
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
          zIndex: 3
        }}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: '2px solid #ffffff',
                background: index === currentSlide ? '#00ffff' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>
      </section>

      {/* 服务 */}
      <section style={{ padding: '60px 20px', background: '#111111' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '40px', color: '#00ffff' }}>
            {String.fromCharCode(0x670D,0x52A1,0x4F18,0x52BF)} {/* 服务优势 */}
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'center' }}>
            {services.map((service, index) => (
              <div
                key={index}
                style={{
                  background: '#1a1a1a',
                  padding: '30px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  border: '1px solid #333',
                  minWidth: '250px',
                  maxWidth: '300px',
                  flex: '1 1 250px',
                  transition: 'transform 0.3s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{service.icon}</div>
                <h3 style={{ color: '#ffffff', margin: 0 }}>{service.title}</h3>
                <p style={{ color: '#cccccc', fontSize: '1rem', margin: '10px 0 0 0' }}>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 系统组件 */}
      <section style={{ padding: '60px 20px', background: '#181818' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '40px', color: '#00ffff' }}>
            {String.fromCharCode(0x7CFB,0x7EDF,0x7EC4,0x4EF6)} {/* 系统组件 */}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {systemComponents.map((component, index) => (
              <div
                key={index}
                style={{
                  background: '#232323',
                  padding: '25px',
                  borderRadius: '10px',
                  border: '1px solid #333',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px'
                }}
              >
                <div style={{ fontSize: '2rem' }}>{component.icon}</div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 5px 0', color: '#ffffff' }}>{component.title}</h4>
                  <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#cccccc' }}>{component.description}</p>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      background: component.status === String.fromCharCode(0x6B63,0x5E38) ? '#00ff00' : 
                                component.status === String.fromCharCode(0x8FD0,0x884C,0x4E2D) ? '#00ffff' : 
                                component.status === String.fromCharCode(0x5F85,0x673A) ? '#ffff00' : '#ff0000',
                      color: '#000000'
                    }}
                  >
                    {component.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 合作伙伴 */}
      <section style={{ padding: '80px 20px', background: '#111111' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '60px', color: '#00ffff' }}>
            {String.fromCharCode(0x5408,0x4F5C,0x4F19,0x4F34)} {/* 合作伙伴 */}
          </h2>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '40px' }}>
            {partners.map((partner, index) => (
              <div
                key={index}
                style={{
                  background: '#1a1a1a',
                  padding: '30px',
                  borderRadius: '10px',
                  textAlign: 'center',
                  border: '1px solid #333',
                  minWidth: '200px',
                  transition: 'transform 0.3s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>{partner.logo}</div>
                <h4 style={{ color: '#ffffff', margin: 0 }}>{partner.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Operation;
