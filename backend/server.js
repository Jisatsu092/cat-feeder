const express = require('express');
const app = express();

const scheduleRoutes = require('./routes/scheduleRoutes');
const feedRoutes = require('./routes/feedRoutes');
const { loadSchedules } = require('./services/scheduler');
const { initDb } = require('./models/db');

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