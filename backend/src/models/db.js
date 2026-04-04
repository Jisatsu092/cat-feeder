const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../catfeeder.db');

let db;

const getDb = () => db;

const saveDb = () => {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
};

const initDb = async () => {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
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

  saveDb();
  console.log('[DB] Database siap');
};

module.exports = { getDb, saveDb, initDb };