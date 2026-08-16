import { Link, Stack, router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Screen } from "../components/Screen";
import { Atras } from "../components/Icons";
import { NuevaNota } from "../components/NuevaNota";

export default function NotaAmpliada() {
  const { id, title, text } = useLocalSearchParams();

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: " ",
          headerTintColor: "white",
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ marginLeft: 12 }}>
              <Atras />
            </Pressable>
          ),
          headerRight: () => <Text />,
        }}
      />
        <NuevaNota id={id} title={title} text={text}/>
    </Screen>
  );
}
