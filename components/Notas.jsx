import { View, Text, FlatList, Animated, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { NotaMenu } from "./NotaMenu";
import { Anadir } from "./Icons";
import { Link } from "expo-router";
import { useActiveNotes, useNotesWithoutfolder } from "../hooks/useNotes";

export function Notas({
  index,
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

  const [notas, refreshNotas] = useNotesWithoutfolder();
  return (
    <Animated.View style={{ flex: 1, opacity }}>
      {notas.length === 0 ? (
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
          data={notas}
          keyExtractor={(nota) => String(nota.id)}
          renderItem={({ item }) => (
            <NotaMenu
              id={item.id}
              title={item.title}
              content={item.content}
              folderId={item.folderId}
              favourite={item.favourite}
              pinned={item.pinned}
              colorTheme={item.colorTheme}
              archived={item.archived}
              hidden={item.hidden}
              onRefresh={refreshNotas}
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
