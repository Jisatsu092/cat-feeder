const cron = require('node-cron');
const { getDb, saveDb } = require('../models/db');

const activeCrons = {};

const triggerFeed = (portion, type = 'schedule') => {
  console.log(`[FEED] type: ${type}, portion: ${portion}s`);

  const db = getDb();
  db.run(
    `INSERT INTO feed_history (type, portion) VALUES (?, ?)`,
    [type, portion]
  );
  saveDb();
};

const startSchedule = (schedule) => {
  const [hour, minute] = schedule.time.split(':');
  const cronExp = `${minute} ${hour} * * *`;

  if (activeCrons[schedule.id]) {
    activeCrons[schedule.id].stop();
  }

  activeCrons[schedule.id] = cron.schedule(cronExp, () => {
    triggerFeed(schedule.portion, 'schedule');
  });
};

const stopSchedule = (id) => {
  if (activeCrons[id]) {
    activeCrons[id].stop();
    delete activeCrons[id];
  }
};

const loadSchedules = () => {
  const db = getDb();
  const stmt = db.prepare(`SELECT * FROM schedules WHERE is_active = 1`);
  const schedules = [];
  while (stmt.step()) schedules.push(stmt.getAsObject());
  stmt.free();

  schedules.forEach(startSchedule);
  console.log(`[SCHEDULER] ${schedules.length} jadwal aktif dimuat`);
};

module.exports = { triggerFeed, startSchedule, stopSchedule, loadSchedules };