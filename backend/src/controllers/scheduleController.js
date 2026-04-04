const { getDb, saveDb } = require('../models/db');
const { startSchedule, stopSchedule } = require('../services/scheduler');

const getRows = (db, sql, params = []) => {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
};

const getOne = (db, sql, params = []) => getRows(db, sql, params)[0] || null;

const getSchedules = (req, res) => {
  const db = getDb();
  const schedules = getRows(db, `SELECT * FROM schedules ORDER BY time ASC`);
  res.json(schedules);
};

const createSchedule = (req, res) => {
  const { time, portion } = req.body;

  if (!time || !portion) {
    return res.status(400).json({ message: 'time dan portion wajib diisi' });
  }

  const db = getDb();
  db.run(`INSERT INTO schedules (time, portion) VALUES (?, ?)`, [time, portion]);
  saveDb();

  const schedule = getOne(
    db,
    `SELECT * FROM schedules WHERE id = last_insert_rowid()`
  );

  startSchedule(schedule);
  res.status(201).json(schedule);
};

const updateSchedule = (req, res) => {
  const { id } = req.params;
  const { time, portion } = req.body;

  const db = getDb();
  db.run(`UPDATE schedules SET time = ?, portion = ? WHERE id = ?`, [time, portion, id]);
  saveDb();

  const schedule = getOne(db, `SELECT * FROM schedules WHERE id = ?`, [id]);
  if (schedule.is_active) startSchedule(schedule);

  res.json(schedule);
};

const deleteSchedule = (req, res) => {
  const { id } = req.params;
  const db = getDb();

  stopSchedule(id);
  db.run(`DELETE FROM schedules WHERE id = ?`, [id]);
  saveDb();

  res.json({ message: 'Jadwal dihapus' });
};

const toggleSchedule = (req, res) => {
  const { id } = req.params;
  const db = getDb();

  const schedule = getOne(db, `SELECT * FROM schedules WHERE id = ?`, [id]);
  if (!schedule) return res.status(404).json({ message: 'Jadwal tidak ditemukan' });

  const newStatus = schedule.is_active ? 0 : 1;
  db.run(`UPDATE schedules SET is_active = ? WHERE id = ?`, [newStatus, id]);
  saveDb();

  if (newStatus === 1) {
    startSchedule({ ...schedule, is_active: 1 });
  } else {
    stopSchedule(id);
  }

  res.json({ ...schedule, is_active: newStatus });
};

module.exports = { getSchedules, createSchedule, updateSchedule, deleteSchedule, toggleSchedule };