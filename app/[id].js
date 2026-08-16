import { Link, Stack, router, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Screen } from "../components/Screen";
import { Atras } from "../components/Icons";

export default function NotaAmpliada() {
  const { id } = useLocalSearchParams();

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
          headerRight: () => {
            <Text></Text>
          }
        }}
      />

      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: "#181818" }}
      >
        <Link href="/">
          <Text>Volver atras</Text>
        </Link>
        <Text className="text-white font-bold">Texto de la nota</Text>
      </View>
    </Screen>
  );
}
