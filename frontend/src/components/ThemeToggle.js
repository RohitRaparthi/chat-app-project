import React from 'react';

export default function ThemeToggle({ theme, setTheme }) {
  return (
    <div style={{display:'flex', alignItems:'center', gap:8}}>
      <button
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        style={{
          padding:'8px 12px',
          borderRadius:10,
          border:'1px solid var(--border)',
          background: theme === 'light' ? 'white' : 'transparent',
          cursor:'pointer',
          fontWeight:600,
          color: theme === 'light' ? 'black' : 'white'
        }}
      >
        {theme === 'light' ? '🌞 Light' : '🌙 Dark'}
      </button>
    </div>
  );
}
