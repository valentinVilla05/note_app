import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Pressable, Text, ScrollView } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Notas } from "./Notas";
import { router } from "expo-router";
import { Anadir } from "./Icons";
import { Screen } from "./Screen";
import { createNote } from "../db/notesRepository";
import { Carpetas } from "./Carpetas";
import { BotonEscribir } from "./BotonEscribir";

export function Main() {
  const insets = useSafeAreaInsets();

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
          <View style={{ flex: 0.4, overflow: "hidden" }}>
            <Carpetas />
          </View>
          <View style={{ flex: 0.6 }}>
            <Notas />
          </View>

          <BotonEscribir/>
        </View>
      </Screen>
    </SafeAreaProvider>
  );
}
