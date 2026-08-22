import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  Animated,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import { Link } from "expo-router";
import {
  Archivado,
  Cancelar,
  Compartir,
  Contrasena,
  FavoritoDesmarcado,
  FavoritoMarcado,
  Fijar,
  MeterEnCarpetaIcon,
  Mostrar,
  Ocultar,
  Opciones,
  PapeleraIcon,
  SacarDeCarpetaIcon,
} from "./Icons";
import { useState, useRef, useEffect } from "react";
import {
  coloresFondo,
  coloresToolBar as coloresTitulo,
  quitarHTML,
  compartirNota,
  coloresToolBar,
} from "../data/utils";
import { softDeleteNote, updateNote } from "../db/notesRepository";
import { secuenciaTrasladoY } from "../data/animations";
import * as Haptics from "expo-haptics";
import { useAudioPlayer } from "expo-audio";
import { useFolders } from "../hooks/useNotes";

const deleteAudio = require("../sfx/delete.mp3");

export const NotaMenu = (props) => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [mostrarListaCarpetas, setMostrarListaCarpetas] = useState(false);

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

  const animacionTrasladoY = useRef(new Animated.Value(0)).current;

  const animacionArchivar = (id) => {
    secuenciaTrasladoY(
      animacionTrasladoY,
      [
        [50, 300],
        [-700, 500],
      ],
      () => archivarNota(id),
    );
  };

  const escala = useRef(new Animated.Value(1)).current;
  const opacidad = useRef(new Animated.Value(1)).current;
  const escalaFinal = useRef(Animated.multiply(scaleAnim, escala)).current;

  const player = useAudioPlayer(deleteAudio);

  const animacionEliminar = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    player.seekTo(0);
    player.play();

    Animated.delay(100);

    Animated.parallel([
      Animated.timing(escala, {
        toValue: 0.1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacidad, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      eliminarNota(id);
    });
  };

  const rotacionCandado = useRef(new Animated.Value(0)).current;
  const opacidadCandado = useRef(new Animated.Value(0)).current;

  const animacionOcultar = (id) => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacidadCandado, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(rotacionCandado, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(escala, {
          toValue: 0.7,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(opacidad, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      Animated.timing(opacidadCandado, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      ocultarNota(id);
    });
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

  const ocultarNota = async (id) => {
    try {
      await updateNote(id, { hidden: !props.hidden });
      props.onRefresh?.();
    } catch (e) {
      alert("Error al ocultar o mostrar la nota");
    }
  };

  const textoPlano = quitarHTML(props.content);

  const [listaCarpetas, setListaCarpetas] = useFolders();

  const anadirNotaACarpeta = async (idNota, idCarpeta) => {
    try {
      await updateNote(idNota, { folderId: idCarpeta });
      props.onRefresh?.();
    } catch (e) {
      alert("Error al añadir nota en carpeta");
    }
  };

  const sacarDeCarpeta = async (idNota) => {
    try {
      await updateNote(idNota, { folderId: null });
      props.onRefresh?.();
    } catch (e) {
      alert("Error al añadir nota en carpeta");
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
            content: props.content,
            folderId: props.folderId,
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
          style={{ position: "relative" }}
        >
          <Animated.View
            style={{
              width: "100%",
              transform: [
                { scale: scaleAnim },
                { translateY: animacionTrasladoY },
              ],
              borderWidth: props.favourite ? 2 : 0,
              borderColor: props.favourite ? "#D4AF37" : "transparent",
            }}
            className="bg-[#4a4a4a] rounded-[10px] min-h-[100px] min-w-[150px] overflow-hidden"
          >
            <Animated.View
              style={{
                width: "100%",
                flex: 1,
                opacity: opacidad,
                transform: [{ scale: escala }],
              }}
            >
              <Animated.View
                style={{
                  width: "100%",
                  flex: 1,
                  opacity: opacidad,
                  transform: [{ scale: escala }],
                }}
              >
                <View
                  className="flex-row items-center justify-between bg-[#373737] rounded-t-[10px] p-[5px]"
                  style={{
                    backgroundColor:
                      colorTheme == "black"
                        ? "#373737"
                        : coloresTitulo[colorTheme],
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
                      colorTheme == "black"
                        ? "#374151"
                        : coloresFondo[colorTheme],
                  }}
                >
                  {props.hidden == true ? (
                    <View className="flex-1 justify-center items-center">
                      <Ocultar />
                    </View>
                  ) : (
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
                  )}
                </View>
              </Animated.View>
            </Animated.View>
          </Animated.View>

          <Animated.View
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              opacity: opacidadCandado,
              transform: [
                { translateX: -15 },
                { translateY: -15 },
                {
                  rotate: rotacionCandado.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            }}
          >
            <Contrasena />
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
            {props.folderId == null ? (
              <Pressable
                className="p-2 rounded-lg active:bg-[#3d3d3d]"
                onPress={() => {
                  setListaCarpetas();
                  setMostrarMenu(false);
                  setMostrarListaCarpetas(true);
                }}
              >
                <View className="flex-row items-center">
                  <MeterEnCarpetaIcon
                    color="white"
                    size={21}
                    className="me-2"
                  />
                  <Text className="text-slate-300 text-sm">
                    Añadir a una carpeta
                  </Text>
                </View>
              </Pressable>
            ) : (
              <Pressable
                className="p-2 rounded-lg active:bg-[#3d3d3d]"
                onPress={() => {
                  setMostrarMenu(false);
                  sacarDeCarpeta(props.id);
                }}
              >
                <View className="flex-row items-center">
                  <SacarDeCarpetaIcon
                    color="white"
                    size={21}
                    className="me-2"
                  />
                  <Text className="text-slate-300 text-sm">
                    Sacar de la carpeta
                  </Text>
                </View>
              </Pressable>
            )}
            {props.hidden == false ? (
              <Pressable
                className="p-2 rounded-lg active:bg-[#3d3d3d]"
                onPress={() => {
                  setMostrarMenu(false);
                  compartirNota(
                    props.id,
                    props.title,
                    props.content,
                    coloresFondo[props.colorTheme],
                  );
                }}
              >
                <View className="flex-row items-center">
                  <Compartir color="gray" size={21} className="me-2" />
                  <Text className="text-slate-300 text-sm">Compartir</Text>
                </View>
              </Pressable>
            ) : (
              <></>
            )}
            {props.hidden == false && props.folderId == null ? (
              <Pressable
                className="p-2 rounded-lg active:bg-[#3d3d3d]"
                onPress={() => {
                  setMostrarMenu(false);
                  animacionArchivar(props.id);
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
            ) : (
              <></>
            )}
            {props.archived == false || props.folderId != null ? (
              <Pressable
                className="p-2 rounded-lg active:bg-[#3d3d3d]"
                onPress={() => {
                  setMostrarMenu(false);
                  animacionOcultar(props.id);
                }}
              >
                {props.hidden == false ? (
                  <View className="flex-row items-center">
                    <Ocultar color="gray" size={21} className="me-2" />
                    <Text className="text-slate-300 text-sm">Ocultar nota</Text>
                  </View>
                ) : (
                  <View className="flex-row items-center">
                    <Mostrar color="gray" size={21} className="me-2" />
                    <Text className="text-slate-300 text-sm">Mostrar</Text>
                  </View>
                )}
              </Pressable>
            ) : (
              <></>
            )}

            {(props.archived != true || props.folderId != null) &&
              props.hidden == false && (
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
            {props.hidden == false &&
            (props.archived == false || props.folderId != null) ? (
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
            ) : (
              <></>
            )}
            {props.hidden == false ? (
              <Pressable
                className="p-2 rounded-lg active:bg-[#3d3d3d]"
                onPress={() => {
                  setMostrarMenu(false);
                  animacionEliminar(props.id);
                }}
              >
                <View className="flex-row items-center">
                  <PapeleraIcon color="white" size={20} className="me-2" />
                  <Text className="text-red-400 font-medium text-sm">
                    Eliminar nota
                  </Text>
                </View>
              </Pressable>
            ) : (
              <></>
            )}
          </Pressable>
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
                {
                  (listaCarpetas.length == 0 ? (
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
                          onPress={() => anadirNotaACarpeta(props.id, item.id)}
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
                  ))
                }
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </>
  );
};
