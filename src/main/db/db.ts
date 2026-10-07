// src/main/db.ts
import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import { existsSync, mkdirSync, copyFileSync } from 'fs'
import seedDb from '../../../resources/pos_system.db?asset'

const dbDir = join(app.getPath('userData'), 'data')
const dbPath = join(dbDir, 'pos_system.db')

mkdirSync(dbDir, { recursive: true })

if (!existsSync(dbPath)) copyFileSync(seedDb, dbPath)

export const db: Database.Database = new Database(dbPath)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

const columns = db.prepare('PRAGMA table_info(products)').all() as { name: string }[]
if (!columns.some((c) => c.name === 'Stock')) {
  db.exec('ALTER TABLE products ADD COLUMN Stock INTEGER DEFAULT 0')
  db.exec('UPDATE products SET Stock = ABS(RANDOM() % 120) + 1')
}

app.on('before-quit', () => db.close())
