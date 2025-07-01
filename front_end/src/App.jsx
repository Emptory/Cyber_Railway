import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Operation from './pages/Operation';
import About from './pages/About';
import Monitor from './pages/Monitor';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import ChineseTestFixed from './pages/ChineseTestFixed';
import SimpleTest from './pages/SimpleTest';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/operation" replace />} />
          <Route path="/operation" element={<Operation />} />
          <Route path="/about" element={<About />} />
          <Route path="/monitor" element={<Monitor />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/test" element={<ChineseTestFixed />} />
          <Route path="/simple-test" element={<SimpleTest />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
