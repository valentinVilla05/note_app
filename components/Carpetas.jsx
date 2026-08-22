import {
  View,
  Text,
  FlatList,
  Animated,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  Keyboard,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import {
  Anadir,
  AnadirCarpeta,
  Cancelar,
  Carpeta,
  Circulo,
  EditarCarpeta,
  Escribir,
  Opciones,
  PapeleraIcon,
} from "./Icons";
import { Link } from "expo-router";
import { useFolders } from "../hooks/useNotes";
import { ContenidoCarpeta } from "./ContenidoCarpeta";
import {
  createFolder,
  deleteFolder,
  updateFolder,
} from "../db/notesRepository";
import { Modal } from "react-native";
import { TextInput } from "react-native";
import { coloresFondo, coloresToolBar } from "../data/utils";
import { KeyboardAvoidingView } from "react-native";

export function Carpetas({ onFolderDeleted }) {
  const [mostrarMenuCrear, setMostrarMenuCrear] = useState(false);

  const [mostrarMenuOpciones, setMostrarMenuOpciones] = useState(false);
  const [posicion, setPosicion] = useState({ top: 0, left: 0 });

  const [mostrarMenuEditar, setMostrarMenuEditar] = useState(false);

  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  const [carpetas, setCarpetas] = useFolders();

  const abrirModalCrear = (event) => {
    event.stopPropagation();

    const { pageX, pageY } = event.nativeEvent;
    const anchoMenu = 200;

    setMostrarMenuCrear(true);
  };

  const abrirModalEditar = (event) => {
    event.stopPropagation();

    const { pageX, pageY } = event.nativeEvent;
    const anchoMenu = 200;

    setMostrarMenuEditar(true);
  };

  const abrirModalOpciones = (event) => {
    event.stopPropagation();

    const { pageX, pageY } = event.nativeEvent;
    const anchoMenu = 140;

    setPosicion({
      top: pageY + 17,
      left: Math.max(10, pageX - anchoMenu - 20),
    });

    setMostrarMenuOpciones(true);
  };

  const [nombreCarpeta, setNombreCarpeta] = useState("");
  const [colorCarpeta, setColorCarpeta] = useState("#3F4754");

  const crearCarpeta = async () => {
    try {
      const nuevaCarpeta = await createFolder(nombreCarpeta, colorCarpeta);
      await setCarpetas();
      setNombreCarpeta("");
      setColorCarpeta("#3F4754");
      setMostrarMenuCrear(false);
    } catch (e) {
      alert("Error al crear la carpeta");
    }
  };

  const [idAEditar, setIdAEditar] = useState(null);
  const [nombreNuevo, setNombreNuevo] = useState("");
  const [colorNuevo, setColorNuevo] = useState("");

  const editarCarpeta = async (id) => {
    try {
      const carpetaEditada = await updateFolder(id, {
        name: nombreNuevo,
        color: colorNuevo,
      });
      await setCarpetas();
      setNombreNuevo("");
      setColorNuevo("");
      setIdAEditar(null);
      setIdAEliminar(null);
      setMostrarMenuEditar(false);
    } catch (e) {
      alert("Error al editar la carpeta");
    }
  };

  const [idAEliminar, setIdAEliminar] = useState(null);

  const eliminarCarpeta = async (id) => {
    try {
      const carpetaAEliminar = await deleteFolder(id);
      await setCarpetas();
      setIdAEliminar(null);
      onFolderDeleted?.();
    } catch (e) {
      alert("Error al eliminar la carpeta");
    }
  };

  return (
    <>
      <Animated.View style={{ flexShrink: 1, opacity, overflow: "hidden" }}>
        <View className=" bg-[#101010]" style={{ overflow: "hidden" }}>
          <Pressable
            hitSlop={7}
            onPress={abrirModalCrear}
            className="flex-row items-center mt-3 rounded-lg ms-4 me-4 min-h-[50px] min-w-[50px] bg-zinc-800"
          >
            <AnadirCarpeta className="me-3 ms-4" color={"white"} size={20} />
            <Text className="text-white">Crear Carpeta</Text>
          </Pressable>
          <FlatList
            data={carpetas}
            keyExtractor={(carpeta) => String(carpeta.id)}
            style={{ flexShrink: 1 }}
            contentContainerStyle={{ paddingBottom: 70 }}
            renderItem={({ item: carpetaItem }) => (
              <Link
                asChild
                href={{
                  pathname: "/carpeta",
                  params: {
                    id: carpetaItem.id,
                    name: carpetaItem.name,
                    color: carpetaItem.color,
                  },
                }}
              >
                <Pressable
                  className="flex-row items-center justify-between mt-3 rounded-lg ms-4 me-4 min-h-[50px] min-w-[50px]"
                  style={{
                    backgroundColor: coloresFondo[carpetaItem.color],
                  }}
                >
                  <View className="flex-row items-center ">
                    <Carpeta className="me-3 ms-4" size={20} color={"white"} />
                    <Text
                      style={{
                        color: carpetaItem.color == "black" ? "white" : "black",
                      }}
                    >
                      {carpetaItem.name}
                    </Text>
                  </View>
                  <Pressable
                    hitSlop={7}
                    className="me-3"
                    onPress={(event) => {
                      setIdAEditar(carpetaItem.id);
                      setIdAEliminar(carpetaItem.id);
                      setNombreNuevo(carpetaItem.name);
                      setColorNuevo(carpetaItem.color);
                      abrirModalOpciones(event);
                    }}
                  >
                    {carpetaItem.color == "white" ? (
                      <Opciones color={"gray"} />
                    ) : (
                      <Opciones color={"white"} />
                    )}
                  </Pressable>
                </Pressable>
              </Link>
            )}
          />
        </View>
      </Animated.View>

      {/* Modal de creacion de carpeta */}
      <Modal
        visible={mostrarMenuCrear}
        transparent={true}
        animationType="slide"
        setMostrarMenuCrear
        onRequestClose={() => setMostrarMenuCrear(false)}
      >
        <Pressable
          className="flex-1"
          onPress={() => {
            Keyboard.dismiss();
            setMostrarMenuCrear(false);
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <Pressable
                style={{ width: "100%", padding: 16 }}
                className="bg-[#2d2d2d] rounded-t-2xl"
                onPress={(e) => e.stopPropagation()}
              >
                <View className="flex-col">
                  <View className="m-4 flex-col">
                    <View className=" flex-row justify-end">
                      <Pressable
                        hitSlop={7}
                        onPress={() => setMostrarMenuCrear(false)}
                      >
                        <Cancelar size={22} color={"white"} />
                      </Pressable>
                    </View>
                    <Text className="text-white mt-3">
                      Escribe el nombre de la carpeta:
                    </Text>
                    <TextInput
                      className="bg-[#272727] mt-3 rounded-md"
                      placeholder="Listas..."
                      value={nombreCarpeta}
                      onChangeText={setNombreCarpeta}
                      style={{
                        color: "white",
                      }}
                    />
                  </View>
                  <View className="m-4 flex-col">
                    <Text className="text-white">
                      Escoge el color de la carpeta:
                    </Text>
                    <View className="flex-row mt-3 justify-center ">
                      {Object.keys(coloresFondo).map((color) => {
                        return (
                          <Pressable
                            className="h-14 w-16 items-center justify-center rounded-md"
                            key={color}
                            onPress={() => {
                              setColorCarpeta(color);
                            }}
                            style={{
                              backgroundColor:
                                color == colorCarpeta ? "#4F4F4F" : "#2d2d2d",
                            }}
                          >
                            <Circulo color={coloresFondo[color]} size={35} />
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                  <View>
                    <Pressable
                      className="h-10 m-3 bg-[#dc9a60] active:bg-[#c9772f] rounded-md justify-center items-center"
                      onPress={crearCarpeta}
                      disabled={nombreCarpeta.length <= 0}
                    >
                      <Text className="text-white">Crear carpeta</Text>
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>

      {/* Modal para editar carpeta */}
      <Modal
        visible={mostrarMenuEditar}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMostrarMenuEditar(false)}
      >
        <Pressable
          className="flex-1"
          onPress={() => {
            Keyboard.dismiss();
            setMostrarMenuEditar(false);
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <Pressable
                style={{ width: "100%", padding: 16 }}
                className="bg-[#2d2d2d] rounded-t-2xl"
                onPress={(e) => e.stopPropagation()}
              >
                <View className="flex-col">
                  <View className="m-4 flex-col">
                    <View className=" flex-row justify-end items-start">
                      <Pressable
                        hitSlop={7}
                        onPress={() => setMostrarMenuEditar(false)}
                      >
                        <Cancelar size={22} color={"white"} />
                      </Pressable>
                    </View>
                    <Text className="text-white mt-3">
                      Escribe el nombre de la carpeta:
                    </Text>
                    <TextInput
                      className="bg-[#272727] mt-3 rounded-md"
                      placeholder="Listas..."
                      value={nombreNuevo}
                      onChangeText={setNombreNuevo}
                      style={{
                        color: "white",
                      }}
                    />
                  </View>
                  <View className="m-4 flex-col">
                    <Text className="text-white">
                      Escoge el color de la carpeta:
                    </Text>
                    <View className="flex-row mt-3 justify-center ">
                      {Object.keys(coloresFondo).map((color) => {
                        return (
                          <Pressable
                            className="h-14 w-16 items-center justify-center rounded-md"
                            key={color}
                            onPress={() => {
                              setColorNuevo(color);
                            }}
                            style={{
                              backgroundColor:
                                color == colorNuevo ? "#4F4F4F" : "#2d2d2d",
                            }}
                          >
                            <Circulo color={coloresFondo[color]} size={35} />
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                  <View>
                    <Pressable
                      className="h-10 m-3 bg-[#dc9a60] active:bg-[#c9772f] rounded-md justify-center items-center"
                      onPress={() => {
                        editarCarpeta(idAEditar);
                      }}
                      disabled={nombreNuevo.length <= 0}
                    >
                      <Text className="text-white">Editar carpeta</Text>
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>

      <Modal
        visible={mostrarMenuOpciones}
        transparent={true}
        animationType="none"
        onRequestClose={() => setMostrarMenuOpciones(false)}
      >
        <Pressable
          className="flex-1"
          onPress={() => setMostrarMenuOpciones(false)}
        >
          <Pressable
            style={{
              position: "absolute",
              top: posicion.top,
              left: posicion.left,
            }}
            className="bg-[#2d2d2d] w-[180px] rounded-xl p-1 border border-gray-700 shadow-2xl z-50"
            onPress={(e) => e.stopPropagation()}
          >
            <Pressable
              className="p-2 rounded-lg active:bg-[#3d3d3d] flex-row items-center"
              onPress={() => {
                setMostrarMenuOpciones(false);
                setMostrarMenuEditar(true);
              }}
            >
              <EditarCarpeta color={"white"} size={20} className="me-2" />
              <Text className="text-white">Editar carpeta</Text>
            </Pressable>
            <Pressable
              className="p-2 rounded-lg active:bg-[#3d3d3d] flex-row items-center"
              onPress={() => {
                eliminarCarpeta(idAEliminar);
                setMostrarMenuOpciones(false);
              }}
            >
              <PapeleraIcon color={"white"} size={20} className="me-2" />
              <Text className="text-red-500">Eliminar carpeta</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

export function AnimatedFolderss() {
  return <Carpetas />;
}
