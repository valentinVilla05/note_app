import {
  View,
  Text,
  Animated,
  FlatList,
  Pressable,
  Modal,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  useFolders,
  useNotesFromFolder,
  useNotesWithoutfolder,
} from "../hooks/useNotes";
import { useState, useRef, useEffect } from "react";
import {
  Anadir,
  Cancelar,
  MeterEnCarpetaIcon,
  PapeleraIcon,
  SacarDeCarpetaIcon,
} from "./Icons";
import { NotaMenu } from "./NotaMenu";
import { coloresToolBar, coloresFondo } from "../data/utils";
import { softDeleteNote, updateNote } from "../db/notesRepository";
import { BotonEscribir } from "./BotonEscribir";

export const ContenidoCarpeta = (props, index) => {
  const idCarpeta = props.id;
  const nameCarpeta = props.name;
  const colorCarpeta = props.color;

  const [notasCarpeta, setNotasCarpeta] = useNotesFromFolder(idCarpeta);
  const [notasSinCarpeta, setNotasSinCarpeta] = useNotesWithoutfolder();
  const [mostrarMenuAnadir, setMostrarMenuAnadir] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [opacity, index]);

  const anadirNota = async (notaId) => {
    try {
      await updateNote(notaId, { folderId: idCarpeta });
      setNotasCarpeta();
      setNotasSinCarpeta();
    } catch (e) {
      console.error(e);
      alert("Error al añadir la nota");
    }
  };

  const [notasSeleccionadas, setNotasSeleccionadas] = useState([]);
  const [listaCarpetas, setListaCarpetas] = useFolders();
  const [mostrarListaCarpetas, setMostrarListaCarpetas] = useState(false);

  const moverNotas = async (listaNotas, folderId) => {
    try {
      for (const nota of notasSeleccionadas) {
        await updateNote(nota, { folderId: folderId });

        setNotasSeleccionadas([]);
        setNotasCarpeta();

        setMostrarListaCarpetas(false);
      }
    } catch (e) {
      alert("Error al mover las notas");
    }
  };
  const eliminarNotas = async (listaNotas) => {
    try {
      for (const nota of notasSeleccionadas) {
        await softDeleteNote(nota);

        setNotasSeleccionadas([]);
        setNotasCarpeta();
      }
    } catch (e) {
      alert("Error al mover las notas");
    }
  };
  const sacarNotas = async () => {
    try {
      for (const nota of notasSeleccionadas) {
        await updateNote(nota, { folderId: null });

        setNotasSeleccionadas([]);
        setNotasCarpeta();
      }
    } catch (e) {
      alert("Error al mover las notas");
    }
  };
  return (
    <>
      <Animated.View
        style={{
          flex: 1,
          opacity,
          backgroundColor: "#181818",
        }}
      >
        {notasCarpeta.length === 0 ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <Text
              style={{
                color: colorCarpeta == "black" ? "white" : "gray",
              }}
            >
              Aún no hay notas en esta carpeta
            </Text>
          </View>
        ) : (
          <View>
            {notasSeleccionadas.length > 0 ? (
              <View className="py-2 flex-row justify-between">
                <View className="flex-col items-center py">
                  <View className="w-[100%] my-3 flex-row justify-between items-center">
                    <Text className="text-white text-lg mx-5">
                      {notasSeleccionadas.length} notas marcadas:
                    </Text>
                    <Pressable
                      className="mx-7 active:bg-[#505050] rounded-md p-2"
                      hitSlop={10}
                      onPress={() => setNotasSeleccionadas([])}
                    >
                      <Cancelar size={30} />
                    </Pressable>
                  </View>
                  <View className="flex-row justify-around">
                    <Pressable
                      hitSlop={7}
                      className="mx-2 items-center justify-center bg-blue-400 active:bg-blue-600 p-2 rounded-md"
                      onPress={() => {
                        setListaCarpetas();
                        setMostrarListaCarpetas(true);
                      }}
                    >
                      <View className="flex-row items-center">
                        <MeterEnCarpetaIcon
                          color={"white"}
                          size={26}
                          className="me-3"
                        />
                        <Text className="text-white">Mover a:</Text>
                      </View>
                    </Pressable>
                    <Pressable
                      hitSlop={7}
                      className="mx-3 items-center justify-center  bg-blue-400 active:bg-blue-600 p-2 rounded-md"
                      onPress={() => sacarNotas(notasSeleccionadas)}
                    >
                      <View className="flex-row items-center">
                        <SacarDeCarpetaIcon color={"white"} className="me-3" />
                        <Text className="text-white">Sacar de la carpeta.</Text>
                      </View>
                    </Pressable>
                    <Pressable
                      hitSlop={7}
                      className="me-3 items-center justify-center bg-red-500 active:bg-red-700 p-2 rounded-md"
                      onPress={() => eliminarNotas(notasSeleccionadas)}
                    >
                      <View className="flex-row items-center">
                        <PapeleraIcon color={"white"} className="me-3" />
                        <Text className="text-white">Eliminar notas</Text>
                      </View>
                    </Pressable>
                  </View>
                </View>
              </View>
            ) : (
              <></>
            )}
            <FlatList
              numColumns={2}
              data={notasCarpeta}
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
                  onRefresh={setNotasCarpeta}
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
        <BotonEscribir folderId={idCarpeta} />
        <View
          className="absolute"
          style={{
            bottom: 120,
            right: 30,
          }}
        >
          <Pressable
            className="bg-[#e17f29] active:bg-[#cf701e] active:opacity-50 p-3 rounded-md"
            onPress={() => setMostrarMenuAnadir(true)}
          >
            <Text className="text-white text-sm">Añadir notas existentes</Text>
          </Pressable>
        </View>
      </Animated.View>
      <Modal
        visible={mostrarMenuAnadir}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMostrarMenuAnadir(false)}
      >
        <Pressable
          className="flex-1"
          onPress={() => {
            Keyboard.dismiss();
            setMostrarMenuAnadir(false);
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
                    Selecciona las notas a añadir:
                  </Text>
                  <Pressable
                    hitSlop={7}
                    onPress={() => setMostrarMenuAnadir(false)}
                  >
                    <Cancelar size={22} color={"white"} />
                  </Pressable>
                </View>
                {notasSinCarpeta.length == 0 ? (
                  <View className="justify-center items-center">
                    <Text className="text-white mt-10 mb-10">
                      No hay más notas que añadir en la carpeta
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    numColumns={1}
                    data={notasSinCarpeta}
                    style={{ flexShrink: 1 }}
                    keyExtractor={(nota) => String(nota.id)}
                    renderItem={({ item }) => (
                      <View
                        className="flex-row items-center justify-between p-3 m-1 rounded-lg"
                        style={{
                          backgroundColor:
                            coloresFondo[item.colorTheme] || "#383838",
                        }}
                      >
                        <Text
                          className="text-white font-medium flex-1 me-2"
                          numberOfLines={1}
                          style={{
                            color:
                              item.colorTheme == "black" ? "white" : "black",
                          }}
                        >
                          {item.title.length > 0 ? item.title : "Sin Titulo"}
                        </Text>
                        <Pressable
                          onPress={() => {
                            anadirNota(item.id);
                          }}
                        >
                          <Anadir color={"white"} size={22} />
                        </Pressable>
                      </View>
                    )}
                  />
                )}
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
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
                    renderItem={({ item, pressed }) =>
                      item.id == idCarpeta ? (
                        <></>
                      ) : (
                        <Pressable
                          hitSlop={7}
                          className="flex-1 flex-row items-center justify-between p-3 mb-3 rounded-lg"
                          style={{
                            backgroundColor: pressed
                              ? coloresFondo[item.color] || "#383838"
                              : coloresToolBar[item.color],
                          }}
                          onPress={() =>
                            moverNotas(notasSeleccionadas, item.id)
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
                      )
                    }
                  />
                )}
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </>
  );
};
