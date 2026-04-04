const db = require('../models/db');
const { triggerFeed } = require('../services/scheduler');

const manualFeed = (req, res) => {
  const { portion = 3 } = req.body;

  if (portion < 1 || portion > 10) {
    return res.status(400).json({ message: 'invalid portion' });
  }

  triggerFeed(portion, 'manual');

  res.json({ message: 'ok', portion });
};

const getHistory = (req, res) => {
  const data = db.prepare(`
    SELECT * FROM feed_history ORDER BY triggered_at DESC LIMIT 50
  `).all();

  res.json(data);
};

module.exports = { manualFeed, getHistory };