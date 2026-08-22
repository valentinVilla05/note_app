import { View, Text, FlatList, Pressable } from "react-native";
import { useState } from "react";
import { NotasEliminadas } from "./NotasEliminadas";
import { useDeletedNotes } from "../hooks/useNotes";
import { permanentDelete, restoreNote } from "../db/notesRepository";
import { Cancelar, PapeleraIcon, RestaurarIcon } from "./Icons";

export function PapeleraMain() {
  const [notasPapelera, refreshPapelera] = useDeletedNotes();

  const [notasSeleccionadas, setNotasSeleccionadas] = useState([]);

  const restaurarNotas = async (id) => {
    for (let i = 0; i < notasSeleccionadas.length; i++) {
      await restoreNote(notasSeleccionadas[i]);
    }
    setNotasSeleccionadas([]);
    refreshPapelera();
  };

  const eliminarPermanentemente = async (id) => {
    for (let i = 0; i < notasSeleccionadas.length; i++) {
      await permanentDelete(notasSeleccionadas[i]);
    }
    setNotasSeleccionadas([]);
    refreshPapelera();
  };

  const vaciarPapelera = async () => {
    try {
      for (const nota of notasPapelera) {
        await permanentDelete(nota.id);
      }
      refreshPapelera();
    } catch (e) {
      alert("Error al vaciar la papelera");
    }
  };

  return (
    <View className="flex-1 bg-['#181818'] items-center justify-center">
      {notasPapelera.length === 0 ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ color: "#717171" }}>No hay notas en la papelera.</Text>
        </View>
      ) : (
        <View>
          {notasSeleccionadas.length > 0 ? (
            <View className="py-2 flex-row justify-between">
              <View className="flex-row items-center">
                <Text className="text-white mx-2">
                  {notasSeleccionadas.length} notas marcadas:
                </Text>
                <Pressable
                  hitSlop={7}
                  className="mx-2 items-center justify-center bg-green-400 active:bg-green-600 p-2 rounded-md"
                  onPress={() => {
                    restaurarNotas(notasSeleccionadas);
                  }}
                >
                  <View className="flex-row items-center">
                    <RestaurarIcon color={"white"} size={26} className="me-3" />
                    <Text className="text-white">Restaurar</Text>
                  </View>
                </Pressable>

                <Pressable
                  hitSlop={7}
                  className="mx-3 items-center justify-center bg-red-500 active:bg-red-700 p-2 rounded-md"
                  onPress={() => eliminarPermanentemente(notasSeleccionadas)}
                >
                  <View className="flex-row items-center">
                    <PapeleraIcon color={"white"} className="me-3" />
                    <Text className="text-white">Eliminar perm.</Text>
                  </View>
                </Pressable>
              </View>
              <Pressable
                className="me-3"
                hitSlop={7}
                onPress={() => setNotasSeleccionadas([])}
              >
                <Cancelar size={30} />
              </Pressable>
            </View>
          ) : (
            <></>
          )}
          <FlatList
            numColumns={2}
            data={notasPapelera}
            keyExtractor={(nota) => String(nota.id)}
            renderItem={({ item }) => (
              <NotasEliminadas
                id={item.id}
                title={item.title}
                content={item.content}
                favourite={item.favourite}
                pinned={item.pinned}
                colorTheme={item.colorTheme}
                seleccionada={notasSeleccionadas.includes(item.id)}
                onRefresh={refreshPapelera}
                onNotaSeleccionada={() => {
                  if (notasSeleccionadas.includes(item.id)) {
                    setNotasSeleccionadas(
                      notasSeleccionadas.filter((id) => id !== item.id),
                    );
                  } else {
                    setNotasSeleccionadas([...notasSeleccionadas, item.id]);
                  }
                }}
              />
            )}
          />

          <Pressable hitSlop={7}
            className="absolute bottom-10 left-44 bg-red-500 active:bg-red-700 p-3 rounded-md"
            onPress={() => vaciarPapelera()}
          >
            <View className=" flex-row items-center">
              <PapeleraIcon className="me-4" />
              <Text className="text-white">Vaciar papelera</Text>
            </View>
          </Pressable>
        </View>
      )}
    </View>
  );
}
