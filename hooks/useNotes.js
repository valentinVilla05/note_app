import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import {
  deleteOldDeleted,
  getActiveNotes,
  getAllReminders,
  getArchivedNotes,
  getDeletedNotes,
  getFolders,
  getHiddenNotes,
  getNoteById,
  getNotesByFolder,
  getNotesWhitoutFolder,
} from "../db/notesRepository";

export function useActiveNotes() {
  const [listaNotas, setListaNotas] = useState([]);

  const cargarNotas = useCallback(() => {
    getActiveNotes().then(setListaNotas);
  }, []);

  useFocusEffect(cargarNotas);

  return [listaNotas, cargarNotas];
}

export function useArchivedNotes() {
  const [listaArchivadas, setListaArchivadas] = useState([]);

  const cargarArchivadas = useCallback(() => {
    getArchivedNotes().then(setListaArchivadas);
  }, []);

  useFocusEffect(cargarArchivadas);

  return [listaArchivadas, cargarArchivadas];
}

export function useHiddenNotes() {
  const [listaOcultas, setListaOcultas] = useState([]);

  const cargarOcultas = useCallback(() => {
    getHiddenNotes().then(setListaOcultas);
  }, []);

  useFocusEffect(cargarOcultas);

  return [listaOcultas, cargarOcultas];
}

export function useDeletedNotes() {
  const [listaEliminadas, setListaEliminadas] = useState([]);

  const cargarEliminadas = useCallback(() => {
    deleteOldDeleted(2592000000)
      .then(() => getDeletedNotes())
      .then(setListaEliminadas);
  }, []);

  useFocusEffect(cargarEliminadas);

  return [listaEliminadas, cargarEliminadas];
}

export function useNote(id) {
  const [nota, setNota] = useState(null);

  const cargarNota = useCallback(() => {
    getNoteById(id).then(setNota);
  }, [id]);

  useFocusEffect(cargarNota);

  return [nota, cargarNota];
}

export function useFolders() {
  const [carpetas, setCarpetas] = useState([]);

  const cargarCarpetas = useCallback(() => {
    getFolders().then(setCarpetas);
  }, []);

  useFocusEffect(cargarCarpetas);

  return [carpetas, cargarCarpetas];
}

export function useNotesFromFolder(id) {
  const [notasCarpeta, setNotasCarpeta] = useState([]);

  const cargarNotasCarpeta = useCallback(() => {
    getNotesByFolder(id).then(setNotasCarpeta);
  }, [id]);

  useFocusEffect(cargarNotasCarpeta);

  return [notasCarpeta, cargarNotasCarpeta];
}

export function useNotesWithoutfolder() {
  const [notasLibres, setNotasLibres] = useState([]);

  const cargarNotasSinFolder = useCallback(() => {
    getNotesWhitoutFolder().then(setNotasLibres);
  }, []);

  useFocusEffect(cargarNotasSinFolder);

  return [notasLibres, cargarNotasSinFolder];
}

export function useReminders() {
  const [reminders, setReminders] = useState([]);
  const cargarRecordatorios = useCallback(() => {
    getAllReminders().then(setReminders);
  }, []);
  useFocusEffect(cargarRecordatorios);
  return [reminders, cargarRecordatorios];
}
