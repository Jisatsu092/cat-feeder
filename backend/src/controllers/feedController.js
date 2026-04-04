const { getDb } = require('../models/db');
const { triggerFeed } = require('../services/scheduler');

const manualFeed = (req, res) => {
  const { portion = 3 } = req.body;

  if (portion < 1 || portion > 10) {
    return res.status(400).json({ message: 'Portion harus antara 1-10 detik' });
  }

  triggerFeed(portion, 'manual');
  res.json({ message: 'Feeding triggered', portion });
};

const getHistory = (req, res) => {
  const db = getDb();
  const stmt = db.prepare(
    `SELECT * FROM feed_history ORDER BY triggered_at DESC LIMIT 50`
  );
  const history = [];
  while (stmt.step()) history.push(stmt.getAsObject());
  stmt.free();

  res.json(history);
};

module.exports = { manualFeed, getHistory };