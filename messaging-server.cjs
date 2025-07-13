const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let messages = [];

app.post('/messages', (req, res) => {
  const { from, to, message } = req.body;
  if (!from || !to || !message) {
    return res.status(400).json({ error: 'Missing from, to, or message' });
  }
  messages.push({ from, to, message, timestamp: Date.now() });
  res.status(201).json({ success: true });
});

app.get('/messages', (req, res) => {
  const { to } = req.query;
  if (!to) return res.status(400).json({ error: 'Missing to' });
  const inbox = messages.filter(m => m.to.toLowerCase() === to.toLowerCase());
  res.json(inbox);
});

app.listen(PORT, () => {
  console.log(`Messaging API running at http://localhost:${PORT}`);
});