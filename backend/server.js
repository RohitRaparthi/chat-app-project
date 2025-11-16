const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { sessions, sampleTableResponse, seedSession } = require('./mockData');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get('/api/sessions', (req, res) => {
  const list = Object.values(sessions).map(s => ({
    id: s.id,
    title: s.title,
    createdAt: s.createdAt,
    lastMessage: s.messages?.[s.messages.length - 1] || null
  }));
  res.json(list);
});

app.get('/api/new-chat', (req, res) => {
  const id = uuidv4();
  sessions[id] = {
    id,
    title: `Session ${Object.keys(sessions).length + 1}`,
    createdAt: new Date().toISOString(),
    messages: []
  };
  res.json({ id });
});

app.get('/api/session/:id', (req, res) => {
  const id = req.params.id;
  const s = sessions[id];
  if (!s) return res.status(404).json({ error: 'Session not found' });
  res.json(s);
});

app.post('/api/chat/:id', (req, res) => {
  const id = req.params.id;
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'No question provided' });

  let session = sessions[id];
  if (!session) {
    session = {
      id,
      title: `Session ${Object.keys(sessions).length + 1}`,
      createdAt: new Date().toISOString(),
      messages: []
    };
    sessions[id] = session;
  }

  session.messages.push({
    role: 'user',
    text: question,
    timestamp: new Date().toISOString()
  });

  const response = sampleTableResponse(question);

  const assistantMsg = {
    role: 'assistant',
    text: response.description,
    response,
    feedback: null,
    timestamp: new Date().toISOString()
  };

  session.messages.push(assistantMsg);

  res.json(assistantMsg);
});

app.post('/api/feedback/:sessionId/:messageIndex', (req, res) => {
  const { sessionId, messageIndex } = req.params;
  const { feedback } = req.body;
  const s = sessions[sessionId];
  if (!s) return res.status(404).json({ error: 'Session not found' });

  const idx = parseInt(messageIndex, 10);
  if (isNaN(idx) || idx < 0 || idx >= s.messages.length) {
    return res.status(400).json({ error: 'Invalid message index' });
  }

  const msg = s.messages[idx];
  if (!msg || msg.role !== 'assistant') {
    return res.status(400).json({ error: 'Not an assistant message' });
  }

  msg.feedback = feedback;
  res.json({ ok: true, message: msg });
});

app.listen(PORT, () => {
  console.log(`Mock backend listening on http://localhost:${PORT}`);
});
