import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Notas } from "./Notas";
import { Link, router, useFocusEffect } from "expo-router";
import Constants from "expo-constants";
import anadir from "../assets/anadirIcon.png";
import { Anadir, Escribir } from "./Icons";
import { Screen } from "./Screen";
import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function Main() {
  const insets = useSafeAreaInsets();

  const borrarTodo = async () => {
    try {
      await AsyncStorage.removeItem("notas");
      setListaNotas([]); // Vaciamos la pantalla
      alert("¡Todas las notas borradas!");
    } catch (e) {
      alert("Error al borrar");
    }
  };

  const [listaNotas, setListaNotas] = useState([]); // Almacenamos las notas

  useFocusEffect(
    useCallback(() => {
      cargarNotas();
    }, []),
  );

  const cargarNotas = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("notas");

      const notasGuardadas = jsonValue != null ? JSON.parse(jsonValue) : [];
      setListaNotas(notasGuardadas);
    } catch (e) {
      alert("Error al cargar las notas");
    }
  };

  const crearNota = async () => {
    try {
      const nuevaNota = {
        id: Date.now().toString(),
        title: "",
        text: "",
      };

      const nuevasNotas = [...listaNotas, nuevaNota];

      await AsyncStorage.setItem("notas", JSON.stringify(nuevasNotas));

      setListaNotas(nuevasNotas);

      router.push(`/${nuevaNota.id}`);
    } catch (e) {
      alert("Error al crear nota");
    }
  };

  return (
    <SafeAreaProvider>
      <Screen>
        <StatusBar style="auto" />
        <View
          style={{
            flex: 1,
            paddingBottom: insets.bottom,
          }}
        >
          <View style={{ flex: 1 }}>
            <Notas listaNotas={listaNotas} />
          </View>
          <View style={styles.botonAnadir}>
            <Pressable
              onPress={crearNota}
              accessibilityRole="button"
              accessibilityLabel="Escribir nota"
              className="bg-[#e17f29] active:bg-[#cf701e] active:opacity-50"
            >
              {({ pressed }) => (
                <View
                  className="justify-center items-center"
                  style={{
                    opacity: pressed ? 0.5 : 1,
                  }}
                >
                  <Anadir className="" color="white" />
                </View>
              )}
            </Pressable>
            {/* <Button title="Limpiar basura" onPress={borrarTodo} color="red" /> */}
          </View>
        </View>
      </Screen>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  botonAnadir: {
    backgroundColor: "#e17f29",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignSelf: "flex-end",
    marginRight: 30,
    position: "absolute",
    bottom: 40,
  },
});
