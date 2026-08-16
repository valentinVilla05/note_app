import { StyleSheet } from "react-native";
import { View, Text, TextInput, Pressable } from "react-native";
import { Cancelar } from "./Icons";
import { Link } from "expo-router";
import archivo from "../assets/archivo.svg";
import { ScrollView } from "react-native";

export function NuevaNota() {
  return (
    <ScrollView className="mt-20">
      <View style={styles.barraHerramientas}>
        <Link asChild href="/">
          <Pressable>
            { ({pressed}) => <Cancelar style={{ opacity: pressed ? 0.5 : 1 }}/> }
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  barraHerramientas: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
});
