import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  const startNew = async () => {
    try {
      const resp = await fetch('https://chat-app-project-4321.onrender.com/api/new-chat');
      const data = await resp.json();
      navigate(`/chat/${data.id}`);
    } catch (e) {
      console.error(e);
      alert('Could not create session. Make sure backend is running.');
    }
  }

  return (
    <div style={{maxWidth:920, margin:'0 auto'}}>
      <div className="card" style={{padding:28}}>
        <h2 style={{marginTop:0}}>Welcome to Lumibyte</h2>
        <p style={{color:'var(--muted)', marginTop:8}}>
          Start a new chat to get structured (tabular) responses and try the modern minimal UI with dark/light themes.
        </p>

        <div style={{display:'flex', gap:12, marginTop:18}}>
          <button className="new-chat" onClick={startNew}>Start New Chat</button>
          <button className="icon-btn" onClick={() => alert('Example: try "Show sample table"')}>Try sample question</button>
        </div>
      </div>
    </div>
  );
}
