import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import Landing from './components/Landing';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="app fade-in">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="main">
        <div className="topbar">
          <div className="left">
            <button className="icon-btn" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
              {collapsed ? '☰' : '«'}
            </button>
            <div>
              <div className="app-title">Lumibyte — Simplified Chat</div>
            </div>
          </div>

          <div className="right">
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </div>

        <div className="content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/chat/:sessionId" element={<ChatWindow />} />
            <Route path="*" element={<Landing />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
