import * as SQLite from "expo-sqlite"

const DB_NAME = "notas.db";
let dbInstance = null;


// Abrimos la base de datos
export async function getDatabase() {
    if (dbInstance !== null) return dbInstance; // Si ya hay alguna instancia la devolvemos

    dbInstance = await SQLite.openDatabaseAsync(DB_NAME); // En caso de que no la haya, establecemos la conexion
    await dbInstance.execAsync("PRAGMA journal_mode= WAL;")
    await dbInstance.execAsync("PRAGMA foreign_keys = ON;");
    return dbInstance;
}

// Cerramos la base de datos
export async function closeDatabase() {
    if(!dbInstance) return; // Si no hay ninguna instancia no hacemos nada
    
    await dbInstance.closeAsync(); // Si la hay la cerramos
    dbInstance = null;
}