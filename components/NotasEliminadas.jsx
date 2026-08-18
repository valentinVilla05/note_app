import { View, Text, Pressable, StyleSheet, Modal } from "react-native";
import { Link } from "expo-router";
import { Opciones, PapeleraIcon, RestaurarIcon } from "./Icons";
import { useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { coloresFondo, coloresToolBar as coloresTitulo, quitarHTML } from "../data/utils";

export const NotasEliminadas = (props) => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [posicion, setPosicion] = useState({ top: 0, left: 0 });
  const colorTheme = props.colorTheme;

  const abrirMenu = (event) => {
    event.stopPropagation();

    const { pageX, pageY } = event.nativeEvent;
    const anchoMenu = 160;

    setPosicion({
      top: pageY + 17,
      left: Math.max(10, pageX - anchoMenu - 20),
    });
    setMostrarMenu(true);
  };

  const textoPlano = quitarHTML(props.text)

  const restaurarNota = async (id) => {
    try {
      const listaNotas = await AsyncStorage.getItem("notas");
      let notasGuardadas = listaNotas != null ? JSON.parse(listaNotas) : [];

      if (!Array.isArray(notasGuardadas)) {
        notasGuardadas = [];
      }

      const listaPapelera = await AsyncStorage.getItem("papelera");
      let papeleraGuardada =
        listaPapelera != null ? JSON.parse(listaPapelera) : [];

      // Comprobación de seguridad
      if (!Array.isArray(papeleraGuardada)) {
        papeleraGuardada = [];
      }

      const notaARestaurar = papeleraGuardada.find(
        (nota) => String(nota.id) === String(id),
      );
      
      if (!notaARestaurar) return;

      const notaSinFechaBorrado = { ...notaARestaurar, deleteDate: "" };

      const nuevasNotas = [...notasGuardadas, notaSinFechaBorrado];
      await AsyncStorage.setItem("notas", JSON.stringify(nuevasNotas));

      const nuevaPapelera = papeleraGuardada.filter(
        (nota) => String(nota.id) !== String(id),
      );
      await AsyncStorage.setItem("papelera", JSON.stringify(nuevaPapelera));

      if (props.onNotaRestaurada) props.onNotaRestaurada;
    } catch (e) {
      alert("Error al restaurar la nota");
    }
  };

  const eliminarPermanentemente = async (id) => {
    const listaEliminadas = await AsyncStorage.getItem("papelera");
    const eliminadas =
      listaEliminadas !== null ? JSON.parse(listaEliminadas) : [];

    const notasfiltradas = eliminadas.filter((nota) => 
      String(nota.id) !== String(id)
    );
    await AsyncStorage.setItem("papelera", JSON.stringify(notasfiltradas));

    if (props.onNotaEliminadaPermanentemente) {
      props.onNotaEliminadaPermanentemente;
    }

  
  };

  return (
    <>
      <Pressable className="flex-1 min-w-[47%] self-startModal m-[7px]">
        <View className="bg-[#4a4a4a] rounded-[10px] min-h-[100px] min-w-[150px] overflow-hidden">
          <View
            className="flex-row items-center justify-between bg-[#373737] rounded-t-[10px] p-[5px]"
            style={{
              backgroundColor:
                colorTheme == "black" ? "#373737" : coloresTitulo[colorTheme],
              color: colorTheme === "black" ? "#FFFFFF" : "#000000",
            }}
          >
            <View className="flex-row items-center flex-1">
              <Text
                className="text-left text-xl text-white flex-1"
                numberOfLines={1}
              >
                {props.title}
              </Text>
            </View>
            <Pressable hitSlop={8} onPress={abrirMenu}>
              <Opciones />
            </Pressable>
          </View>
          <View
            className="flex-1"
            style={{
              backgroundColor:
                colorTheme == "black" ? "#909090" : coloresFondo[colorTheme],
              color: colorTheme === "white" ? "#FFFFFF" : "#000000",
            }}
          >
            <Text className="p-[5px] font-light text-sm">
              {textoPlano.length >= 100
                ? textoPlano.slice(0, 100).concat("...")
                : textoPlano}
            </Text>
          </View>
        </View>
      </Pressable>

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
            className="bg-[#2d2d2d] w-[200px] rounded-xl p-1 border border-gray-700 shadow-2xl z-50"
            onPress={(e) => e.stopPropagation()}
          >
            <Pressable
              className="p-2 rounded-lg active:bg-[#3d3d3d]"
              onPress={() => {
                setMostrarMenu(false);
                restaurarNota(props.id);
              }}
            >
              <View className="flex-row items-center">
                <RestaurarIcon color="white" size={20} className="me-2" />
                <Text className="text-green-500 font-medium text-sm">
                  Restaurar nota
                </Text>
              </View>
            </Pressable>
            <Pressable
              className="p-2 rounded-lg active:bg-[#3d3d3d]"
              onPress={() => {
                setMostrarMenu(false);
                eliminarPermanentemente(props.id);
              }}
            >
              <View className="flex-row items-center">
                <PapeleraIcon color="white" size={20} className="me-2" />
                <Text className="text-red-600 font-medium text-sm">
                  Eliminar permanentemente
                </Text>
              </View>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};
