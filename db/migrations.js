import { getDatabase } from "./connection";

const MIGRATIONS = [
  {
    version: 1,
    up: async (db) => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS notes (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL DEFAULT '',
          content TEXT NOT NULL DEFAULT '',
          color_theme TEXT NOT NULL DEFAULT 'black',
          pinned INTEGER NOT NULL DEFAULT 0,
          favourite INTEGER NOT NULL DEFAULT 0,
          archived INTEGER NOT NULL DEFAULT 0,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL,
          deleted_at INTEGER
        );

        CREATE INDEX IF NOT EXISTS idx_notes_active ON notes(deleted_at, archived, pinned DESC, updated_at DESC);

        CREATE INDEX IF NOT EXISTS idx_notes_archived ON notes(deleted_at, archived);

        CREATE INDEX IF NOT EXISTS idx_notes_deleted ON notes (deleted_at);
      `);
    },
  },
  {
    version: 2,
    up: async (db) => {
      const cols = await db.getAllAsync(`PRAGMA table_info(notes)`);
      const yaTieneHidden = cols.some((c) => c.name === "hidden");
      if (!yaTieneHidden) {
        await db.execAsync(
          `ALTER TABLE notes ADD COLUMN hidden INTEGER NOT NULL DEFAULT 0;`,
        );
      }

      const indices = await db.getAllAsync(
        `SELECT name FROM sqlite_master WHERE type='index' AND name='idx_notes_hidden'`,
      );
      if (indices.length === 0) {
        await db.execAsync(
          `CREATE INDEX IF NOT EXISTS idx_notes_hidden ON notes(deleted_at, hidden)`,
        );
      }
    },
  },
];

export async function runMigrations() {
  const db = await getDatabase(); // Conseguimos la base de datos
  const result = await db.getFirstAsync("PRAGMA user_version"); 
  const currentVersion = result?.user_version ?? 0; // Comprobamos la version actual

  for (const migration of MIGRATIONS) { // Recorremos las migraciones
    if(migration.version > currentVersion) { 
      await db.withTransactionAsync(async () => { // Nos aseguramos que la migracion se aplique bien entera o no se aplique nada
        await migration.up(db);
        await db.execAsync(`PRAGMA user_version = ${migration.version}`); // Actualiza la versión
      })
    }
  }
}
