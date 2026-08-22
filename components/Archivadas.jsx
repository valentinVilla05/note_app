import { View, Text, Pressable } from "react-native";
import { NotaMenu } from "./NotaMenu";
import { FlatList } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Screen } from "./Screen";
import { useArchivedNotes } from "../hooks/useNotes";
import { Anadir, Archivado, PapeleraIcon, Cancelar } from "./Icons";
import { softDeleteNote, updateNote } from "../db/notesRepository";

export const Archivadas = () => {
  const opacity = useRef(new Animated.Value(0)).current;

  const [notasArchivadas, setNotasArchivadas] = useArchivedNotes();

  useEffect(() => {
    Animated.timing(opacity, {
      duration: 400,
      toValue: 1,
      delay: 300,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  const [notasSeleccionadas, setNotasSeleccionadas] = useState([]);

  const desarchivarNotas = async (listaId) => {
    try {
      for (const nota of notasSeleccionadas) {
        await updateNote(nota, { archived: false });
      }
      setNotasArchivadas();
      setNotasSeleccionadas([]);
    } catch (e) {
      alert("Error al desarchivar las notas");
    }
  };

  const eliminarNotas = async (listaId) => {
      try {
        for (const nota of notasSeleccionadas) {
          await softDeleteNote(nota);
        }
        setNotasArchivadas();
        setNotasSeleccionadas([])
      } catch (e) {
        alert("Error al eliminar la nota");
      }
    };
  return (
    <SafeAreaProvider>
      <Screen>
        <Animated.View style={{ flex: 1, opacity }}>
          {notasArchivadas.length === 0 ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Anadir />
              <Text style={{ color: "#717171" }}>No hay notas archivadas</Text>
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
                      className="mx-2 items-center justify-center bg-blue-400 active:bg-blue-600 p-2 rounded-md"
                      onPress={() => {
                        desarchivarNotas(notasSeleccionadas);
                      }}
                    >
                      <View className="flex-row items-center">
                        <Archivado color={"white"} size={26} className="me-3" />
                        <Text className="text-white">Desarchivar:</Text>
                      </View>
                    </Pressable>

                    <Pressable
                      hitSlop={7}
                      className="mx-3 items-center justify-center bg-red-500 active:bg-red-700 p-2 rounded-md"
                      onPress={() => eliminarNotas(notasSeleccionadas)}
                    >
                      <View className="flex-row items-center">
                        <PapeleraIcon color={"white"} className="me-3" />
                        <Text className="text-white">Eliminar notas.</Text>
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
                data={notasArchivadas}
                keyExtractor={(nota) => String(nota.id)}
                renderItem={({ item }) => (
                  <NotaMenu
                    id={item.id}
                    title={item.title}
                    content={item.content}
                    favourite={item.favourite}
                    pinned={item.pinned}
                    colorTheme={item.colorTheme}
                    archived={item.archived}
                    hidden={item.hidden}
                    seleccionada={notasSeleccionadas.includes(item.id)}
                    onRefresh={setNotasArchivadas}
                    onNotaSeleccionada={() => {
                      if (notasSeleccionadas.includes(item.id)) {
                        setNotasSeleccionadas(
                          notasSeleccionadas.filter((id) => id !== item.id),
                        );
                      } else {
                        setNotasSeleccionadas([...notasSeleccionadas, item.id]);
                      }
                    }}
                  ></NotaMenu>
                )}
              />
            </View>
          )}
        </Animated.View>
      </Screen>
    </SafeAreaProvider>
  );
};

export function AnimatedArchives() {
  return <Archivadas />;
}
