import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import {
  deleteOldDeleted,
  getActiveNotes,
  getArchivedNotes,
  getDeletedNotes,
  getNoteById,
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
