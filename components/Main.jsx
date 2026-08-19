import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Pressable } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Notas } from "./Notas";
import { router } from "expo-router";
import { Anadir } from "./Icons";
import { Screen } from "./Screen";
import { createNote } from "../db/notesRepository";

export function Main() {
  const insets = useSafeAreaInsets();

  const crearNota = async () => {
    try {
      const nuevaNota = await createNote({});
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
            <Notas
            />
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
