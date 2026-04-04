const express = require('express');
const app = express();

const scheduleRoutes = require('./src/routes/schedule');
const feedRoutes = require('./src/routes/feed');
const { loadSchedules } = require('./src/services/scheduler');
const { initDb } = require('./src/models/db');

app.use(express.json());

app.use('/api/schedules', scheduleRoutes);
app.use('/api/feed', feedRoutes);

app.get('/', (req, res) => {
  res.send('Cat Feeder API Running');
});

initDb().then(() => {
  loadSchedules();
  app.listen(3000, () => console.log('[SERVER] Running on :3000'));
});