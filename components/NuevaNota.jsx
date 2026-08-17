import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Cancelar, Adjuntar, Texto, Subrayado, Anadir, Menos } from "./Icons";
import { Link } from "expo-router";
import archivo from "../assets/archivo.svg";
import { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";

export const NuevaNota = (props) => {
  const [tamanoFuente, setTamanoFuente] = useState(20);
  const [subrayado, setSubrayado] = useState(false);

  const params = useLocalSearchParams();
  const id = props.id || params.id;

  const [titulo, setTitulo] = useState(props.title || params.title || "");
  const [texto, setTexto] = useState(props.text || params.text || "");

  const actualizarTitulo = async (nuevoTitulo) => {
    setTitulo(nuevoTitulo);

    const listaNotas = await AsyncStorage.getItem("notas");
    const notasGuardadas = listaNotas != null ? JSON.parse(listaNotas) : [];

    const listaModificada = notasGuardadas.map((nota) => {
      if (String(nota.id) === String(id)) {
        return { ...nota, title: nuevoTitulo };
      }
      return nota;
    });

    await AsyncStorage.setItem("notas", JSON.stringify(listaModificada));
  };

  const actualizarTexto = async (nuevoTexto) => {
    setTexto(nuevoTexto);

    const listaNotas = await AsyncStorage.getItem("notas");
    const notasGuardadas = listaNotas != null ? JSON.parse(listaNotas) : [];

    const listaModificada = notasGuardadas.map((nota) => {
      if (String(nota.id) === String(id)) {
        return { ...nota, text: nuevoTexto };
      }
      return nota;
    });

    await AsyncStorage.setItem("notas", JSON.stringify(listaModificada));
  };

  return (
    <ScrollView className="mt-5 flex-1">
      <View className="mb-5" style={styles.barraHerramientas}>
        <Pressable className="me-3 ms-5">
          <Adjuntar />
        </Pressable>
        <Pressable
          className="flex-row me-3 ms-3 justify-center items-center"
          color={"white"}
        >
          {/* 1. Protección en el botón restar por si el input está vacío */}
          <Pressable
            disabled={!tamanoFuente || Number(tamanoFuente) <= 1}
            onPress={() =>
              setTamanoFuente((actual) => Math.max(1, Number(actual) - 1))
            }
          >
            <Menos />
          </Pressable>
          <TextInput
            className="text-gray-300 ms-3 me-2 text-xl underline"
            value={String(tamanoFuente)}
            onChangeText={(tamano) => {
              if (tamano === "") {
                setTamanoFuente("");
              } else {
                const nuevo = parseInt(tamano, 10);
                if (!isNaN(nuevo)) setTamanoFuente(nuevo);
              }
            }}
            onBlur={() => {
              if (tamanoFuente === "" || tamanoFuente < 1) {
                setTamanoFuente(1);
              }
            }}
            keyboardType="numeric"
          />
          <Pressable
            onPress={() =>
              setTamanoFuente((actual) => (parseInt(actual, 10) || 0) + 1)
            }
          >
            <Anadir color="white" />
          </Pressable>
        </Pressable>
        <Pressable
          className={`me-3 ms-3 p-1 rounded-md active:opacity-80 ${
            subrayado ? "bg-[#333333]" : "bg-transparent"
          }`}
          onPress={() => setSubrayado((actual) => !actual)}
        >
          <Subrayado />
        </Pressable>
      </View>
      <SafeAreaProvider>
        <SafeAreaView>
          <View className="max-w-['100%'] ms-3 me-3">
            <TextInput
              className="mb-5 font-medium text-4xl text-white"
              placeholder="Titulo"
              value={titulo}
              onChangeText={actualizarTitulo}
            />
            <TextInput
              multiline
              style={{
                textDecorationLine: subrayado ? "underline" : "none",
                /* 2. Protección aquí: si tamanoFuente es 0 o "", usamos un valor seguro (1) para renderizar */
                fontSize: Number(tamanoFuente) >= 1 ? Number(tamanoFuente) : 1,
              }}
              value={texto}
              onChangeText={actualizarTexto}
              className="text-white flex-1 h-['100%']"
              placeholder={
                (texto ?? "").length === 0
                  ? "Comienza a escribir aquí..."
                  : texto
              }
            ></TextInput>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  barraHerramientas: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#171717",
  },
});
