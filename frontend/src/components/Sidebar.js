import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar({ collapsed, setCollapsed }) {
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchSessions = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/sessions');
      const data = await res.json();
      setSessions(data.sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt)));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchSessions(); }, [location.pathname]);

  const newChat = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/new-chat');
      const { id } = await res.json();
      navigate(`/chat/${id}`);
    } catch (e) {
      console.error(e);
      alert('Could not create new chat. Is backend running?');
    }
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="header">
        <div className="brand">
          <div className="logo">L</div>
          {!collapsed && (
            <div>
              <div className="title">Lumibyte</div>
              <div className="subtitle">Simplified Chat</div>
            </div>
          )}
        </div>

      </div>

      <div>
        <button className="new-chat" onClick={newChat}>
          {!collapsed ? '➕ New Chat' : '➕'}
        </button>
      </div>

      <div className="sessions" role="list">
        {sessions.length === 0 && <div style={{fontSize:13, color:'var(--muted)'}}>No sessions yet.</div>}
        {sessions.map(s => {
          const active = location.pathname.includes(s.id);
          return (
            <Link key={s.id} to={`/chat/${s.id}`} className={`session-item ${active ? 'active' : ''}`} role="listitem">
              <div className="session-avatar">{(s.title || s.id).slice(0,2).toUpperCase()}</div>
              {!collapsed && (
                <div>
                  <div className="session-title">{s.title || s.id.slice(0,8)}</div>
                  <div className="session-meta">{new Date(s.createdAt).toLocaleString()}</div>
                </div>
              )}
            </Link>
          );
        })}
      </div>

      <div className="footer">
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <div style={{width:40, height:40, borderRadius:10, background:'linear-gradient(135deg,#f59e0b,#ef4444)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700}}>D</div>
          {!collapsed && <div style={{fontSize:13}}>Demo User</div>}
        </div>
      </div>
    </aside>
  );
}
