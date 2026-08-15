import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Pressable,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Header } from "./Header";
import { Notas } from "./Notas";

import Constants from "expo-constants";
import anadir from "../assets/anadirIcon.png";

function showAlert(mensaje) {
  alert(mensaje);
}

export function Main() {

    const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <Header />
        <View style={{ flex: 1 }}>
          <Notas />
        </View>
        <View style={styles.botonAnadir}>
          <Pressable onPress={() => showAlert("Soy un boton")}>
            <View style={{ flexDirection: "row" }}>
              <Image
                source={anadir}
                style={{
                  width: 25,
                  height: 25,
                  resizeMode: "contain",
                  marginRight: 15,
                }}
              />
              <Text style={{ color: "#fff", fontSize: 20 }}>Escribir nota</Text>
            </View>
          </Pressable>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {},

  botonAnadir: {
    backgroundColor: "#e17f29",
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 50,
    borderRadius: 25,
    alignSelf: "flex-end",
    marginRight: 30,
    position: 'absolute',
    bottom: 40,
  },
});
