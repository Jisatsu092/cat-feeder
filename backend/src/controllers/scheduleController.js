const db = require('../models/db');
const { startSchedule, stopSchedule } = require('../services/scheduler');

const isValidTime = (time) => /^\d{2}:\d{2}$/.test(time);

const getSchedules = (req, res) => {
  const data = db.prepare(`SELECT * FROM schedules ORDER BY time`).all();
  res.json(data);
};

const createSchedule = (req, res) => {
  const { time, portion } = req.body;

  if (!isValidTime(time) || portion < 1 || portion > 10) {
    return res.status(400).json({ message: 'invalid input' });
  }

  const result = db.prepare(`
    INSERT INTO schedules (time, portion) VALUES (?, ?)
  `).run(time, portion);

  const schedule = db.prepare(`
    SELECT * FROM schedules WHERE id = ?
  `).get(result.lastInsertRowid);

  startSchedule(schedule);

  res.json(schedule);
};

const updateSchedule = (req, res) => {
  const { id } = req.params;
  const { time, portion } = req.body;

  if (!isValidTime(time) || portion < 1 || portion > 10) {
    return res.status(400).json({ message: 'invalid input' });
  }

  db.prepare(`
    UPDATE schedules SET time = ?, portion = ? WHERE id = ?
  `).run(time, portion, id);

  const schedule = db.prepare(`SELECT * FROM schedules WHERE id = ?`).get(id);

  stopSchedule(id);
  if (schedule.is_active) startSchedule(schedule);

  res.json(schedule);
};

const deleteSchedule = (req, res) => {
  const { id } = req.params;

  stopSchedule(id);
  db.prepare(`DELETE FROM schedules WHERE id = ?`).run(id);

  res.json({ message: 'deleted' });
};

const toggleSchedule = (req, res) => {
  const { id } = req.params;

  const schedule = db.prepare(`SELECT * FROM schedules WHERE id = ?`).get(id);
  const newStatus = schedule.is_active ? 0 : 1;

  db.prepare(`
    UPDATE schedules SET is_active = ? WHERE id = ?
  `).run(newStatus, id);

  if (newStatus === 1) startSchedule(schedule);
  else stopSchedule(id);

  res.json({ ...schedule, is_active: newStatus });
};

module.exports = {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  toggleSchedule
};