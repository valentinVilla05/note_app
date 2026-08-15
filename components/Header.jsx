import { StyleSheet } from "react-native";
import { View, Text } from "react-native";

export function Header() {
  return (
    <View style={styles.header}>
      <Text style={{ color: "#fff", fontSize: 35 }}>Mis notas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: "#1e1e1e",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 5,
  },
});
