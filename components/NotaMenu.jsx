import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  Animated,
} from "react-native";
import { Link } from "expo-router";
import {
  Archivado,
  Compartir,
  FavoritoDesmarcado,
  FavoritoMarcado,
  Fijar,
  Opciones,
  PapeleraIcon,
} from "./Icons";
import { useState, useRef } from "react";
import {
  coloresFondo,
  coloresToolBar as coloresTitulo,
  quitarHTML,
} from "../data/utils";
import { softDeleteNote, updateNote } from "../db/notesRepository";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import { expandirImagenesEnHTML } from "../data/images";

export const NotaMenu = (props) => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [posicion, setPosicion] = useState({ top: 0, left: 0 });
  const colorTheme = props.colorTheme;

  // Animación suave de escala
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.94,
      useNativeDriver: true,
      speed: 25,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 25,
      bounciness: 4,
    }).start();
  };

  const abrirMenu = (event) => {
    event.stopPropagation();

    const { pageX, pageY } = event.nativeEvent;
    const anchoMenu = 140;

    setPosicion({
      top: pageY + 17,
      left: Math.max(10, pageX - anchoMenu - 20),
    });
    setMostrarMenu(true);
  };

  const eliminarNota = async (id) => {
    try {
      await softDeleteNote(id);
      props.onRefresh?.();
    } catch (e) {
      alert("Error al eliminar la nota");
    }
  };

  const marcarNota = async (id) => {
    try {
      await updateNote(id, { favourite: !props.favourite });
      props.onRefresh?.();
    } catch (e) {
      alert("Error al marcar la nota");
    }
  };

  const fijarNota = async (id) => {
    try {
      await updateNote(id, { pinned: !props.pinned });
      props.onRefresh?.();
    } catch (e) {
      alert("Error al fijar la nota");
    }
  };

  const archivarNota = async (id) => {
    try {
      await updateNote(id, { archived: !props.archived });
      props.onRefresh?.();
    } catch (e) {
      alert("Error al archivar la nota");
    }
  };

  const compartirNota = async (id) => {
    const html = await expandirImagenesEnHTML(props.content);

    const file = await printToFileAsync({
      html: `
        <html>
        <body> 
        <h1>${props.title}</h1>
        ${html}
        </body>
        </html>
      `,
      base64: false,
    });
    await shareAsync(file.uri);
  };

  const textoPlano = quitarHTML(props.content);

  return (
    <>
      <Link
        href={{
          pathname: "/[id]",
          params: {
            id: String(props.id),
            title: props.title,
            content: props.content,
            favourite: props.favourite,
            pinned: props.pinned,
            colorTheme: props.colorTheme,
            archived: props.archived,
          },
        }}
        asChild
      >
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          className="w-[47%] self-startModal m-[7px]"
          testID={`nota-${props.id}`}
        >
          <Animated.View
            className="bg-[#4a4a4a] rounded-[10px] min-h-[100px] min-w-[150px] overflow-hidden"
            style={{
              transform: [{ scale: scaleAnim }],
              borderWidth: props.favourite ? 2 : 0,
              borderColor: props.favourite ? "#D4AF37" : "transparent",
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
                {props.pinned ? (
                  <Fijar color="white" size={15} className="me-2" />
                ) : null}
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
            className="bg-[#2d2d2d] w-[180px] rounded-xl p-1 border border-gray-700 shadow-2xl z-50"
            onPress={(e) => e.stopPropagation()}
          >
            <Pressable
              className="p-2 rounded-lg active:bg-[#3d3d3d]"
              onPress={() => {
                setMostrarMenu(false);
                compartirNota(props.id);
              }}
            >
              <View className="flex-row items-center">
                <Compartir color="gray" size={21} className="me-2" />
                <Text className="text-slate-300 text-sm">Compartir</Text>
              </View>
            </Pressable>
            <Pressable
              className="p-2 rounded-lg active:bg-[#3d3d3d]"
              onPress={() => {
                setMostrarMenu(false);
                archivarNota(props.id);
              }}
            >
              {props.archived == true ? (
                <View className="flex-row items-center">
                  <Archivado color="white" size={21} className="me-2" />
                  <Text className="text-slate-300 text-sm">Desarchivar</Text>
                </View>
              ) : (
                <View className="flex-row items-center">
                  <Archivado color="gray" size={21} className="me-2" />
                  <Text className="text-slate-300 text-sm">Archivar</Text>
                </View>
              )}
            </Pressable>
            {props.archived != true && (
              <Pressable
                className="p-2 rounded-lg active:bg-[#3d3d3d]"
                onPress={() => {
                  setMostrarMenu(false);
                  fijarNota(props.id);
                }}
              >
                {props.pinned == true ? (
                  <View className="flex-row items-center">
                    <Fijar color="white" size={21} className="me-2" />
                    <Text className="text-slate-300 text-sm">
                      Desfijar del inicio
                    </Text>
                  </View>
                ) : (
                  <View className="flex-row items-center">
                    <Fijar color="gray" size={21} className="me-2" />
                    <Text className="text-slate-300 text-sm">
                      Fijar al inicio
                    </Text>
                  </View>
                )}
              </Pressable>
            )}
            <Pressable
              className="p-2 rounded-lg active:bg-[#3d3d3d]"
              onPress={() => {
                setMostrarMenu(false);
                marcarNota(props.id);
              }}
            >
              {props.favourite == true ? (
                <View className="flex-row items-center justify-center">
                  <FavoritoMarcado color="white" size={20} className="me-2" />
                  <Text className="text-slate-300 text-sm">
                    Desmarcar de favoritos
                  </Text>
                </View>
              ) : (
                <View className="flex-row items-center">
                  <FavoritoDesmarcado
                    color="white"
                    size={18}
                    className="me-2"
                  />
                  <Text className="text-slate-300 text-sm">
                    Marcar en favoritos
                  </Text>
                </View>
              )}
            </Pressable>
            <Pressable
              className="p-2 rounded-lg active:bg-[#3d3d3d]"
              onPress={() => {
                setMostrarMenu(false);
                eliminarNota(props.id);
              }}
            >
              <View className="flex-row items-center">
                <PapeleraIcon color="white" size={20} className="me-2" />
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
