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
import { useNotesFromFolder, useNotesWithoutfolder } from "../hooks/useNotes";
import { useState, useRef, useEffect } from "react";
import { Anadir, Cancelar } from "./Icons";
import { NotaMenu } from "./NotaMenu";
import { coloresToolBar, coloresFondo } from "../data/utils";
import { updateNote } from "../db/notesRepository";
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
                onRefresh={setNotasCarpeta}
              />
            )}
          />
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
                    Selecciona las notas a añadir:{" "}
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
    </>
  );
};
