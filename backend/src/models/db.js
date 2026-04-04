const Database = require('better-sqlite3');
const db = new Database('catfeeder.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    time TEXT NOT NULL,
    portion INTEGER NOT NULL,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS feed_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    portion INTEGER NOT NULL,
    triggered_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

module.exports = db;