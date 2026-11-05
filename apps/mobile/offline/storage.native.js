import * as SQLite from 'expo-sqlite';
let connection;
async function db() {
  if (!connection) connection = (async () => { const d = await SQLite.openDatabaseAsync('fitpilot-development.db'); await d.execAsync('PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS state (key TEXT PRIMARY KEY, data TEXT NOT NULL)'); return d; })();
  return connection;
}
export async function read(key) { const row = await (await db()).getFirstAsync('SELECT data FROM state WHERE key=?', key); return row ? JSON.parse(row.data) : null; }
export async function mutate(key, update) {
  const d = await db(); let result;
  await d.withExclusiveTransactionAsync(async tx => {
    const row = await tx.getFirstAsync('SELECT data FROM state WHERE key=?', key);
    result = update(row ? JSON.parse(row.data) : null);
    await tx.runAsync('INSERT INTO state VALUES(?,?) ON CONFLICT(key) DO UPDATE SET data=excluded.data', key, JSON.stringify(result));
  }); return result;
}
