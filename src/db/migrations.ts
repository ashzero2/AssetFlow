import { getDb } from './client';

export function runMigrations() {
  const db = getDb();

  db.execSync(`PRAGMA journal_mode = WAL;`);
  db.execSync(`PRAGMA foreign_keys = ON;`);

  // Assets table
  db.execSync(`
    CREATE TABLE IF NOT EXISTS assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      ticker TEXT,
      units REAL DEFAULT 0,
      buy_price REAL DEFAULT 0,
      current_price REAL DEFAULT 0,
      current_value REAL DEFAULT 0,
      currency TEXT DEFAULT 'INR',
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // Transactions table
  db.execSync(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      asset_id INTEGER,
      created_at TEXT NOT NULL,
      FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE SET NULL
    );
  `);

  // Goals table
  db.execSync(`
    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      target_amount REAL NOT NULL,
      deadline TEXT,
      color TEXT DEFAULT '#5C6BC0',
      icon TEXT DEFAULT '🎯',
      notes TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // Goal links table
  db.execSync(`
    CREATE TABLE IF NOT EXISTS goal_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      goal_id INTEGER NOT NULL,
      link_type TEXT NOT NULL,
      asset_id INTEGER,
      category TEXT,
      manual_amount REAL DEFAULT 0,
      FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE,
      FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
    );
  `);

  // Essentials table
  db.execSync(`
    CREATE TABLE IF NOT EXISTS essentials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      label TEXT,
      target_amount REAL DEFAULT 0,
      current_amount REAL DEFAULT 0,
      provider TEXT,
      renewal_date TEXT,
      premium REAL DEFAULT 0,
      notes TEXT,
      updated_at TEXT NOT NULL
    );
  `);

  // Net worth snapshots table
  db.execSync(`
    CREATE TABLE IF NOT EXISTS net_worth_snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      snapshot_date TEXT NOT NULL UNIQUE,
      net_worth REAL NOT NULL,
      total_assets REAL DEFAULT 0,
      total_liabilities REAL DEFAULT 0
    );
  `);
}

