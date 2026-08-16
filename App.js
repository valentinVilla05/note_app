import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import { SafeAreaProvider } from "react-native-safe-area-context";

import Constants from "expo-constants";

import anadir from "./assets/anadirIcon.png";
import { Main } from "./components/Main";

function showAlert(mensaje) {
  alert(mensaje);
}

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Main/>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: "#181818",
    justifyContent: 'space-between',
    alignContent: 'space-between',
    paddingTop: 0,
    padding: 0,
  },
});
