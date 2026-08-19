import { getDatabase } from "./connection";

// --- Helpers ---

// Recibe una objeto con keys (de la bbdd) y la transformar para tratar con ella
function mapRow(row) {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    colorTheme: row.color_theme,
    pinned: Boolean(row.pinned),
    favourite: Boolean(row.favourite),
    archived: Boolean(row.archived),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

const campos = {
  id: "id",
  title: "title",
  content: "content",
  colorTheme: "color_theme",
  pinned: "pinned",
  favourite: "favourite",
  archived: "archived",
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
};

const camposBooleanos = new Set(["pinned", "favourite", "archived"]);

// Solo convierte las keys presentes en el input.
function toDb(note) {
  const result = {};
  for (const key of Object.keys(note)) {
    const dbKey = campos[key];
    if (!dbKey) continue;
    const value = note[key];
    result[dbKey] = camposBooleanos.has(key) ? (value ? 1 : 0) : value;
  }
  return result;
}

function idGenerator() {
  return Date.now().toString() + Math.random();
}

export async function getActiveNotes() {
  const db = await getDatabase();

  const sql = `SELECT * FROM notes WHERE deleted_at IS NULL AND archived = 0 ORDER BY pinned DESC, updated_at DESC`;
  const rows = await db.getAllAsync(sql);

  const rowsConverted = rows.map(mapRow);

  return rowsConverted;
}

export async function getArchivedNotes() {
  const db = await getDatabase();
  const sql = `SELECT * FROM notes WHERE deleted_at IS NULL AND archived = 1 ORDER BY updated_at DESC`;
  const rows = await db.getAllAsync(sql);

  const rowsConverted = rows.map(mapRow);

  return rowsConverted;
}

export async function getDeletedNotes() {
  const db = await getDatabase();
  const sql = `SELECT * FROM notes WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC`;
  const rows = await db.getAllAsync(sql);

  const rowsConverted = rows.map(mapRow);

  return rowsConverted;
}

export async function getNoteById(id) {
  const db = await getDatabase();
  const sql = `SELECT * FROM notes WHERE id = ?`;
  const row = await db.getFirstAsync(sql, [id]);

  const rowConverted = row === null ? null : mapRow(row);

  return rowConverted;
}

export async function createNote(note) {
  const db = await getDatabase();
  const idGenerado = idGenerator();
  const date = Date.now();

  const newNote = {
    id: idGenerado,
    title: note.title || "",
    content: note.content || "",
    colorTheme: note.colorTheme || "black",
    pinned: note.pinned || false,
    favourite: note.favourite || false,
    archived: note.archived || false,
    createdAt: date,
    updatedAt: date,
    deletedAt: null,
  };

  const sql = `INSERT INTO notes (id, title, content, color_theme, pinned, favourite, archived, created_at, updated_at, deleted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const result = await db.runAsync(sql, Object.values(toDb(newNote)));

  return newNote;
}

export async function updateNote(id, campos) {
  const db = await getDatabase();

  const camposValidos = { ...campos };
  delete camposValidos.id;
  delete camposValidos.createdAt;
  delete camposValidos.updatedAt;

  const columnas = Object.keys(toDb(camposValidos));
  const valores = Object.values(toDb(camposValidos));
  const columnasSentencia = columnas.map((col) => `${col} = ?`).join(", ");

  const sql = `UPDATE notes SET ${columnasSentencia}, updated_at = ? WHERE id = ?`;
  await db.runAsync(sql, [...valores, Date.now(), id]);

  return getNoteById(id);
}

export async function softDeleteNote(id) {
  const db = await getDatabase();
  const sql = `UPDATE notes SET deleted_at = ? WHERE id = ?`;
  await db.runAsync(sql, [Date.now(), id]);

  return getNoteById(id);
}

export async function restoreNote(id) {
  const db = await getDatabase();
  const sql = `UPDATE notes SET deleted_at = NULL WHERE id = ?`;
  await db.runAsync(sql, id);

  return getNoteById(id);
}

export async function permanentDelete(id) {
  const db = await getDatabase();
  const sql = `DELETE FROM notes WHERE id= ?`;
  await db.runAsync(sql, id);
  return;
}

export async function deleteOldDeleted(maxTimeMs) {
    const db = await getDatabase();
    const limite = Date.now() - maxTimeMs;

    const sql = `DELETE FROM notes WHERE deleted_at IS NOT NULL AND deleted_at < ?`
    const result = await db.runAsync(sql, [limite]);

    return result.changes;    

}
