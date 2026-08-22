import {
  View,
  Text,
  FlatList,
  Animated,
  StyleSheet,
  Pressable,
  Modal,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { NotaMenu } from "./NotaMenu";
import { Anadir, Cancelar, MeterEnCarpetaIcon, PapeleraIcon } from "./Icons";
import { Link } from "expo-router";
import {
  useActiveNotes,
  useFolders,
  useNotesWithoutfolder,
} from "../hooks/useNotes";
import { softDeleteNote, updateNote } from "../db/notesRepository";
import { coloresToolBar } from "../data/utils";

export function Notas({ index }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      delay: index * 1000,
      useNativeDriver: true,
    }).start();
  }, [opacity, index]);

  const [notas, refreshNotas] = useNotesWithoutfolder();

  const [listaCarpetas, setListaCarpetas] = useFolders();
  const [notasSeleccionadas, setNotasSeleccionadas] = useState([]);
  const [mostrarListaCarpetas, setMostrarListaCarpetas] = useState(false);

  const anadirNotasACarpeta = async (listaIds, idCarpeta) => {
    try {
      for (let i = 0; i < notasSeleccionadas.length; i++) {
        await updateNote(notasSeleccionadas[i], { folderId: idCarpeta });
      }
      setNotasSeleccionadas([]);
      setMostrarListaCarpetas(false);
      refreshNotas();
    } catch (e) {
      alert("Error al añadir nota en carpeta");
    }
  };

  const eliminarNotas = async (listaId) => {
    try {
      for (let i = 0; i < notasSeleccionadas.length; i++) {
        await softDeleteNote(notasSeleccionadas[i]);
      }
      setNotasSeleccionadas([]);
      refreshNotas();
    } catch (e) {
      alert("Error al eliminar la nota");
    }
  };

  return (
    <>
      <Animated.View style={{ flex: 1, opacity }}>
        {notas.length === 0 ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Anadir />
            <Text style={{ color: "#717171" }}>
              Aún no tienes notas escritas.
            </Text>
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
                      setListaCarpetas();
                      setMostrarListaCarpetas(true)
                    }}
                  >
                    <View className="flex-row items-center">
                      <MeterEnCarpetaIcon
                        color={"white"}
                        size={26}
                        className="me-3"
                      />
                      <Text className="text-white">Añadir a:</Text>
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
              data={notas}
              keyExtractor={(nota) => String(nota.id)}
              renderItem={({ item }) => (
                <NotaMenu
                  id={item.id}
                  title={item.title}
                  content={item.content}
                  folderId={item.folderId}
                  favourite={item.favourite}
                  pinned={item.pinned}
                  colorTheme={item.colorTheme}
                  archived={item.archived}
                  hidden={item.hidden}
                  seleccionada={notasSeleccionadas.includes(item.id)}
                  onRefresh={refreshNotas}
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
          </View>
        )}
      </Animated.View>
      <Modal
        visible={mostrarListaCarpetas}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMostrarListaCarpetas(false)}
      >
        <Pressable
          className="flex-1"
          onPress={() => {
            Keyboard.dismiss();
            setMostrarListaCarpetas(false);
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <Pressable
                style={{ width: "100%", padding: 16, maxHeight: "80%" }}
                className="bg-[#2d2d2d] rounded-t-2xl"
                onPress={(e) => e.stopPropagation()}
              >
                <View className=" flex-row justify-between">
                  <Text className="text-white text-lg font-semibold mb-4">
                    Selecciona la carpeta:
                  </Text>
                  <Pressable
                    hitSlop={7}
                    onPress={() => setMostrarListaCarpetas(false)}
                  >
                    <Cancelar size={22} color={"white"} />
                  </Pressable>
                </View>
                {listaCarpetas.length == 0 ? (
                  <View className="justify-center items-center">
                    <Text className="text-white mt-10 mb-10">
                      No hay carpetas a las que añadir esta nota.
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    numColumns={1}
                    data={listaCarpetas}
                    keyExtractor={(carpeta) => String(carpeta.id)}
                    renderItem={({ item, pressed }) => (
                      <Pressable
                        hitSlop={7}
                        className="flex-1 flex-row items-center justify-between p-3 mb-3 rounded-lg"
                        style={{
                          backgroundColor: pressed
                            ? coloresFondo[item.color] || "#383838"
                            : coloresToolBar[item.color],
                        }}
                        onPress={() =>
                          anadirNotasACarpeta(notasSeleccionadas, item.id)
                        }
                      >
                        <Text
                          className="text-white font-medium flex-1 me-2"
                          numberOfLines={1}
                          style={{
                            color: item.color == "black" ? "white" : "black",
                          }}
                        >
                          {item.name.length > 0 ? item.name : "Sin Titulo"}
                        </Text>
                      </Pressable>
                    )}
                  />
                )}
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </>
  );
}

export function AnimatedNotes() {
  return <Notas />;
}
