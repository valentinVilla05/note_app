import { View, Text } from "react-native";
import { FlatList, Animated, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Nota } from "./NotaMenu";
import { Anadir } from "./Icons";
import { Link } from "expo-router";

const listaNotas = [
  {
    id: 1,
    title: "Nota Prueba",
    text: "Esto es una pruebaEsto es una pruebaEsto es una pruebaEsto es una prueba",
  },
  { id: 2, title: "Nota Prueba 2", text: "Esto es otra prueba" },
  { id: 3, title: "Nota Prueba 3", text: "Esto es otra prueba mas" },
  { id: 4, title: "Nota Prueba", text: "Esto es una prueba" },
  { id: 5, title: "Nota Prueba 2", text: "Esto es otra prueba" },
  { id: 6, title: "Nota Prueba 3", text: "Esto es otra prueba mas" },
  { id: 7, title: "Nota Prueba", text: "Esto es una prueba" },
  { id: 8, title: "Nota Prueba 2", text: "Esto es otra prueba" },
  { id: 9, title: "Nota Prueba 3", text: "Esto es otra prueba mas" },
  { id: 10, title: "Nota Prueba", text: "Esto es una prueba" },
  { id: 11, title: "Nota Prueba 2", text: "Esto es otra prueba" },
  { id: 12, title: "Nota Prueba 3", text: "Esto es otra prueba mas" },
  { id: 13, title: "Nota Prueba", text: "Esto es una prueba" },
  { id: 14, title: "Nota Prueba 2", text: "Esto es otra prueba" },
  { id: 15, title: "Nota Prueba 3", text: "Esto es otra prueba mas" },
  { id: 16, title: "Nota Prueba", text: "Esto es una prueba" },
  { id: 17, title: "Nota Prueba 2", text: "Esto es otra prueba" },
  { id: 18, title: "Nota Prueba 3", text: "Esto es otra prueba mas" },
  { id: 19, title: "Nota Prueba", text: "Esto es una prueba" },
  { id: 20, title: "Nota Prueba 2", text: "Esto es otra prueba" },
  { id: 21, title: "Nota Prueba 3", text: "Esto es otra prueba mas" },
  { id: 22, title: "Nota Prueba", text: "Esto es una prueba" },
  { id: 23, title: "Nota Prueba 2", text: "Esto es otra prueba" },
  { id: 24, title: "Nota Prueba 3", text: "Esto es otra prueba mas" },
];

export function Notas({ nota, index }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      delay: index * 1000,
      useNativeDriver: true,
    }).start();
  }, [opacity, index]);

  return (
    <Animated.View style={{ flex: 1, opacity }}>
      {listaNotas.length === 0 ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Anadir />
          <Text style={{ color: "#717171" }}>
            Aún no tienes notas escritas.
          </Text>
        </View>
      ) : (
        <FlatList
          numColumns={2}
          data={listaNotas}
          keyExtractor={(nota) => String(nota.id)}
          renderItem={({ item }) => (
            <Nota
              id={item.id}
              title={item.title}
              text={
                item.text.length > 100
                  ? item.text.slice(0, 100).concat("...")
                  : item.text
              }
              style={styles.nota}
            />
          )}
        />
      )}
    </Animated.View>
  );
}

export function AnimatedNotes() {
  return <Notas />;
}

const styles = StyleSheet.create({
  nota: {
    flexDirection: "row",
  },
});
