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
import { Anadir, AnadirCarpeta, Carpeta, Circulo } from "./Icons";
import { Link } from "expo-router";
import { useFolders } from "../hooks/useNotes";
import { ContenidoCarpeta } from "./ContenidoCarpeta";
import { createFolder } from "../db/notesRepository";
import { Modal } from "react-native";
import { TextInput } from "react-native";
import { coloresFondo, coloresToolBar } from "../data/utils";
import { KeyboardAvoidingView } from "react-native";

export function Carpetas() {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 350,
      delay: 350,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  const [carpetas, setCarpetas] = useFolders();

  const abrirModal = (event) => {
    event.stopPropagation();

    const { pageX, pageY } = event.nativeEvent;
    const anchoMenu = 200;

    setMostrarMenu(true);
  };

  const [nombreCarpeta, setNombreCarpeta] = useState("");
  const [colorCarpeta, setColorCarpeta] = useState("#3F4754");

  const crearCarpeta = async () => {
    try {
      const nuevaCarpeta = await createFolder(nombreCarpeta, colorCarpeta);
      await setCarpetas();
      setNombreCarpeta("");
      setColorCarpeta("#3F4754");
      setMostrarMenu(false);
    } catch (e) {
      alert("Error al crear la carpeta");
    }
  };

  return (
    <>
      <Animated.View style={{ flex: 1, opacity, overflow: "hidden" }}>
        <View className="flex-1 pb-3 bg-[#101010]" style={{ overflow: "hidden" }}>
          <Pressable
            hitSlop={7}
            onPress={abrirModal}
            className="flex-row items-center mt-3 rounded-lg ms-4 me-4 min-h-[50px] min-w-[50px] bg-zinc-800"
          >
            <AnadirCarpeta className="me-3 ms-4" color={"white"} size={20} />
            <Text className="text-white">Crear Carpeta</Text>
          </Pressable>
          <FlatList
            data={carpetas}
            keyExtractor={(carpeta) => String(carpeta.id)}
            style={{ flex: 1 }}
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
                  className="flex-row items-center mt-3 rounded-lg ms-4 me-4 min-h-[50px] min-w-[50px]"
                  style={{
                    backgroundColor: carpetaItem.color,
                  }}
                >
                  <Carpeta
                    className="me-3 ms-4"
                    size={20}
                    color={"white"}
                  />
                  <Text
                    style={{
                      color: carpetaItem.color == "black" ? "white" : "black",
                    }}
                  >
                    {carpetaItem.name}
                  </Text>
                </Pressable>
              </Link>
            )}
          />
        </View>
      </Animated.View>

      <Modal
        visible={mostrarMenu}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMostrarMenu(false)}
      >
        <Pressable
          className="flex-1"
          onPress={() => {
            Keyboard.dismiss();
            setMostrarMenu(false);
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
                    <Text className="text-white">
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
                      {Object.values(coloresFondo).map((color) => {
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
                            <Circulo color={color} size={35} />
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
    </>
  );
}

export function AnimatedFolderss() {
  return <Carpetas />;
}
