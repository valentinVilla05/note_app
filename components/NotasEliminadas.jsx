import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  Animated,
} from "react-native";
import { Opciones, PapeleraIcon, RestaurarIcon } from "./Icons";
import { useState, useRef } from "react";
import {
  coloresFondo,
  coloresToolBar as coloresTitulo,
  quitarHTML,
} from "../data/utils";
import { permanentDelete, restoreNote } from "../db/notesRepository";
import * as Haptics from "expo-haptics";
import { use } from "react";
import { useAudioPlayer } from "expo-audio";

const deletePermanentAudio = require("../sfx/deletePermanent.mp3");

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

  const textoPlano = quitarHTML(props.content);

  const restaurarNota = async (id) => {
    try {
      await restoreNote(id);
      props.onRefresh?.();
    } catch (e) {
      alert("Error al restaurar la nota");
    }
  };

  const player = useAudioPlayer(deletePermanentAudio);

  const eliminarPermanentemente = async (id) => {
    try {
      await permanentDelete(id);
      props.onRefresh?.();
    } catch (e) {
      alert("Error al eliminar la nota");
    }
  };

  const scaleBorrada = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const animacionRestaurar = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});

    Animated.parallel([
      Animated.timing(scaleBorrada, {
        toValue: 0.1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start(() => restaurarNota(id));
  };

  const rotacion = useRef(new Animated.Value(0)).current;
  const trasladoY = useRef(new Animated.Value(0)).current;
  const opacidad = useRef(new Animated.Value(1)).current;

  const animacionEliminadoPermanente = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    player.seekTo(0);
    player.play();

    Animated.parallel([
      Animated.timing(rotacion, {
        toValue: 0.5,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(trasladoY, {
        toValue: 1000,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(opacidad, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => eliminarPermanentemente(id));
  };

  return (
    <>
      <Pressable
        className="flex-1 min-w-[47%] self-startModal m-[7px]"
        onLongPress={() => {
          if (props.onNotaSeleccionada) {
            props.onNotaSeleccionada();
          }
        }}
      >
        <Animated.View
          className="bg-[#4a4a4a] rounded-[10px] min-h-[100px] min-w-[150px] overflow-hidden"
          style={{
            opacity: opacityAnim,
            transform: [
              {
                rotate: rotacion.interpolate({
                  inputRange: [0, 10],
                  outputRange: ["0deg", "90deg"],
                }),
              },
              {
                translateY: trasladoY.interpolate({
                  inputRange: [0, 1000],
                  outputRange: [0, 1000],
                }),
              },
              { scale: scaleBorrada },
            ],
            borderWidth: props.seleccionada ? 3 : 0,
            borderColor: props.seleccionada ? "#3b82f6" : "transparent",
          }}
        >
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
                colorTheme == "black" ? "#374151" : coloresFondo[colorTheme],
              color: colorTheme === "black" ? "white" : "black",
            }}
          >
            <Text
              className="p-[5px] text-sm"
              style={{
                color: colorTheme === "black" ? "#CCCCCC" : "#000000",
              }}
            >
              {textoPlano.length >= 100
                ? textoPlano.slice(0, 100).concat("...")
                : textoPlano}
            </Text>
          </View>
        </Animated.View>
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
                animacionRestaurar(props.id);
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
                animacionEliminadoPermanente(props.id);
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
