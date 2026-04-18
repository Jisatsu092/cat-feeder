const express = require('express');
const path = require('path');
const http = require('http');
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

app.get('/api/stream', (req, res) => {
  if (!espIP) {
    res.status(503).json({ error: 'ESP32 not connected' });
    return;
  }

  http.get(`http://${espIP}/stream`, (espRes) => {
    res.setHeader('Content-Type', espRes.headers['content-type']);
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*');
    espRes.pipe(res);

    req.on('close', () => espRes.destroy());
  }).on('error', (err) => {
    console.error('[STREAM] Error:', err.message);
    res.status(502).json({ error: 'stream failed' });
  });
});

app.get('/api/snapshot', (req, res) => {
  if (!espIP) {
    res.status(503).json({ error: 'ESP32 not connected' });
    return;
  }

  http.get(`http://${espIP}/api/snapshot`, (espRes) => {
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*');
    espRes.pipe(res);
  }).on('error', () => {
    res.status(502).json({ error: 'snapshot failed' });
  });
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