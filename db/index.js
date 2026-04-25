const Database = require("better-sqlite3");
const path = require("path");

// In production (packaged Electron app), store the DB in user's app data folder
// so the data persists across updates and the location is writable.
let dbPath;
if (process.env.NODE_ENV === "production") {
  const appDataDir =
    process.env.APPDATA ||
    path.join(require("os").homedir(), "AppData", "Roaming");
  const appDir = path.join(appDataDir, "NextLife");
  require("fs").mkdirSync(appDir, { recursive: true });
  dbPath = path.join(appDir, "nextlife.db");
} else {
  dbPath = path.join(__dirname, "..", "nextlife.db");
}

const db = Database(dbPath);

// Enable WAL mode for better performance
db.pragma("journal_mode = WAL");

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS networth (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    value REAL DEFAULT 0,
    base_value REAL DEFAULT 0,
    goal_ultimate_id INTEGER,
    type TEXT
  );

  CREATE TABLE IF NOT EXISTS networth_time (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    total_networth REAL DEFAULT 0,
    monthly_income REAL DEFAULT 0,
    investment_profit REAL DEFAULT 0,
    monthly_profit REAL DEFAULT 0,
    date TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS business (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    revenue REAL DEFAULT 0,
    capital REAL DEFAULT 0,
    status TEXT
  );

  CREATE TABLE IF NOT EXISTS business_time (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_profit REAL DEFAULT 0,
    total_revenue REAL DEFAULT 0,
    total_capital REAL DEFAULT 0,
    profit_percentage REAL DEFAULT 0,
    date TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS investment_time (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    investment_profit REAL DEFAULT 0,
    total REAL DEFAULT 0,
    capital REAL DEFAULT 0,
    profit_percentage REAL DEFAULT 0,
    date TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS trading_time (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    total REAL DEFAULT 0,
    profit_percentage REAL DEFAULT 0,
    total_profit REAL DEFAULT 0,
    prev_profit REAL DEFAULT 0,
    avg_profit REAL DEFAULT 0,
    avg_profit_percent REAL DEFAULT 0,
    date TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS goal_ultimate (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    target_value REAL DEFAULT 0,
    current_value REAL DEFAULT 0,
    image_source TEXT,
    status INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS goal_other (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    complete_status INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS asset (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    value REAL DEFAULT 0,
    base_value REAL DEFAULT 0,
    type TEXT,
    status TEXT DEFAULT 'active',
    value_mode TEXT DEFAULT 'rm',
    networth_id INTEGER
  );

  CREATE TABLE IF NOT EXISTS skill_type (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS skill (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    complete_status INTEGER DEFAULT 0,
    skill_type_id INTEGER,
    FOREIGN KEY (skill_type_id) REFERENCES skill_type(id)
  );
`);

// Migrations: add missing columns to existing asset tables
const assetColumns = db.pragma('table_info(asset)').map(c => c.name);
if (!assetColumns.includes('base_value')) {
  db.exec(`ALTER TABLE asset ADD COLUMN base_value REAL DEFAULT 0`);
}
if (!assetColumns.includes('value_mode')) {
  db.exec(`ALTER TABLE asset ADD COLUMN value_mode TEXT DEFAULT 'rm'`);
}
if (!assetColumns.includes('networth_id')) {
  db.exec(`ALTER TABLE asset ADD COLUMN networth_id INTEGER`);
}

module.exports = db;