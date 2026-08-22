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
import { useState } from "react";

export function Main() {
  const insets = useSafeAreaInsets();
  const [refreshNotasKey, setRefreshNotasKey] = useState(0); 

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
          <View style={{ maxHeight: "40%", flexShrink: 1, overflow: "hidden" }}>
            <Carpetas
              onFolderDeleted={() => setRefreshNotasKey((prev) => prev + 1)}
            />
          </View>
          <View style={{ flex: 1}}>
            <Notas key={refreshNotasKey} />
          </View>

          <BotonEscribir />
        </View>
      </Screen>
    </SafeAreaProvider>
  );
}
