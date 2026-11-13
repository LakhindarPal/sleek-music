import type { SQLiteDatabase } from "expo-sqlite";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = 'wal';
    CREATE TABLE IF NOT EXISTS favourites (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT,
      type TEXT CHECK (type IN ('song', 'album', 'artist', 'playlist', 'mix')),
      perma_url TEXT NOT NULL,
      image TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_media_type ON favourites(type);
  `);
}
