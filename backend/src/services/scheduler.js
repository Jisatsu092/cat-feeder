const cron = require('node-cron');
const db = require('../models/db');

const activeCrons = {};

const isValidTime = (time) => /^\d{2}:\d{2}$/.test(time);

const triggerFeed = (portion, type = 'schedule') => {
  console.log(`[FEED] ${type} - ${portion}s`);

  try {
    db.prepare(`
      INSERT INTO feed_history (type, portion) VALUES (?, ?)
    `).run(type, portion);
  } catch (err) {
    console.error(err);
  }

  // TODO: kirim ke ESP32
};

const startSchedule = (schedule) => {
  if (!isValidTime(schedule.time)) return;

  const [hour, minute] = schedule.time.split(':');
  const cronExp = `${minute} ${hour} * * *`;

  stopSchedule(schedule.id);

  activeCrons[schedule.id] = cron.schedule(cronExp, () => {
    triggerFeed(schedule.portion, 'schedule');
  });

  console.log(`START ${schedule.id} ${cronExp}`);
};

const stopSchedule = (id) => {
  if (activeCrons[id]) {
    activeCrons[id].stop();
    delete activeCrons[id];
  }
};

const loadSchedules = () => {
  const schedules = db.prepare(`
    SELECT * FROM schedules WHERE is_active = 1
  `).all();

  schedules.forEach(startSchedule);

  console.log(`Loaded ${schedules.length} schedules`);
};

module.exports = { triggerFeed, startSchedule, stopSchedule, loadSchedules };