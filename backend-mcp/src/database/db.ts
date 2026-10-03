import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { envConfig } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_DB_DIR = path.resolve(__dirname, '../../data');
const DEFAULT_DB_PATH = path.join(DEFAULT_DB_DIR, 'curavip.db');

let dbInstance: DatabaseSync | null = null;
let resolvedPath: string | null = null;

function resolveDatabasePath(): string {
  if (envConfig.DB_PATH) return envConfig.DB_PATH;
  if (process.env.VITEST || process.env.NODE_ENV === 'test') return ':memory:';
  return DEFAULT_DB_PATH;
}

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS vip_profiles (
    id TEXT PRIMARY KEY NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL,
    organization TEXT NOT NULL,
    city TEXT NOT NULL,
    budget_limit_usd REAL NOT NULL CHECK (budget_limit_usd >= 0),
    raw_bio TEXT NOT NULL DEFAULT '',
    explicit_interests_json TEXT NOT NULL DEFAULT '[]',
    taboos_json TEXT NOT NULL DEFAULT '{"alcohol":false,"dietary":[],"religiousCultural":[]}',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS dossier_records (
    id TEXT PRIMARY KEY NOT NULL,
    vip_id TEXT NOT NULL,
    dossier_json TEXT NOT NULL,
    is_bookmarked INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    FOREIGN KEY (vip_id) REFERENCES vip_profiles(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS curation_history (
    id TEXT PRIMARY KEY NOT NULL,
    vip_id TEXT NOT NULL,
    item_type TEXT NOT NULL CHECK (item_type IN ('gift', 'dining')),
    item_name TEXT NOT NULL,
    awarded_at TEXT NOT NULL,
    FOREIGN KEY (vip_id) REFERENCES vip_profiles(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS reservation_orders (
    id TEXT PRIMARY KEY NOT NULL,
    vip_id TEXT NOT NULL,
    order_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (vip_id) REFERENCES vip_profiles(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_dossier_vip_created ON dossier_records(vip_id, created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_history_vip ON curation_history(vip_id, awarded_at DESC);
  CREATE INDEX IF NOT EXISTS idx_orders_vip ON reservation_orders(vip_id, created_at DESC);
`;

/**
 * Opens the SQLite database (file-backed in runtime, in-memory under Vitest) and applies the schema.
 */
export function initDB(): DatabaseSync {
  if (dbInstance) return dbInstance;

  const dbPath = resolveDatabasePath();
  if (dbPath !== ':memory:') {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  }

  const db = new DatabaseSync(dbPath);
  if (dbPath !== ':memory:') {
    db.exec('PRAGMA journal_mode = WAL;');
    db.exec('PRAGMA synchronous = NORMAL;');
  }
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec(SCHEMA_SQL);

  dbInstance = db;
  resolvedPath = dbPath;
  if (!process.env.VITEST) {
    console.log(`[SQLite] CuraVIP vault ready at ${dbPath === ':memory:' ? 'in-memory' : dbPath}`);
  }
  return db;
}

export function getDatabase(): DatabaseSync {
  return dbInstance ?? initDB();
}

export function getDatabasePath(): string | null {
  return resolvedPath;
}

/**
 * Runs `work` inside a transaction, rolling back on any thrown error.
 */
export function withTransaction<T>(work: (db: DatabaseSync) => T): T {
  const db = getDatabase();
  db.exec('BEGIN');
  try {
    const result = work(db);
    db.exec('COMMIT');
    return result;
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

export function closeDB(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
    resolvedPath = null;
  }
}

process.once('exit', () => closeDB());