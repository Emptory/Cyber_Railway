import React, { useState, useEffect } from 'react';

const Operation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Chinese slide content
  const slides = [
    {
      image: "/images/pexels-tuurt-179153.jpg",
      title: String.fromCharCode(0x667A,0x80FD,0x94C1,0x8DEF,0x63A2,0x4F24), // ������·̽��
      subtitle: String.fromCharCode(0x73B0,0x4EE3,0x94C1,0x8DEF,0x7F51,0x7EDC,0x7684,0x9AD8,0x6548,0x7EF4,0x62A4,0x7CFB,0x7EDF) // �ִ���·����ĸ�Чά��ϵͳ
    },
    {
      image: "/images/pexels-photospublic-1181202.jpg",
      title: String.fromCharCode(0x8F68,0x9053,0x4F24,0x60C5,0x7F51,0x7EDC), // �����������
      subtitle: String.fromCharCode(0x94C1,0x9053,0x7EF4,0x62A4,0x7684,0x9AD8,0x6548,0x89E3,0x51B3,0x65B9,0x6848) // ����ά���ĸ�Ч�������
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
      title: String.fromCharCode(0x8F68,0x9053,0x63A2,0x4F24,0x68C0,0x6D4B), // ���̽�˼��
      description: String.fromCharCode(0x9AD8,0x7CBE,0x5EA6,0x8D85,0x58F0,0x6CE2,0x3001,0x6DA1,0x6D41,0x3001,0x78C1,0x7C89,0x63A2,0x4F24,0x6280,0x672F,0xFF0C,0x5168,0x9762,0x68C0,0x6D4B,0x8F68,0x9053,0x5185,0x90E8,0x53CA,0x8868,0x9762,0x7F3A,0x9677) // �߾��ȳ��������������ŷ�̽�˼�����ȫ�������ڲ�������ȱ��
    },
    {
      icon: '',
      title: String.fromCharCode(0x591A,0x8F68,0x5236,0x517C,0x5BB9), // ����Ƽ���
      description: String.fromCharCode(0x9002,0x7528,0x4E8E,0x9AD8,0x94C1,0x3001,0x52A8,0x8F66,0x3001,0x666E,0x901A,0x94C1,0x8DEF,0x3001,0x8F7B,0x8F68,0x3001,0x5730,0x94C1,0x7B49,0x5404,0x7C7B,0x8F68,0x9053,0x7CFB,0x7EDF) // �����ڸ�������������ͨ��·����졢�����ȸ�����ϵͳ
    },
    {
      icon: '',
      title: String.fromCharCode(0x667A,0x80FD,0x6570,0x636E,0x5206,0x6790), // �������ݷ���
      description: String.fromCharCode(0x0041,0x0049,0x7B97,0x6CD5,0x81EA,0x52A8,0x8BC6,0x522B,0x4F24,0x635F,0x7C7B,0x578B,0xFF0C,0x751F,0x6210,0x8BE6,0x7EC6,0x68C0,0x6D4B,0x62A5,0x544A,0x548C,0x7EF4,0x62A4,0x5EFA,0x8BAE) // AI�㷨�Զ�ʶ���������ͣ�������ϸ��ⱨ���ά������
    },
    {
      icon: '',
      title: String.fromCharCode(0x5B9E,0x65F6,0x76D1,0x6D4B,0x9884,0x8B66), // ʵʱ���Ԥ��
      description: String.fromCharCode(0x0032,0x0034,0x5C0F,0x65F6,0x8FDE,0x7EED,0x76D1,0x6D4B,0xFF0C,0x53CA,0x65F6,0x53D1,0x73B0,0x5B89,0x5168,0x9690,0x60A3,0xFF0C,0x4FDD,0x969C,0x884C,0x8F66,0x5B89,0x5168) // 24Сʱ������⣬��ʱ���ְ�ȫ�����������г���ȫ
    }
  ];

  // Chinese system components
  const systemComponents = [
    {
      title: String.fromCharCode(0x8D85,0x58F0,0x6CE2,0x63A2,0x4F24,0x6A21,0x5757), // ������̽��ģ��
      description: String.fromCharCode(0x9AD8,0x9891,0x8D85,0x58F0,0x6CE2,0x68C0,0x6D4B,0x8F68,0x9053,0x5185,0x90E8,0x88C2,0x7EB9,0x3001,0x6C14,0x6CE1,0x7B49,0x7F3A,0x9677), // ��Ƶ������������ڲ����ơ����ݵ�ȱ��
      status: String.fromCharCode(0x6B63,0x5E38), // ����
      icon: ''
    },
    {
      title: String.fromCharCode(0x6DA1,0x6D41,0x68C0,0x6D4B,0x7CFB,0x7EDF), // �������ϵͳ
      description: String.fromCharCode(0x7535,0x78C1,0x611F,0x5E94,0x6280,0x672F,0x68C0,0x6D4B,0x8F68,0x9053,0x8868,0x9762,0x88C2,0x7EB9,0x548C,0x6750,0x8D28,0x53D8,0x5316), // ��Ÿ�Ӧ����������������ƺͲ��ʱ仯
      status: String.fromCharCode(0x6B63,0x5E38), // ����
      icon: ''
    },
    {
      title: String.fromCharCode(0x78C1,0x7C89,0x63A2,0x4F24,0x88C5,0x7F6E), // �ŷ�̽��װ��
      description: String.fromCharCode(0x78C1,0x5316,0x68C0,0x6D4B,0x6280,0x672F,0x53D1,0x73B0,0x8F68,0x9053,0x8868,0x9762,0x53CA,0x8FD1,0x8868,0x9762,0x7F3A,0x9677), // �Ż���⼼�����ֹ�����漰������ȱ��
      status: String.fromCharCode(0x6B63,0x5E38), // ����
      icon: ''
    },
    {
      title: String.fromCharCode(0x6570,0x636E,0x5904,0x7406,0x4E2D,0x5FC3), // ���ݴ�������
      description: String.fromCharCode(0x96C6,0x6210,0x0041,0x0049,0x7B97,0x6CD5,0x7684,0x7F3A,0x9677,0x8BC6,0x522B,0x4E0E,0x5206,0x6790,0x7CFB,0x7EDF), // ����AI�㷨��ȱ��ʶ�������ϵͳ
      status: String.fromCharCode(0x8FD0,0x884C,0x4E2D), // ������
      icon: ''
    },
    {
      title: String.fromCharCode(0x79FB,0x52A8,0x68C0,0x6D4B,0x5E73,0x53F0), // �ƶ����ƽ̨
      description: String.fromCharCode(0x81EA,0x9002,0x5E94,0x8F68,0x9053,0x5BBD,0x5EA6,0x7684,0x667A,0x80FD,0x68C0,0x6D4B,0x8F66,0x8F7D,0x7CFB,0x7EDF), // ����Ӧ�����ȵ����ܼ�⳵��ϵͳ
      status: String.fromCharCode(0x5F85,0x673A), // ����
      icon: ''
    }
  ];

  // �������
  const partners = [
    { name: String.fromCharCode(0x4E2D,0x56FD,0x94C1,0x8DEF,0x603B,0x516C,0x53F8), logo: '' }, // �й���·�ܹ�˾
    { name: String.fromCharCode(0x5730,0x94C1,0x8FD0,0x8425,0x96C6,0x56E2), logo: '' }, // ������Ӫ����
    { name: String.fromCharCode(0x63A2,0x4F24,0x8BBE,0x5907,0x5236,0x9020), logo: '' }, // ̽���豸����
    { name: String.fromCharCode(0x8F68,0x9053,0x68C0,0x6D4B,0x670D,0x52A1), logo: '' } // ���������
  ];

  return (
    <div style={{ 
      fontFamily: '"Noto Sans SC", "Microsoft YaHei", "SimHei", "SimSun", "Arial Unicode MS", Arial, sans-serif', 
      margin: 0, 
      padding: 0, 
      background: '#0a0a0a', 
      color: '#ffffff' 
    }}>
      {/* �õ�Ƭ */}
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
        
        {/* ���ͷ */}
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
        
        {/* �Ҽ�ͷ */}
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
        
        {/* ָʾ�� */}
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

      {/* ���� */}
      <section style={{ padding: '60px 20px', background: '#111111' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '40px', color: '#00ffff' }}>
            {String.fromCharCode(0x670D,0x52A1,0x4F18,0x52BF)} {/* �������� */}
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

      {/* ϵͳ��� */}
      <section style={{ padding: '60px 20px', background: '#181818' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '40px', color: '#00ffff' }}>
            {String.fromCharCode(0x7CFB,0x7EDF,0x7EC4,0x4EF6)} {/* ϵͳ��� */}
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

      {/* ������� */}
      <section style={{ padding: '80px 20px', background: '#111111' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '60px', color: '#00ffff' }}>
            {String.fromCharCode(0x5408,0x4F5C,0x4F19,0x4F34)} {/* ������� */}
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
