import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();

  const fontFamily = '"Noto Sans SC", "Microsoft YaHei", "SimHei", "SimSun", "Arial Unicode MS", Arial, sans-serif';

  const styles = {
    header: {
      background: '#ffffff',
      padding: '15px 0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      fontFamily
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 20px',
      fontFamily
    },
    logo: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: '#00aeff',
      textDecoration: 'none',
      fontFamily
    },
    nav: {
      display: 'flex',
      alignItems: 'center',
      gap: '30px',
      fontFamily
    },
    navLink: {
      color: '#333',
      textDecoration: 'none',
      fontWeight: '500',
      transition: 'color 0.3s',
      fontFamily
    },
    activeNavLink: {
      color: '#00aeff',
      fontWeight: 'bold',
      fontFamily
    },
    main: {
      marginTop: '80px', // Account for fixed header
      minHeight: 'calc(100vh - 80px)',
      fontFamily
    },
    footer: {
      background: '#1a1a1a',
      color: '#ffffff',
      padding: '40px 0',
      textAlign: 'center',
      fontFamily
    },
    footerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      fontFamily
    }
  };

  const getNavLinkStyle = (path) => ({
    ...styles.navLink,
    ...(location.pathname === path ? styles.activeNavLink : {})
  });

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link to="/operation" style={styles.logo}>{String.fromCharCode(32593, 32476, 38081, 36947)}</Link>
          <nav style={styles.nav}>
            <Link 
              to="/operation" 
              style={getNavLinkStyle('/operation')}
              onMouseEnter={(e) => e.target.style.color = '#00aeff'}
              onMouseLeave={(e) => e.target.style.color = location.pathname === '/operation' ? '#00aeff' : '#333'}
            >
              {String.fromCharCode(25805, 20316)}
            </Link>
            <Link 
              to="/about" 
              style={getNavLinkStyle('/about')}
              onMouseEnter={(e) => e.target.style.color = '#00aeff'}
              onMouseLeave={(e) => e.target.style.color = location.pathname === '/about' ? '#00aeff' : '#333'}
            >
              {String.fromCharCode(20851, 20110)}
            </Link>
            <Link 
              to="/monitor" 
              style={getNavLinkStyle('/monitor')}
              onMouseEnter={(e) => e.target.style.color = '#00aeff'}
              onMouseLeave={(e) => e.target.style.color = location.pathname === '/monitor' ? '#00aeff' : '#333'}
            >
              {String.fromCharCode(30417, 25511)}
            </Link>
            <Link 
              to="/reports" 
              style={getNavLinkStyle('/reports')}
              onMouseEnter={(e) => e.target.style.color = '#00aeff'}
              onMouseLeave={(e) => e.target.style.color = location.pathname === '/reports' ? '#00aeff' : '#333'}
            >
              {String.fromCharCode(25253, 21578)}
            </Link>
            <Link 
              to="/settings" 
              style={getNavLinkStyle('/settings')}
              onMouseEnter={(e) => e.target.style.color = '#00aeff'}
              onMouseLeave={(e) => e.target.style.color = location.pathname === '/settings' ? '#00aeff' : '#333'}
            >
              {String.fromCharCode(35774, 32622)}
            </Link>
            <Link 
              to="/test" 
              style={getNavLinkStyle('/test')}
              onMouseEnter={(e) => e.target.style.color = '#00aeff'}
              onMouseLeave={(e) => e.target.style.color = location.pathname === '/test' ? '#00aeff' : '#333'}
            >
              {String.fromCharCode(27979, 35797)}
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {children}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p style={{ margin: '0 0 10px 0', fontSize: '1.1rem', fontWeight: 'bold' }}>
            {String.fromCharCode(32593, 32476, 38081, 36947)}
          </p>
          <p style={{ margin: '0 0 20px 0', color: '#cccccc' }}>
            {String.fromCharCode(20808, 36827, 38081, 36947, 32593, 32476, 23433, 20840, 21450, 36816, 33829, 31649, 29702)}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '20px' }}>
            <Link to="/about" style={{ color: '#cccccc', textDecoration: 'none' }}>{String.fromCharCode(20851, 20110)}</Link>
            <Link to="/operation" style={{ color: '#cccccc', textDecoration: 'none' }}>{String.fromCharCode(26381, 21153)}</Link>
            <Link to="/reports" style={{ color: '#cccccc', textDecoration: 'none' }}>{String.fromCharCode(25253, 21578)}</Link>
            <Link to="/settings" style={{ color: '#cccccc', textDecoration: 'none' }}>{String.fromCharCode(35774, 32622)}</Link>
          </div>
          <p style={{ margin: 0, color: '#666666', fontSize: '0.9rem' }}>
            &copy; 2024 {String.fromCharCode(32593, 32476, 38081, 36947)}. {String.fromCharCode(29256, 26435, 20445, 30041)}.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
