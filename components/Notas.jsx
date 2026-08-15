import { View, Text } from "react-native";
import { FlatList, Animated, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Nota } from "./NotaMenu";

const listaNotas = [
  { id: 1, title: "Nota Prueba", text: "Esto es una prueba" },
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
];

export function Notas() {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  return (
    <Animated.View style={{ flex: 1, opacity }}>
      {listaNotas.length === 0 ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons name="add" size={30} color="#717171" />
          <Text style={{ color: "#717171" }}>
            Aún no tienes notas escritas.
          </Text>
        </View>
      ) : (
        <FlatList
        numColumns={2}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 20 }}
          data={listaNotas}
          keyExtractor={(nota) => String(nota.id)}
          renderItem={({ item }) => (
            <Nota title={item.title} text={item.text} style={styles.nota}/>
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
    flexDirection: 'row'
  },
});
