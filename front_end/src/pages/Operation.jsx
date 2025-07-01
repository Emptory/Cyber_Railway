import React, { useState, useEffect } from 'react';

const Operation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // ���Ļõ�Ƭ����
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&h=600&fit=crop",
      title: String.fromCharCode(0x667A,0x80FD,0x94C1,0x8DEF,0x8FD0,0x8425), // ������·��Ӫ
      subtitle: String.fromCharCode(0x73B0,0x4EE3,0x4EA4,0x901A,0x7684,0x9AD8,0x7EA7,0x76D1,0x63A7,0x7CFB,0x7EDF) // �ִ���ͨ�ĸ߼����ϵͳ
    },
    {
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=600&fit=crop",
      title: String.fromCharCode(0x6570,0x5B57,0x57FA,0x7840,0x8BBE,0x65BD), // ���ֻ�����ʩ
      subtitle: String.fromCharCode(0x94C1,0x8DEF,0x7F51,0x7EDC,0x7684,0x5148,0x8FDB,0x6280,0x672F,0x89E3,0x51B3,0x65B9,0x6848) // ��·������Ƚ������������
    },
    {
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=600&fit=crop",
      title: String.fromCharCode(0x7F51,0x7EDC,0x5B89,0x5168,0x65B9,0x6848), // ���簲ȫ����
      subtitle: String.fromCharCode(0x4FDD,0x62A4,0x5173,0x952E,0x57FA,0x7840,0x8BBE,0x65BD,0x5B89,0x5168) // �����ؼ�������ʩ��ȫ
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // ���ķ�������
  const services = [
    {
      icon: '',
      title: String.fromCharCode(0x9AD8,0x94C1,0x63A7,0x5236), // ��������
      description: String.fromCharCode(0x9AD8,0x94C1,0x8FD0,0x8425,0x7684,0x9AD8,0x7EA7,0x76D1,0x63A7,0x548C,0x5B89,0x5168,0x534F,0x8C03) // ������Ӫ�ĸ߼���غͰ�ȫЭͬ
    },
    {
      icon: '',
      title: String.fromCharCode(0x7F51,0x7EDC,0x5B89,0x5168,0x9632,0x62A4), // ���簲ȫ����
      description: String.fromCharCode(0x5168,0x9762,0x4FDD,0x62A4,0x94C1,0x8DEF,0x57FA,0x7840,0x8BBE,0x65BD,0x5B89,0x5168) // ȫ�汣����·������ʩ��ȫ
    },
    {
      icon: '',
      title: String.fromCharCode(0x6570,0x636E,0x5206,0x6790), // ���ݷ���
      description: String.fromCharCode(0x667A,0x80FD,0x6570,0x636E,0x5904,0x7406,0x548C,0x7EF4,0x62A4) // �������ݴ����ά��
    },
    {
      icon: '',
      title: String.fromCharCode(0x7EF4,0x62A4,0x7CFB,0x7EDF), // ά��ϵͳ
      description: String.fromCharCode(0x667A,0x80FD,0x7EF4,0x62A4,0x548C,0x8BBE,0x5907,0x76D1,0x63A7) // ����ά�����豸���
    }
  ];

  // ����ϵͳ���
  const systemComponents = [
    {
      title: String.fromCharCode(0x4FE1,0x53F7,0x63A7,0x5236), // �źſ���
      description: String.fromCharCode(0x81EA,0x52A8,0x4FE1,0x53F7,0x7BA1,0x7406,0x7CFB,0x7EDF), // �Զ��źŹ���ϵͳ
      status: String.fromCharCode(0x6B63,0x5E38), // ����
      icon: ''
    },
    {
      title: String.fromCharCode(0x8F68,0x9053,0x76D1,0x63A7), // ������
      description: String.fromCharCode(0x5B9E,0x65F6,0x8F68,0x9053,0x72B6,0x6001,0x76D1,0x63A7), // ʵʱ���״̬���
      status: String.fromCharCode(0x6B63,0x5E38), // ����
      icon: ''
    },
    {
      title: String.fromCharCode(0x7535,0x529B,0x7BA1,0x7406), // ��������
      description: String.fromCharCode(0x94C1,0x8DEF,0x7535,0x7F51,0x4F18,0x5316), // ��·�����Ż�
      status: String.fromCharCode(0x6B63,0x5E38), // ����
      icon: ''
    },
    {
      title: String.fromCharCode(0x5FEB,0x901F,0x5E94,0x6025), // ����Ӧ��
      description: String.fromCharCode(0x5FEB,0x901F,0x4E8B,0x6545,0x5E94,0x6025,0x534F,0x8C03), // �����¹�Ӧ��Эͬ
      status: String.fromCharCode(0x5907,0x7528), // ����
      icon: ''
    }
  ];

  // �������
  const partners = [
    { name: String.fromCharCode(0x94C1,0x8DEF,0x516C,0x53F8), logo: '' }, // ��·��˾
    { name: String.fromCharCode(0x6280,0x672F,0x89E3,0x51B3), logo: '' }, // �������
    { name: String.fromCharCode(0x5B89,0x5168,0x7CFB,0x7EDF), logo: '' }, // ��ȫϵͳ
    { name: String.fromCharCode(0x57FA,0x7840,0x8BBE,0x65BD), logo: '' } // ������ʩ
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
                      background: component.status === String.fromCharCode(0x6B63,0x5E38) ? '#00ff00' : '#ffff00',
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
