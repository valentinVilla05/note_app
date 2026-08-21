import { getDatabase } from "./connection";

// --- Helpers ---

// Recibe una objeto con keys (de la bbdd) y la transformar para tratar con ella
function mapRowNote(row) {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    folderId: row.folder_id,
    colorTheme: row.color_theme,
    pinned: Boolean(row.pinned),
    favourite: Boolean(row.favourite),
    archived: Boolean(row.archived),
    hidden: Boolean(row.hidden),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

function mapRowFolder(row) {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const camposNota = {
  id: "id",
  title: "title",
  content: "content",
  folderId: "folder_id",
  colorTheme: "color_theme",
  pinned: "pinned",
  favourite: "favourite",
  archived: "archived",
  hidden: "hidden",
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: "deleted_at",
};

const camposFolder = {
  id: "id",
  name: "name",
  color: "color",
  createdAt: "created_at",
  updatedAt: "updated_at",
};

const camposBooleanos = new Set(["pinned", "favourite", "archived", "hidden"]);

// Solo convierte las keys presentes en el input.
export function toDbNote(note) {
  const result = {};
  for (const key of Object.keys(note)) {
    const dbKey = camposNota[key];
    if (!dbKey) continue;
    const value = note[key];
    result[dbKey] = camposBooleanos.has(key) ? (value ? 1 : 0) : value;
  }
  return result;
}

export function toDbFolder(folder) {
  const result = {};
  for (const key of Object.keys(folder)) {
    const dbKey = camposFolder[key];
    if (!dbKey) continue;
    result[dbKey] = folder[key];
  }
  return result;
}

function idGenerator() {
  return Date.now().toString() + Math.random();
}

export async function getActiveNotes() {
  const db = await getDatabase();

  const sql = `SELECT * FROM notes WHERE deleted_at IS NULL AND archived = 0 AND hidden = 0 ORDER BY pinned DESC, updated_at DESC`;
  const rows = await db.getAllAsync(sql);

  const rowsConverted = rows.map(mapRowNote);

  return rowsConverted;
}

export async function getArchivedNotes() {
  const db = await getDatabase();
  const sql = `SELECT * FROM notes WHERE deleted_at IS NULL AND archived = 1 ORDER BY updated_at DESC`;
  const rows = await db.getAllAsync(sql);

  const rowsConverted = rows.map(mapRowNote);

  return rowsConverted;
}

export async function getHiddenNotes() {
  const db = await getDatabase();
  const sql = `SELECT * FROM notes WHERE deleted_at IS NULL AND hidden = 1 ORDER BY updated_at DESC`;
  const rows = await db.getAllAsync(sql);

  const rowsConverted = rows.map(mapRowNote);

  return rowsConverted;
}

export async function getDeletedNotes() {
  const db = await getDatabase();
  const sql = `SELECT * FROM notes WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC`;
  const rows = await db.getAllAsync(sql);

  const rowsConverted = rows.map(mapRowNote);

  return rowsConverted;
}

export async function getNoteById(id) {
  const db = await getDatabase();
  const sql = `SELECT * FROM notes WHERE id = ?`;
  const row = await db.getFirstAsync(sql, [id]);

  const rowConverted = row === null ? null : mapRowNote(row);

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
    folderId: note.folderId || null,
    colorTheme: note.colorTheme || "black",
    pinned: note.pinned || false,
    favourite: note.favourite || false,
    archived: note.archived || false,
    hidden: note.hidden || false,
    createdAt: date,
    updatedAt: date,
    deletedAt: null,
  };

  const sql = `INSERT INTO notes (id, title, content, folder_id, color_theme, pinned, favourite, archived, hidden, created_at, updated_at, deleted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const result = await db.runAsync(sql, Object.values(toDbNote(newNote)));

  return newNote;
}

export async function updateNote(id, campos) {
  const db = await getDatabase();

  const camposValidos = { ...campos };
  delete camposValidos.id;
  delete camposValidos.createdAt;
  delete camposValidos.updatedAt;

  const columnas = Object.keys(toDbNote(camposValidos));
  const valores = Object.values(toDbNote(camposValidos));
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

  const sql = `DELETE FROM notes WHERE deleted_at IS NOT NULL AND deleted_at < ?`;
  const result = await db.runAsync(sql, [limite]);

  return result.changes;
}

export async function createFolder(folder) {
  const db = await getDatabase();
  const idGenerado = idGenerator();

  const newFolder = {
    id: idGenerado,
    name: folder.name,
    color: folder.color,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const sql = `INSERT INTO folders (id, name, color, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`;
  const result = await db.runAsync(sql, Object.values(toDbFolder(newFolder)));

  return newFolder;
}

export async function getFolders() {
  const db = await getDatabase();

  const sql = `SELECT * FROM folders`;
  const folders = await db.getAllAsync(sql);

  const foldersConverted = folders.map(mapRowFolder);

  return foldersConverted;
}

export async function getFolderById(id) {
  const db = await getDatabase();

  const sql = `SELECT * FROM folders WHERE id = ?`;
  const folder = await db.getFirstAsync(sql, id);

  const folderConverted = folder === null ? null : mapRowFolder(folder);

  return folderConverted;
}

export async function getNotesByFolder(id) {
  const db = await getDatabase();

  const sql =
    id === null
      ? `SELECT * FROM notes WHERE folder_id IS NULL AND deleted_at IS NULL ORDER BY pinned DESC, updated_at DESC`
      : `SELECT * FROM notes WHERE folder_id = ? AND deleted_at IS NULL ORDER BY pinned DESC, updated_at DESC`;
  const params = id === null ? [] : [id];
  const rows = await db.getAllAsync(sql, params);
  return rows.map(mapRowNote);
}

export async function updateFolder(id, campos) {
  const db = await getDatabase();
  const camposValidos = { ...campos };
  delete camposValidos.id;
  delete camposValidos.createdAt;
  delete camposValidos.updatedAt;

  const columnas = Object.keys(toDbFolder(camposValidos));
  const valores = Object.values(toDbFolder(camposValidos));
  const columnasSentencia = columnas.map((col) => `${col} = ?`).join(", ");

  const sql = `UPDATE folders SET ${columnasSentencia}, updated_at = ? WHERE id = ?`;
  await db.runAsync(sql, [...valores, Date.now(), id]);

  return getFolderById(id);
}

export async function deleteFolder(id) {
  const db = await getDatabase();
  await db.runAsync(`UPDATE notes SET folder_id = NULL WHERE folder_id = ?`, [
    id,
  ]);
  const sql = `DELETE FROM folders WHERE id = ?`;
  await db.runAsync(sql, id);

  return;
}
