import { StyleSheet } from "react-native";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function Header() {
  return (
    <View style={styles.header}>
      <Pressable onPress={() => alert("Esto es un menu")}>
        <Ionicons
          name="menu"
          size={30}
          color="#717171"
          style={{ marginRight: 20 }}
        />
      </Pressable>
      <Text style={{ color: "#c8c8c8", fontSize: 30, fontWeight: "bold" }}>
        Mis notas
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: 'row',
    backgroundColor: "#1e1e1e",
    alignItems: "flex-start",
    padding: 15,
  },
});
