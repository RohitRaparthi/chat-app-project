import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import TableResponse from './TableResponse';
import AnswerFeedback from './AnswerFeedback';

export default function ChatWindow() {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  const fetchSession = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/session/${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setSession(data);
      } else {
        setSession({ id: sessionId, messages: [] });
      }
    } catch (e) {
      console.error(e);
      setSession({ id: sessionId, messages: [] });
    }
  };

  useEffect(() => {
    if (!sessionId) return;
    fetchSession();
  }, [sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session]);

  const sendQuestion = async (e) => {
    e?.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    try {
      await fetch(`http://localhost:4000/api/chat/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      setQuestion('');
      await fetchSession();
    } catch (err) {
      console.error(err);
      alert('Error sending question. Is backend running?');
    } finally {
      setLoading(false);
    }
  };

  const sendFeedback = async (messageIndex, feedback) => {
    try {
      await fetch(`http://localhost:4000/api/feedback/${sessionId}/${messageIndex}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback })
      });
      await fetchSession();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{maxWidth:980, margin:'0 auto'}}>
      <div className="session-card">
        <div>
          <h2 style={{margin:'0 0 6px 0'}}>{session?.title || sessionId}</h2>
          <div className="session-meta date">{session?.createdAt ? new Date(session.createdAt).toLocaleString() : ''}</div>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button className="icon-btn" title="Session settings">⚙</button>
          <button className="icon-btn" title="Share">⤴</button>
        </div>
      </div>

      <div className="chat-panel">
        <div className="messages">
          {(!session || session.messages.length === 0) && (
            <div style={{textAlign:'center', color:'var(--muted)', padding:20}}>No messages yet. Ask your first question below.</div>
          )}

          {session?.messages?.map((m, idx) => (
            <div key={idx} className={`message ${m.role === 'user' ? 'user' : 'assistant'}`}>
              <div style={{whiteSpace:'pre-wrap'}}>{m.role === 'user' ? m.text : m.response?.description || m.text}</div>

              {m.role === 'assistant' && m.response?.table && (
                <div className="table-wrap" style={{marginTop:12}}>
                  <TableResponse table={m.response.table} />
                </div>
              )}

              {m.role === 'assistant' && (
                <>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10}}>
                    <AnswerFeedback
                      feedback={m.feedback}
                      onFeedback={(fb) => sendFeedback(idx, fb)}
                    />
                    <div className="msg-meta">{new Date(m.timestamp).toLocaleString()}</div>
                  </div>
                </>
              )}
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        <form onSubmit={sendQuestion} className="input-area">
          <div className="input-box">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question (eg. 'Show sample table')"
            />
            <div style={{display:'flex', gap:8}}>
              <button type="button" className="icon-btn" onClick={() => { setQuestion('Show sample table'); }}>
                ✨
              </button>
            </div>
          </div>

          <button type="submit" className="send-btn" disabled={loading}>{loading ? '...' : 'Send'}</button>
        </form>
      </div>
    </div>
  );
}
