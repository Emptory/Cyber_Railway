import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const BlueboxWebsite = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const location = useLocation();

  // Slideshow data
  const slides = [
    {
      image: "/images/mac.png",
      title: "Advanced Cyber Railway Management System",
      subtitle: "Modern technology for smart railway operations"
    },
    {
      image: "/images/mac1.png", 
      title: "Real-time Monitoring & Control",
      subtitle: "Complete oversight of your railway infrastructure"
    },
    {
      image: "/images/mac.png",
      title: "Safety & Security First",
      subtitle: "Ensuring safe and efficient transportation"
    }
  ];

  // Services data
  const services = [
    {
      icon: "/images/icon.png",
      title: "Train Management",
      description: "Comprehensive train scheduling, route planning, and real-time tracking systems. Monitor all railway operations from a centralized dashboard with advanced analytics and reporting capabilities."
    },
    {
      icon: "/images/icon1.png",
      title: "Safety Systems",
      description: "Advanced safety monitoring including signal systems, track sensors, emergency protocols, and automated safety checks. Ensure passenger safety with cutting-edge technology solutions."
    },
    {
      icon: "/images/icon2.png",
      title: "Smart Analytics",
      description: "Data-driven insights for operational efficiency, predictive maintenance, passenger flow analysis, and performance optimization. Make informed decisions with AI-powered analytics."
    }
  ];

  // Portfolio data
  const works = [
    { image: "/images/pic.jpg", title: "Central Control System", description: "Advanced railway operations control center" },
    { image: "/images/pic1.jpg", title: "Smart Signaling", description: "Automated signal management system" },
    { image: "/images/pic2.jpg", title: "Passenger Information", description: "Real-time passenger information displays" },
    { image: "/images/pic3.jpg", title: "Track Monitoring", description: "Continuous track condition monitoring" },
    { image: "/images/pic4.jpg", title: "Station Management", description: "Comprehensive station operations system" },
    { image: "/images/pic5.jpg", title: "Safety Analytics", description: "AI-powered safety analysis platform" },
    { image: "/images/pic6.jpg", title: "Mobile Operations", description: "Mobile apps for field operations" },
    { image: "/images/pic7.jpg", title: "Emergency Response", description: "Rapid emergency response coordination" }
  ];

  // Client data
  const clients = [
    "/images/c1.png",
    "/images/c2.png", 
    "/images/c3.png",
    "/images/c4.png"
  ];

  // Auto-play slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Style objects
  const styles = {
    website: {
      fontFamily: "'Open Sans', sans-serif",
      backgroundColor: '#fff',
      color: '#333',
      lineHeight: '1.6'
    },
    header: {
      backgroundColor: '#fff',
      padding: '20px 0',
      borderBottom: '1px solid #ebebeb',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#00aeff',
      textDecoration: 'none'
    },
    nav: {
      display: 'flex',
      gap: '30px',
      alignItems: 'center'
    },
    navLink: {
      textDecoration: 'none',
      color: '#333',
      fontSize: '14px',
      fontWeight: '500',
      textTransform: 'uppercase',
      padding: '10px 0',
      transition: 'color 0.3s',
      borderBottom: '2px solid transparent'
    },
    searchBox: {
      padding: '8px 15px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      outline: 'none'
    },
    banner: {
      backgroundColor: '#f8f9fa',
      padding: '80px 0',
      position: 'relative',
      overflow: 'hidden'
    },
    bannerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '60px'
    },
    bannerText: {
      flex: '2'
    },
    bannerTitle: {
      fontSize: '48px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '20px',
      lineHeight: '1.2'
    },
    bannerSubtitle: {
      fontSize: '18px',
      color: '#666',
      marginBottom: '30px'
    },
    bannerButton: {
      display: 'inline-block',
      backgroundColor: '#00aeff',
      color: 'white',
      padding: '15px 30px',
      borderRadius: '5px',
      textDecoration: 'none',
      fontSize: '16px',
      fontWeight: '500',
      transition: 'all 0.3s',
      border: 'none',
      cursor: 'pointer'
    },
    bannerImage: {
      flex: '1',
      textAlign: 'center'
    },
    bannerImg: {
      maxWidth: '100%',
      height: 'auto',
      borderRadius: '10px'
    },
    slideIndicators: {
      position: 'absolute',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '10px'
    },
    indicator: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255,255,255,0.5)',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    activeIndicator: {
      backgroundColor: '#00aeff'
    },
    section: {
      padding: '80px 0'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    },
    sectionTitle: {
      fontSize: '36px',
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#333',
      marginBottom: '60px'
    },
    servicesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '40px'
    },
    serviceCard: {
      textAlign: 'center',
      padding: '30px 20px',
      borderRadius: '10px',
      transition: 'all 0.3s',
      border: '1px solid #f0f0f0'
    },
    serviceIcon: {
      width: '60px',
      height: '60px',
      margin: '0 auto 20px',
      display: 'block'
    },
    serviceTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '15px'
    },
    serviceDescription: {
      color: '#666',
      lineHeight: '1.6',
      marginBottom: '20px'
    },
    readMoreBtn: {
      color: '#00aeff',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '500',
      textTransform: 'uppercase',
      borderBottom: '1px solid transparent',
      transition: 'all 0.3s'
    },
    worksGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '30px'
    },
    workCard: {
      position: 'relative',
      borderRadius: '10px',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.3s',
      backgroundColor: '#fff',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
    },
    workImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
      transition: 'transform 0.3s'
    },
    workContent: {
      padding: '20px'
    },
    workTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '10px'
    },
    workDescription: {
      color: '#666',
      fontSize: '14px'
    },
    workOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 174, 255, 0.9)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0,
      transition: 'opacity 0.3s',
      fontSize: '18px',
      fontWeight: 'bold'
    },
    clientsSection: {
      backgroundColor: '#f8f9fa'
    },
    clientsGrid: {
      display: 'flex',
      justifyContent: 'center',
      gap: '60px',
      flexWrap: 'wrap',
      alignItems: 'center'
    },
    clientLogo: {
      height: '60px',
      width: 'auto',
      opacity: 0.7,
      transition: 'opacity 0.3s',
      cursor: 'pointer'
    },
    footer: {
      backgroundColor: '#333',
      color: '#fff',
      padding: '50px 0 30px'
    },
    footerContent: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '40px',
      marginBottom: '30px'
    },
    footerNav: {
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap'
    },
    footerNavLink: {
      color: '#ccc',
      textDecoration: 'none',
      fontSize: '14px',
      transition: 'color 0.3s'
    },
    socialLinks: {
      display: 'flex',
      gap: '15px'
    },
    socialLink: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#555',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textDecoration: 'none',
      fontSize: '18px',
      transition: 'all 0.3s'
    },
    copyright: {
      textAlign: 'center',
      padding: '20px 0',
      borderTop: '1px solid #555',
      color: '#999',
      fontSize: '14px'
    }
  };

  return (
    <div style={styles.website}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <a href="#" style={styles.logo}>CYBER RAILWAY</a>
          <nav style={styles.nav}>
            <Link to="/operation" style={styles.navLink} 
               onMouseEnter={(e) => e.target.style.color = '#00aeff'}
               onMouseLeave={(e) => e.target.style.color = '#333'}>
              Operation
            </Link>
            <Link to="/about" style={styles.navLink}
               onMouseEnter={(e) => e.target.style.color = '#00aeff'}
               onMouseLeave={(e) => e.target.style.color = '#333'}>
              About
            </Link>
            <Link to="/monitor" style={styles.navLink}
               onMouseEnter={(e) => e.target.style.color = '#00aeff'}
               onMouseLeave={(e) => e.target.style.color = '#333'}>
              Monitor
            </Link>
            <Link to="/reports" style={styles.navLink}
               onMouseEnter={(e) => e.target.style.color = '#00aeff'}
               onMouseLeave={(e) => e.target.style.color = '#333'}>
              Reports
            </Link>
            <Link to="/settings" style={styles.navLink}
               onMouseEnter={(e) => e.target.style.color = '#00aeff'}
               onMouseLeave={(e) => e.target.style.color = '#333'}>
              Settings
            </Link>
            <input 
              type="text" 
              placeholder="Search..." 
              style={styles.searchBox}
            />
          </nav>
        </div>
      </header>

      {/* Banner/Slider */}
      <section style={styles.banner}>
        <div style={styles.bannerContent}>
          <div style={styles.bannerText}>
            <h1 style={styles.bannerTitle}>{slides[currentSlide].title}</h1>
            <p style={styles.bannerSubtitle}>{slides[currentSlide].subtitle}</p>
            <button 
              style={styles.bannerButton}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Start Operations
            </button>
          </div>
          <div style={styles.bannerImage}>
            <img src={slides[currentSlide].image} alt="Banner" style={styles.bannerImg} />
          </div>
        </div>
        <div style={styles.slideIndicators}>
          {slides.map((_, index) => (
            <div
              key={index}
              style={{
                ...styles.indicator,
                ...(index === currentSlide ? styles.activeIndicator : {})
              }}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section style={styles.section}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Railway Services</h2>
          <div style={styles.servicesGrid}>
            {services.map((service, index) => (
              <div 
                key={index} 
                style={styles.serviceCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <img src={service.icon} alt={service.title} style={styles.serviceIcon} />
                <h3 style={styles.serviceTitle}>{service.title}</h3>
                <p style={styles.serviceDescription}>{service.description}</p>
                <a 
                  href="#" 
                  style={styles.readMoreBtn}
                  onMouseEnter={(e) => e.target.style.borderBottomColor = '#00aeff'}
                  onMouseLeave={(e) => e.target.style.borderBottomColor = 'transparent'}
                >
                  Read More
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Works Section */}
      <section style={styles.section}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>System Components</h2>
          <div style={styles.worksGrid}>
            {works.map((work, index) => (
              <div 
                key={index} 
                style={styles.workCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  const overlay = e.currentTarget.querySelector('.work-overlay');
                  const image = e.currentTarget.querySelector('.work-image');
                  if (overlay) overlay.style.opacity = '1';
                  if (image) image.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  const overlay = e.currentTarget.querySelector('.work-overlay');
                  const image = e.currentTarget.querySelector('.work-image');
                  if (overlay) overlay.style.opacity = '0';
                  if (image) image.style.transform = 'scale(1)';
                }}
              >
                <img 
                  src={work.image} 
                  alt={work.title} 
                  style={styles.workImage}
                  className="work-image"
                />
                <div style={styles.workOverlay} className="work-overlay">
                  View Project
                </div>
                <div style={styles.workContent}>
                  <h4 style={styles.workTitle}>{work.title}</h4>
                  <p style={styles.workDescription}>{work.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section style={{...styles.section, ...styles.clientsSection}}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Railway Partners</h2>
          <div style={styles.clientsGrid}>
            {clients.map((client, index) => (
              <img 
                key={index}
                src={client} 
                alt={`Client ${index + 1}`} 
                style={styles.clientLogo}
                onMouseEnter={(e) => e.target.style.opacity = '1'}
                onMouseLeave={(e) => e.target.style.opacity = '0.7'}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.container}>
          <div style={styles.footerContent}>
            <div>
              <nav style={styles.footerNav}>
                <a href="#" style={styles.footerNavLink}
                   onMouseEnter={(e) => e.target.style.color = '#00aeff'}
                   onMouseLeave={(e) => e.target.style.color = '#ccc'}>
                  Home
                </a>
                <a href="#" style={styles.footerNavLink}
                   onMouseEnter={(e) => e.target.style.color = '#00aeff'}
                   onMouseLeave={(e) => e.target.style.color = '#ccc'}>
                  Dashboard
                </a>
                <a href="#" style={styles.footerNavLink}
                   onMouseEnter={(e) => e.target.style.color = '#00aeff'}
                   onMouseLeave={(e) => e.target.style.color = '#ccc'}>
                  Operations
                </a>
                <a href="#" style={styles.footerNavLink}
                   onMouseEnter={(e) => e.target.style.color = '#00aeff'}
                   onMouseLeave={(e) => e.target.style.color = '#ccc'}>
                  Monitoring
                </a>
                <a href="#" style={styles.footerNavLink}
                   onMouseEnter={(e) => e.target.style.color = '#00aeff'}
                   onMouseLeave={(e) => e.target.style.color = '#ccc'}>
                  Reports
                </a>
                <a href="#" style={styles.footerNavLink}
                   onMouseEnter={(e) => e.target.style.color = '#00aeff'}
                   onMouseLeave={(e) => e.target.style.color = '#ccc'}>
                  Settings
                </a>
              </nav>
            </div>
            <div>
              <div style={styles.socialLinks}>
                <a href="#" style={styles.socialLink}
                   onMouseEnter={(e) => e.target.style.backgroundColor = '#3b5998'}
                   onMouseLeave={(e) => e.target.style.backgroundColor = '#555'}>
                  f
                </a>
                <a href="#" style={styles.socialLink}
                   onMouseEnter={(e) => e.target.style.backgroundColor = '#1da1f2'}
                   onMouseLeave={(e) => e.target.style.backgroundColor = '#555'}>
                  t
                </a>
                <a href="#" style={styles.socialLink}
                   onMouseEnter={(e) => e.target.style.backgroundColor = '#0077b5'}
                   onMouseLeave={(e) => e.target.style.backgroundColor = '#555'}>
                  in
                </a>
                <a href="#" style={styles.socialLink}
                   onMouseEnter={(e) => e.target.style.backgroundColor = '#bd081c'}
                   onMouseLeave={(e) => e.target.style.backgroundColor = '#555'}>
                  p
                </a>
              </div>
            </div>
          </div>
          <div style={styles.copyright}>
            <p>? 2024 CYBER RAILWAY SYSTEM. All rights reserved. Advanced Railway Management Technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlueboxWebsite;
