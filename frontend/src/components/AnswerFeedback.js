import React from 'react';

export default function AnswerFeedback({ feedback, onFeedback }) {
  return (
    <div className="feedback">
      <button
        onClick={() => onFeedback('like')}
        className={`fb-btn ok-btn ${feedback === 'like' ? 'active' : ''}`}
        title="Like"
      >
        👍
      </button>
      <button
        onClick={() => onFeedback('dislike')}
        className={`fb-btn notok-btn ${feedback === 'dislike' ? 'active' : ''}`}
        title="Dislike"
      >
        👎
      </button>
      <div style={{fontSize:13, color:'var(--muted)'}}>Was this helpful?</div>
    </div>
  );
}
