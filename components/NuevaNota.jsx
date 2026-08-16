import { StyleSheet } from "react-native";
import { View, Text, TextInput, Pressable } from "react-native";
import { Cancelar, Adjuntar, Texto, ColorFont, Anadir, Menos } from "./Icons";
import { Link } from "expo-router";
import archivo from "../assets/archivo.svg";
import { ScrollView } from "react-native";
import { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export const NuevaNota = (props) => {
  const [tamanoFuente, setTamanoFuente] = useState(20);

  return (
    <ScrollView className="mt-5 flex-1">
      <View className="mb-5" style={styles.barraHerramientas}>
        <Pressable className="me-5 ms-5">
          <Adjuntar />
        </Pressable>
        <Pressable
          className="flex-row me-5 ms-5 justify-center items-center"
          color={"white"}
        >
          <Pressable onPress={() => setTamanoFuente((actual) => actual - 1)}>
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
          <Pressable onPress={() => setTamanoFuente((actual) => actual + 1)}>
            <Anadir color="white" />
          </Pressable>
        </Pressable>
        <Pressable className="me-5 ms-5">
          <ColorFont />
        </Pressable>
      </View>
      <SafeAreaProvider>
        <SafeAreaView>
          <View className="max-w-['100%'] ms-3 me-3">
            <TextInput
              className="mb-5 font-medium text-4xl text-white"
              placeholder={props.title.length === 0 ? "Titulo" : props.title}
            >
              {props.title}
            </TextInput>
            <TextInput
              multiline
              style={{ fontSize: Math.max(1, tamanoFuente) }}
              className="text-white flex-1 h-['100%']"
              placeholder={
                props.text.length === 0
                  ? "Comienza a escribir aquí..."
                  : props.text
              }
            >
              {props.text}
            </TextInput>
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
