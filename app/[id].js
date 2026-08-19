import { Link, Stack, router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Screen } from "../components/Screen";
import { Atras } from "../components/Icons";
import { Editor } from "../components/Editor";
import { useState } from "react";
import { coloresFondo, coloresToolBar as colorHeader } from "../data/utils";

export default function NotaAmpliada() {
  const params = useLocalSearchParams();

  const [colorTheme, setColorTheme] = useState(params.colorTheme || "black");

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: " ",
          headerTintColor: colorTheme === "black" ? "white" : "black",
          headerStyle: {
            backgroundColor: colorHeader[colorTheme] || "#181818",
          },
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ marginLeft: 12 }}>
              <Atras />
            </Pressable>
          ),
          headerRight: () => <Text />,
        }}
      />
      <Editor
        colorTheme={colorTheme}
        onColorChange={setColorTheme}
      />
    </Screen>
  );
}
