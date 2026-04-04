const express = require('express');
const app = express();

const scheduleRoutes = require('./routes/scheduleRoutes');
const feedRoutes = require('./routes/feedRoutes');
const { loadSchedules } = require('./services/scheduler');

app.use(express.json());

app.use('/api/schedules', scheduleRoutes);
app.use('/api/feed', feedRoutes);

app.get('/', (req, res) => {
  res.send('Cat Feeder API Running');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
  loadSchedules(); // WAJIB
});