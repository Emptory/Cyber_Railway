import React from 'react';

const About = () => {
  const teamMembers = [
    {
      name: String.fromCharCode(0x9648,0x535A,0x58EB) + " Alex", // �²�ʿ Alex
      role: String.fromCharCode(0x9996,0x5E2D,0x6280,0x672F,0x5B98), // ��ϯ������
      description: String.fromCharCode(0x94C1,0x8DEF,0x7F51,0x7EDC,0x5B89,0x5168,0x4E13,0x5BB6,0xFF0C,0x62E5,0x6709,0x8D85,0x8FC7,0x0031,0x0035,0x5E74,0x7684,0x5173,0x952E,0x57FA,0x7840,0x8BBE,0x65BD,0x9632,0x62A4,0x7ECF,0x9A8C), // ��·���簲ȫר�ң�ӵ�г���15��Ĺؼ�������ʩ��������
      avatar: ""
    },
    {
      name: "Sarah " + String.fromCharCode(0x7EA6,0x7FF0,0x900A), // Sarah Լ��ѷ
      role: String.fromCharCode(0x8FD0,0x8425,0x603B,0x76D1), // ��Ӫ�ܼ�
      description: String.fromCharCode(0x4E13,0x95E8,0x4ECE,0x4E8B,0x94C1,0x8DEF,0x8FD0,0x8425,0x7BA1,0x7406,0x548C,0x73B0,0x4EE3,0x4EA4,0x901A,0x7F51,0x7EDC,0x7CFB,0x7EDF,0x96C6,0x6210), // ר�Ŵ�����·��Ӫ������ִ���ͨ����ϵͳ����
      avatar: ""
    },
    {
      name: "Michael " + String.fromCharCode(0x5F20), // Michael ��
      role: String.fromCharCode(0x5B89,0x5168,0x67B6,0x6784,0x5E08), // ��ȫ�ܹ�ʦ
      description: String.fromCharCode(0x7F51,0x7EDC,0x5B89,0x5168,0x4E13,0x5BB6,0xFF0C,0x4E13,0x6CE8,0x4E8E,0x4FDD,0x62A4,0x94C1,0x8DEF,0x57FA,0x7840,0x8BBE,0x65BD,0x514D,0x53D7,0x65B0,0x5174,0x6570,0x5B57,0x5A01,0x80C1), // ���簲ȫר�ң�רע�ڱ�����·������ʩ��������������в
      avatar: ""
    },
    {
      name: "Emily " + String.fromCharCode(0x7F57,0x5FB7,0x91CC,0x683C,0x5179), // Emily �޵����˹
      role: String.fromCharCode(0x6570,0x636E,0x79D1,0x5B66,0x5BB6), // ���ݿ�ѧ��
      description: String.fromCharCode(0x4EBA,0x5DE5,0x667A,0x80FD,0x548C,0x673A,0x5668,0x5B66,0x4E60,0x5728,0x9884,0x6D4B,0x6027,0x7EF4,0x62A4,0x548C,0x8FD0,0x8425,0x4F18,0x5316,0x4E2D,0x5E94,0x7528,0x7684,0x4E13,0x5BB6), // �˹����ܺͻ���ѧϰ��Ԥ����ά������Ӫ�Ż���Ӧ�õ�ר��
      avatar: ""
    }
  ];

  const milestones = [
    {
      year: "2020",
      title: String.fromCharCode(0x9879,0x76EE,0x542F,0x52A8), // ��Ŀ����
      description: String.fromCharCode(0x7F51,0x7EDC,0x94C1,0x8DEF,0x9879,0x76EE,0x542F,0x52A8,0xFF0C,0x65E8,0x5728,0x89E3,0x51B3,0x73B0,0x4EE3,0x94C1,0x8DEF,0x7CFB,0x7EDF,0x4E2D,0x65E5,0x76CA,0x589E,0x957F,0x7684,0x7F51,0x7EDC,0x5B89,0x5168,0x6311,0x6218) // ������·��Ŀ������ּ�ڽ���ִ���·ϵͳ���������������簲ȫ��ս
    },
    {
      year: "2021",
      title: String.fromCharCode(0x6838,0x5FC3,0x5E73,0x53F0,0x5F00,0x53D1), // ����ƽ̨����
      description: String.fromCharCode(0x5F00,0x53D1,0x94C1,0x8DEF,0x57FA,0x7840,0x8BBE,0x65BD,0x7684,0x57FA,0x7840,0x5B89,0x5168,0x76D1,0x63A7,0x548C,0x63A7,0x5236,0x5E73,0x53F0) // ������·������ʩ�Ļ�����ȫ��غͿ���ƽ̨
    },
    {
      year: "2022",
      title: String.fromCharCode(0x6D4B,0x8BD5,0x7248,0x6D4B,0x8BD5), // ���԰����
      description: String.fromCharCode(0x5728,0x591A,0x4E2A,0x5730,0x533A,0x7684,0x4E3B,0x8981,0x94C1,0x8DEF,0x8FD0,0x8425,0x5546,0x6210,0x529F,0x8FDB,0x884C,0x8BD5,0x70B9,0x90E8,0x7F72,0x548C,0x6D4B,0x8BD5) // �ڶ����������Ҫ��·��Ӫ�̳ɹ������Ե㲿��Ͳ���
    },
    {
      year: "2023",
      title: String.fromCharCode(0x5546,0x4E1A,0x53D1,0x5E03), // ��ҵ����
      description: String.fromCharCode(0x5168,0x9762,0x5546,0x4E1A,0x53D1,0x5E03,0xFF0C,0x5177,0x6709,0x9AD8,0x7EA7,0x4EBA,0x5DE5,0x667A,0x80FD,0x5A01,0x80C1,0x68C0,0x6D4B,0x548C,0x81EA,0x52A8,0x54CD,0x5E94,0x7CFB,0x7EDF) // ȫ����ҵ���������и߼��˹�������в�����Զ���Ӧϵͳ
    },
    {
      year: "2024",
      title: String.fromCharCode(0x5168,0x7403,0x6269,0x5F20), // ȫ������
      description: String.fromCharCode(0x5EFA,0x7ACB,0x56FD,0x9645,0x5408,0x4F5C,0x4F19,0x4F34,0x5173,0x7CFB,0xFF0C,0x5C06,0x8986,0x76D6,0x8303,0x56F4,0x6269,0x5F20,0x5230,0x5168,0x4E16,0x754C,0x7684,0x94C1,0x8DEF,0x7F51,0x7EDC) // �������ʺ�������ϵ�������Ƿ�Χ���ŵ�ȫ�������·����
    }
  ];

  const values = [
    {
      icon: "",
      title: String.fromCharCode(0x5B89,0x5168,0x7B2C,0x4E00), // ��ȫ��һ
      description: String.fromCharCode(0x5BF9,0x4FDD,0x62A4,0x5173,0x952E,0x94C1,0x8DEF,0x57FA,0x7840,0x8BBE,0x65BD,0x514D,0x53D7,0x7F51,0x7EDC,0x5A01,0x80C1,0x505A,0x51FA,0x4E0D,0x59A5,0x534F,0x627F,0x8BFA) // �Ա����ؼ���·������ʩ����������в��������Э��ŵ
    },
    {
      icon: "",
      title: String.fromCharCode(0x521B,0x65B0), // ����
      description: String.fromCharCode(0x63A8,0x52A8,0x94C1,0x8DEF,0x7F51,0x7EDC,0x5B89,0x5168,0x8FB9,0x754C,0x7684,0x5C16,0x7AEF,0x6280,0x672F,0x89E3,0x51B3,0x65B9,0x6848) // �ƶ���·���簲ȫ�߽�ļ�˼����������
    },
    {
      icon: "",
      title: String.fromCharCode(0x5408,0x4F5C), // ����
      description: String.fromCharCode(0x4E0E,0x94C1,0x8DEF,0x8FD0,0x8425,0x5546,0x3001,0x653F,0x5E9C,0x673A,0x6784,0x548C,0x6280,0x672F,0x5408,0x4F5C,0x4F19,0x4F34,0x5BC6,0x5207,0x5408,0x4F5C) // ����·��Ӫ�̡����������ͼ�������������к���
    },
    {
      icon: "",
      title: String.fromCharCode(0x53EF,0x9760,0x6027), // �ɿ���
      description: String.fromCharCode(0x786E,0x4FDD,0x0032,0x0034,0x5C0F,0x65F6,0x8FD0,0x8425,0x8FDE,0x7EED,0x6027,0x548C,0x5BF9,0x4EFB,0x4F55,0x5B89,0x5168,0x4E8B,0x4EF6,0x7684,0x5FEB,0x901F,0x54CD,0x5E94) // ȷ��24Сʱ��Ӫ�����ԺͶ��κΰ�ȫ�¼��Ŀ�����Ӧ
    }
  ];

  return (
    <div style={{ fontFamily: '"Noto Sans SC", "Microsoft YaHei", "SimHei", "SimSun", "Arial Unicode MS", Arial, sans-serif', margin: 0, padding: 0, background: '#0a0a0a', color: '#ffffff' }}>
      {/* Ӣ�۲��� */}
      <section style={{
        height: '60vh',
        background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&h=600&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '800px', padding: '0 20px' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            {String.fromCharCode(0x5173,0x4E8E,0x7F51,0x7EDC,0x94C1,0x8DEF)} {/* ����������· */}
          </h1>
          <p style={{ fontSize: '1.3rem', textShadow: '1px 1px 2px rgba(0,0,0,0.8)', lineHeight: '1.6' }}>
            {String.fromCharCode(0x901A,0x8FC7,0x521B,0x65B0,0x6280,0x672F,0x548C,0x5BF9,0x5B89,0x5168,0x7684,0x575A,0x5B9A,0x627F,0x8BFA,0xFF0C,0x5F00,0x521B,0x94C1,0x8DEF,0x7F51,0x7EDC,0x5B89,0x5168,0x7684,0x672A,0x6765)} {/* ͨ�����¼����Ͷ԰�ȫ�ļᶨ��ŵ��������·���簲ȫ��δ�� */}
          </p>
        </div>
      </section>

      {/* ���ǵ�ʹ�� */}
      <section style={{ padding: '80px 20px', background: '#111111' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '2rem', color: '#00ffff' }}>
            {String.fromCharCode(0x6211,0x4EEC,0x7684,0x4F7F,0x547D)} {/* ���ǵ�ʹ�� */}
          </h2>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.8', maxWidth: '800px', margin: '0 auto', color: '#cccccc' }}>
            {String.fromCharCode(0x5728,0x4E00,0x4E2A,0x65E5,0x76CA,0x6570,0x5B57,0x5316,0x7684,0x4E16,0x754C,0x4E2D,0xFF0C,0x94C1,0x8DEF,0x7F51,0x7EDC,0x9762,0x4E34,0x7740,0x524D,0x6240,0x672A,0x6709,0x7684,0x7F51,0x7EDC,0x5B89,0x5168,0x5A01,0x80C1,0x3002,0x6211,0x4EEC,0x7684,0x4F7F,0x547D,0x662F,0x4E3A,0x5173,0x952E,0x57FA,0x7840,0x8BBE,0x65BD,0x63D0,0x4F9B,0x5148,0x8FDB,0x7684,0x7F51,0x7EDC,0x5B89,0x5168,0x89E3,0x51B3,0x65B9,0x6848,0xFF0C,0x4FDD,0x969C,0x4E58,0x5BA2,0x548C,0x8D27,0x7269,0x7684,0x5B89,0x5168,0x8FD0,0x8F93,0x3002)} {/* ��һ���������ֻ��������У���·����������ǰ��δ�е����簲ȫ��в�����ǵ�ʹ����Ϊ�ؼ�������ʩ�ṩ�Ƚ������簲ȫ������������ϳ˿ͺͻ���İ�ȫ���䡣 */}
          </p>
        </div>
      </section>

      {/* �Ŷӳ�Ա */}
      <section style={{ padding: '80px 20px', background: '#0f0f0f' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '3rem', color: '#00ffff' }}>
            {String.fromCharCode(0x6211,0x4EEC,0x7684,0x56E2,0x961F)} {/* ���ǵ��Ŷ� */}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                style={{
                  background: '#1a1a1a',
                  padding: '30px',
                  borderRadius: '15px',
                  textAlign: 'center',
                  border: '1px solid #333',
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,255,255,0.2)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  background: '#00ffff', 
                  margin: '0 auto 20px auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem'
                }}>
                  {member.avatar}
                </div>
                <h3 style={{ color: '#ffffff', marginBottom: '10px' }}>{member.name}</h3>
                <h4 style={{ color: '#00ffff', marginBottom: '15px', fontWeight: 'normal' }}>{member.role}</h4>
                <p style={{ color: '#cccccc', lineHeight: '1.6', fontSize: '0.95rem' }}>{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ��̱� */}
      <section style={{ padding: '80px 20px', background: '#111111' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '3rem', color: '#00ffff' }}>
            {String.fromCharCode(0x91CC,0x7A0B,0x7891)} {/* ��̱� */}
          </h2>
          <div style={{ position: 'relative' }}>
            {/* ʱ���� */}
            <div style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '2px',
              height: '100%',
              background: '#00ffff'
            }}></div>
            
            {milestones.map((milestone, index) => (
              <div 
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '60px',
                  position: 'relative'
                }}
              >
                <div style={{
                  width: index % 2 === 0 ? '45%' : '50%',
                  paddingRight: index % 2 === 0 ? '40px' : '0',
                  paddingLeft: index % 2 === 1 ? '40px' : '0',
                  textAlign: index % 2 === 0 ? 'right' : 'left',
                  marginLeft: index % 2 === 1 ? 'auto' : '0'
                }}>
                  <div style={{
                    background: '#1a1a1a',
                    padding: '25px',
                    borderRadius: '10px',
                    border: '1px solid #333'
                  }}>
                    <div style={{ 
                      color: '#00ffff', 
                      fontSize: '1.5rem', 
                      fontWeight: 'bold',
                      marginBottom: '10px'
                    }}>
                      {milestone.year}
                    </div>
                    <h3 style={{ color: '#ffffff', marginBottom: '15px' }}>{milestone.title}</h3>
                    <p style={{ color: '#cccccc', lineHeight: '1.6', margin: 0 }}>{milestone.description}</p>
                  </div>
                </div>
                
                {/* ʱ����� */}
                <div style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#00ffff',
                  border: '4px solid #0a0a0a'
                }}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ���ǵļ�ֵ�� */}
      <section style={{ padding: '80px 20px', background: '#0f0f0f' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '3rem', color: '#00ffff' }}>
            {String.fromCharCode(0x6211,0x4EEC,0x7684,0x4EF7,0x503C,0x89C2)} {/* ���ǵļ�ֵ�� */}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
            {values.map((value, index) => (
              <div 
                key={index}
                style={{
                  background: '#1a1a1a',
                  padding: '40px 30px',
                  borderRadius: '15px',
                  textAlign: 'center',
                  border: '1px solid #333',
                  transition: 'transform 0.3s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'
                }
              >
                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>{value.icon}</div>
                <h3 style={{ color: '#ffffff', marginBottom: '20px' }}>{value.title}</h3>
                <p style={{ color: '#cccccc', lineHeight: '1.6', margin: 0 }}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ��ϵ���� */}
      <section style={{ padding: '80px 20px', background: '#111111' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '2rem', color: '#00ffff' }}>
            {String.fromCharCode(0x8054,0x7CFB,0x6211,0x4EEC)} {/* ��ϵ���� */}
          </h2>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#cccccc', marginBottom: '40px' }}>
            {String.fromCharCode(0x51C6,0x5907,0x597D,0x63A2,0x7D22,0x94C1,0x8DEF,0x7F51,0x7EDC,0x5B89,0x5168,0x7684,0x672A,0x6765,0x4E86,0x5417,0xFF1F,0x8054,0x7CFB,0x6211,0x4EEC,0x4E86,0x89E3,0x6211,0x4EEC,0x5982,0x4F55,0x5E2E,0x52A9,0x60A8,0x4FDD,0x62A4,0x60A8,0x7684,0x94C1,0x8DEF,0x57FA,0x7840,0x8BBE,0x65BD,0x3002)} {/* ׼����̽����·���簲ȫ��δ��������ϵ�����˽�������ΰ���������������·������ʩ�� */}
          </p>
          <button style={{
            background: '#00ffff',
            color: '#000000',
            border: 'none',
            padding: '15px 40px',
            fontSize: '1.1rem',
            borderRadius: '30px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'transform 0.3s, box-shadow 0.3s'
          }}
          onMouseEnter={e => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 5px 20px rgba(0,255,255,0.4)';
          }}
          onMouseLeave={e => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = 'none';
          }}
          >
            {String.fromCharCode(0x7ACB,0x5373,0x8054,0x7CFB)} {/* ������ϵ */}
          </button>
        </div>
      </section>
    </div>
  );
};

export default About;
