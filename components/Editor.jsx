import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  Cancelar,
  Adjuntar,
  Texto,
  Subrayado,
  Anadir,
  Menos,
  Opciones,
  Circulo,
} from "./Icons";

import { Link } from "expo-router";
import archivo from "../assets/archivo.svg";
import { useState, useRef, use } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { formatearFecha, coloresFondo, coloresToolBar } from "../data/utils";
import {
  actions,
  RichToolbar,
  RichEditor,
} from "react-native-pell-rich-editor";
import { Modal } from "react-native";

export const Editor = (props) => {
  const richTextRef = useRef(null);

  const params = useLocalSearchParams();
  const id = props.id || params.id;

  const [titulo, setTitulo] = useState(props.title || params.title || "");
  const [contenidoHTML, setContenidoHTML] = useState(
    props.text || params.text || "",
  );
  const [lastUpdate, setLastUpdate] = useState(props.lastUpdate || "");
  const [colorTheme, setColorTheme] = useState(
    props.colorTheme || params.colorTheme || "black",
  );

  const actualizarTitulo = async (nuevoTitulo) => {
    const fecha = Date.now();
    setTitulo(nuevoTitulo);
    setLastUpdate(fecha);

    const listaNotas = await AsyncStorage.getItem("notas");
    const notasGuardadas = listaNotas != null ? JSON.parse(listaNotas) : [];

    const listaModificada = notasGuardadas.map((nota) => {
      if (String(nota.id) === String(id)) {
        return { ...nota, title: nuevoTitulo, lastUpdate: fecha };
      }
      return nota;
    });

    await AsyncStorage.setItem("notas", JSON.stringify(listaModificada));
  };

  const actualizarTexto = async (nuevoHTML) => {
    const fecha = Date.now();

    setContenidoHTML(nuevoHTML);
    setLastUpdate(fecha);

    const listaNotas = await AsyncStorage.getItem("notas");
    const notasGuardadas = listaNotas != null ? JSON.parse(listaNotas) : [];

    const listaModificada = notasGuardadas.map((nota) => {
      if (String(nota.id) === String(id)) {
        return { ...nota, text: nuevoHTML, lastUpdate: fecha };
      }
      return nota;
    });

    await AsyncStorage.setItem("notas", JSON.stringify(listaModificada));
  };

  const actualizarColor = async (nuevoColor) => {
    setColorTheme(nuevoColor);

    const listaNotas = await AsyncStorage.getItem("notas");
    const notasGuardadas = listaNotas != null ? JSON.parse(listaNotas) : [];

    const listaModificada = notasGuardadas.map((nota) => {
      if (String(nota.id) === String(id)) {
        return { ...nota, colorTheme: nuevoColor };
      }
      return nota;
    });

    await AsyncStorage.setItem("notas", JSON.stringify(listaModificada));
  };

  // Añadimos acciones personalizadas:
  const accionOpciones = "accion_opciones";

  const [alineacionActual, setAlineacionActual] = useState(actions.alignLeft); // Estado para controlar los alineados
  const accionesToolBar = (accion) => {
    if (accion === accionOpciones) {
      abrirMenu();
    }

    if (
      [actions.alignCenter, actions.alignRight, actions.alignLeft].includes(
        accion,
      )
    ) {
      if (alineacionActual === accion) {
        richTextRef.current?.sendAction(actions.alignLeft);
        setAlineacionActual(actions.alignLeft);
      } else {
        setAlineacionActual(accion);
      }
    } else if (accion === actions.alignLeft) {
      setAlineacionActual(actions.alignLeft);
    }
  };

  // Lógica para el modal
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [posicion, setPosicion] = useState({ top: 0, left: 0 });

  const abrirMenu = (event) => {
    const { pageX, pageY } = event.nativeEvent;
    const anchoMenu = 100;

    setPosicion({
      top: pageY + 17,
      left: Math.max(10, pageX - anchoMenu - 20),
    });
    setMostrarMenu(true);
  };

  return (
    <>
      <SafeAreaProvider>
        <SafeAreaView className="flex-1">
          <RichToolbar
            style={{
              backgroundColor: coloresToolBar[colorTheme] || "#181818",
              minHeight: 55,
              paddingTop: 5,
              paddingBottom: 5,
              alignItems: "center",
            }}
            editor={richTextRef}
            actions={[
              actions.setUnderline,
              actions.setBold,
              actions.setItalic,
              actions.insertBulletsList,
              actions.checkboxList,
              actions.code,
              actions.undo,
              actions.redo,
            ]}
            onPressAction={accionesToolBar}
            iconTint={colorTheme === "black" ? "#ffffff" : "#000000"}
            selectedIconTint={colorTheme === "black" ? "#ffffff" : "#000000"}
            selectedButtonStyle={{
              backgroundColor:
                colorTheme === "black"
                  ? "rgba(255, 255, 255, 0.15)"
                  : "rgba(0, 0, 0, 0.3)",
              borderRadius: 8,
            }}
            iconSize={26}
          />
          <RichToolbar
            style={{
              backgroundColor: coloresToolBar[colorTheme] || "#181818",
              minHeight: 55,
              paddingTop: 5,
              paddingBottom: 5,
              alignItems: "center",
            }}
            editor={richTextRef}
            actions={[
              actions.alignLeft,
              actions.alignCenter,
              actions.alignRight,
              actions.alignFull,
              actions.insertImage,
              accionOpciones,
            ]}
            onPressAction={accionesToolBar}
            iconMap={{
              [accionOpciones]: ({ tintColor }) => (
                <Pressable hitSlop={7} onPress={abrirMenu}>
                  <Opciones color={tintColor} />
                </Pressable>
              ),
            }}
            iconTint={colorTheme === "black" ? "#ffffff" : "#000000"}
            selectedIconTint={colorTheme === "black" ? "#ffffff" : "#000000"}
            selectedButtonStyle={{
              backgroundColor:
                colorTheme === "black"
                  ? "rgba(255, 255, 255, 0.15)"
                  : "rgba(0, 0, 0, 0.3)",
              borderRadius: 8,
            }}
            iconSize={26}
          />

          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <View
              style={{ backgroundColor: coloresFondo[colorTheme] || "#181818" }}
              className="flex-1"
            >
              <TextInput
                className="ps-5 pt-5 pb-10 font-medium text-4xl text-white"
                placeholder="Título"
                placeholderTextColor="#6B7280"
                value={titulo}
                onChangeText={actualizarTitulo}
                style={{
                  backgroundColor: coloresFondo[colorTheme] || "#181818",
                  color: colorTheme === "black" ? "#FFFFFF" : "#000000",
                }}
              />

              <RichEditor
                ref={richTextRef}
                placeholder={"Comienza a escribir aquí"}
                initialContentHTML={contenidoHTML}
                onChange={actualizarTexto}
                onChangeStatus={(item) => {
                  if (item.includes(actions.alignCenter))
                    setAlineacionActual(actions.alignCenter);
                  else if (item.includes(actions.alignRight))
                    setAlineacionActual(actions.alignRight);
                  else if (item.includes(actions.alignFull))
                    setAlineacionActual(actions.alignFull);
                  else setAlineacionActual(actions.alignLeft);
                }}
                placeholder="Comienza a escribir aquí..."
                editorStyle={{
                  backgroundColor: coloresFondo[colorTheme] || "#181818",
                  color: colorTheme === "black" ? "#FFFFFF" : "#000000",
                  placeholderColor: "#6B7280",
                  contentCSSText: `
                      font-size: 18px; 
                      line-height: 26px;              

                      input[type="checkbox"] {
                        border-radius: 5px !important;
                        rounded: 5px;
                        accent-color: #3B82F6;
                        cursor: pointer;
                      }             

                      li:has(input[type="checkbox"]:checked) {
                        text-decoration: line-through;
                        color: ##6b6b6b !important;
                        opacity: 0.6;
                      }
                    `,
                }}
                style={{ flex: 1, paddingLeft: 5, paddingRight: 5 }}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </SafeAreaProvider>

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
            className="bg-[#4e4e4e] w-[180px] rounded-xl p-1 border border-gray-700 shadow-2xl z-50"
            onPress={(e) => e.stopPropagation()}
          >
            <Pressable
              onPress={() => {
                actualizarColor("black");
                setMostrarMenu(false);
              }}
              className="flex-row flex-1 items-center p-1 active:bg-[#3d3d3d] active:rounded-md"
            >
              <Circulo className="p-1 me-2" color={"black"} />
              <Text className="text-white">Negro</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                actualizarColor("green");
                setMostrarMenu(false);
              }}
              className="flex-row flex-1 items-center p-1 active:bg-[#3d3d3d] active:rounded-md"
            >
              <Circulo className="p-1 me-2" color={"green"} />
              <Text className="text-white">Verde</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                actualizarColor("blue");
                setMostrarMenu(false);
              }}
              className="flex-row flex-1 items-center p-1 active:bg-[#3d3d3d] active:rounded-md"
            >
              <Circulo className="p-1 me-2" color={"blue"} />
              <Text className="text-white">Azul</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                actualizarColor("yellow");
                setMostrarMenu(false);
              }}
              className="flex-row flex-1 items-center p-1 active:bg-[#3d3d3d] active:rounded-md"
            >
              <Circulo className="p-1 me-2" color={"yellow"} />
              <Text className="text-white">Amarillo</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                actualizarColor("red");
                setMostrarMenu(false);
              }}
              className="flex-row flex-1 items-center p-1 active:bg-[#3d3d3d] active:rounded-md"
            >
              <Circulo className="p-1 me-2" color={"red"} />
              <Text className="text-white">Rojo</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                actualizarColor("pink");
                setMostrarMenu(false);
              }}
              className="flex-row flex-1 items-center p-1 active:bg-[#3d3d3d] active:rounded-md"
            >
              <Circulo className="p-1 me-2" color={"pink"} />
              <Text className="text-white">Rosa</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                actualizarColor("white");
                setMostrarMenu(false);
              }}
              className="flex-row flex-1 items-center p-1 active:bg-[#3d3d3d] active:rounded-md"
            >
              <Circulo className="p-1 me-2" color={"white"} />
              <Text className="text-white">Blanco</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({});
