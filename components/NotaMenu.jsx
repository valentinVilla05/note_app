import { View, Text, Pressable, StyleSheet, Modal } from "react-native";
import { Link } from "expo-router";
import { Opciones, Papelera } from "./Icons";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const NotaMenu = (props) => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [posicion, setPosicion] = useState({ top: 0, left: 0 });

  const abrirMenu = (event) => {
    event.stopPropagation();

    const { pageX, pageY } = event.nativeEvent;
    const anchoMenu = 140;

    setPosicion({
      top: pageY + 10,
      left: Math.max(10, pageX - anchoMenu + 15),
    });
    setMostrarMenu(true);
  };

  const eliminarNota = async (id) => {
    try {

      const jsonValue = await AsyncStorage.getItem("notas");
      const notasGuardadas = jsonValue != null ? JSON.parse(jsonValue) : [];

      const notasFiltradas = notasGuardadas.filter(
        (nota) => String(nota.id) !== String(id),
      );

      await AsyncStorage.setItem("notas", JSON.stringify(notasFiltradas));

      if (props.onNotaEliminada) props.onNotaEliminada();
    } catch (e) {
      alert("Error al eliminar la nota");
    }
  };

  return (
    <>
      <Link
        href={{
          pathname: "/[id]",
          params: {
            id: String(props.id),
            title: props.title,
            text: props.text,
          },
        }}
        asChild
      >
        <Pressable
          className="w-[47%] self-start bg-[#4a4a4a] m-[7px] rounded-[10px] min-w-[150px]"
          testID={`nota-${props.id}`}
        >
          <View>
            <View className="flex-row items-center justify-between bg-[#373737] rounded-t-[10px] p-[5px]">
              <Text className="text-left text-xl text-white flex-1">
                {props.title}
              </Text>

              <Pressable hitSlop={8} onPress={abrirMenu}>
                <Opciones />
              </Pressable>
            </View>
            <View>
              <Text className="text-white p-[5px] font-light text-sm">
                {props.text}
              </Text>
            </View>
          </View>
        </Pressable>
      </Link>

      <Modal
        visible={mostrarMenu}
        transparent={true}
        animationType="none"
        onRequestClose={() => setMostrarMenu(false)}
      >
        <Pressable className="flex-1" onPress={() => setMostrarMenu(false)}>
          <Pressable
            style={{
              position: "absolute",
              top: posicion.top,
              left: posicion.left,
            }}
            className="bg-[#2d2d2d] w-[140px] rounded-xl p-1 border border-gray-700 shadow-2xl z-50"
            onPress={(e) => e.stopPropagation()}
          >
            <Pressable
              className="p-2 rounded-lg active:bg-[#3d3d3d]"
              onPress={() => {
                setMostrarMenu(false);
                eliminarNota(props.id);
              }}
            >
              <View className="flex-row items-center">
                <Papelera color="white" size={18} className="me-2" />
                <Text className="text-red-400 font-medium text-sm">
                  Eliminar nota
                </Text>
              </View>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};
