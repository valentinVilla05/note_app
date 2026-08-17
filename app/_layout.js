import { Stack } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { Main } from "../components/Main";
import { Menu } from "../components/Icons";

export default function Layout() {
  return (
    <View className="flex-1">
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#181818" },
          headerTintColor: "white",
          headerTitle: "",
          headerLeft: () => (
            <Pressable onPress={() => alert("Esto es un menu")}>
              <Menu />
            </Pressable>
          ),
          headerRight: () => (
            <Text
              style={{ color: "#c8c8c8", fontSize: 30 }}
            >
              Mis notas
            </Text>
          ),
        }}
      />
    </View>
  );
}
