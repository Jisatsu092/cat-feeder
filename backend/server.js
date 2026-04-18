const express = require('express');
const path = require('path');
const app = express();

const scheduleRoutes = require('./src/routes/schedule');
const feedRoutes = require('./src/routes/feed');
const { loadSchedules } = require('./src/services/scheduler');
const { initDb } = require('./src/models/db');

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

let tunnelUrl = '';
let espIP = '';

app.get('/api/tunnel-url', (req, res) => {
  res.json({ url: tunnelUrl });
});

app.post('/api/tunnel-url', (req, res) => {
  tunnelUrl = req.body.url;
  console.log('[TUNNEL] URL updated:', tunnelUrl);
  res.json({ ok: true });
});

app.post('/api/esp-ip', (req, res) => {
  espIP = req.body.ip;
  console.log('[ESP] IP registered:', espIP);
  res.json({ ok: true });
});

app.get('/api/esp-ip', (req, res) => {
  res.json({ ip: espIP });
});

app.use('/api/schedules', scheduleRoutes);
app.use('/api/feed', feedRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

initDb().then(() => {
  loadSchedules();
  app.listen(3000, () => console.log('[SERVER] Running on :3000'));
});