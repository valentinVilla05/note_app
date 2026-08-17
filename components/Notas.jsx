import { View, Text } from "react-native";
import { FlatList, Animated, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { NotaMenu } from "./NotaMenu";
import { Anadir } from "./Icons";
import { Link } from "expo-router";

export function Notas({
  index,
  listaNotas,
  onNotaEliminada,
  onNotaMarcada,
  onNotaFijada,
}) {
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
      {listaNotas?.length === 0 ? (
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
            <NotaMenu
              id={item.id}
              title={item.title}
              text={
                item.text.length > 100
                  ? item.text.slice(0, 100).concat("...")
                  : item.text
              }
              favourite={item.favourite}
              pinned={item.pinned}
              date={item.date}
              lastUpdate={item.lastUpdate}
              colorTheme={item.colorTheme}
              style={styles.nota}
              onNotaEliminada={onNotaEliminada}
              onNotaMarcada={onNotaMarcada}
              onNotaFijada={onNotaFijada}
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
