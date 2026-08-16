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
import { Link } from "expo-router";
import Constants from "expo-constants";
import anadir from "../assets/anadirIcon.png";
import { Anadir, Escribir } from "./Icons";
import { Screen } from "./Screen";

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
          <View style={{ flex: 1 }}>
            <Notas />
          </View>
          <View style={styles.botonAnadir}>
            <Link asChild href="/nuevaNota">
              <Pressable
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
            </Link>
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
