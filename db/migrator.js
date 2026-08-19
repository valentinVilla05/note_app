import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase } from "./connection";
import { runMigrations } from "./migrations";
import { toDb } from "./notesRepository";

const MIGRATION_FLAG = "@migrated_to_sqlite_v1";
const NOTES_KEY = "notas";
const TRASH_KEY = "papelera";

export async function migrateFromAsyncStorage() {
  try {
    const flag = await AsyncStorage.getItem(MIGRATION_FLAG);
    if (flag) return;

    await runMigrations();

    const notasRaw = await AsyncStorage.getItem(NOTES_KEY);
    const papeleraRaw = await AsyncStorage.getItem(TRASH_KEY);

    const notasAntiguas = parseList(notasRaw);
    const papeleraAntigua = parseList(papeleraRaw);

    if (notasAntiguas.length === 0 && papeleraAntigua.length === 0) {
      await AsyncStorage.setItem(MIGRATION_FLAG, "true");
      return;
    }

    const todasLasNotas = [
      ...notasAntiguas.map((n) => mapNotaAntigua(n, false)),
      ...papeleraAntigua.map((n) => mapNotaAntigua(n, true)),
    ];

    const db = await getDatabase();
    await db.withTransactionAsync(async () => {
      for (const nota of todasLasNotas) {
        const dbNota = toDb(nota);
        const cols = Object.keys(dbNota);
        const vals = Object.values(dbNota);
        const placeholders = cols.map(() => "?").join(", ");
        const sql = `INSERT INTO notes (${cols.join(", ")}) VALUES (${placeholders})`;
        await db.runAsync(sql, vals);
      }
    });

    await AsyncStorage.removeItem(NOTES_KEY);
    await AsyncStorage.removeItem(TRASH_KEY);
    await AsyncStorage.setItem(MIGRATION_FLAG, "true");

    console.log(
      `[Migrator] migradas ${todasLasNotas.length} notas (${notasAntiguas.length} activas + ${papeleraAntigua.length} papelera)`,
    );
  } catch (e) {
    console.error("[Migrator] error:", e);
  }
}

function parseList(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function toTimestamp(value, fallback) {
  if (value == null || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function mapNotaAntigua(old, isDeleted) {
  const now = Date.now();
  const createdAt = toTimestamp(old.date, now);
  const updatedAt = toTimestamp(old.lastUpdate, createdAt);
  const deletedAt = isDeleted ? toTimestamp(old.deleteDate, now) : null;

  return {
    id: old.id,
    title: old.title || "",
    content: old.text || "",
    colorTheme: old.colorTheme || "black",
    pinned: !!old.pinned,
    favourite: !!old.favourite,
    archived: !!old.archived,
    createdAt,
    updatedAt,
    deletedAt,
  };
}