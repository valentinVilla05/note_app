import { View, Text } from "react-native";
import { NotaMenu } from "./NotaMenu";
import { FlatList } from "react-native";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Screen } from "./Screen";
import { useArchivedNotes } from "../hooks/useNotes";
import { Anadir } from "./Icons";

export const Archivadas = () => {
  const opacity = useRef(new Animated.Value(0)).current;

  const [notasArchivadas, refreshArchivadas] = useArchivedNotes();

  useEffect(() => {
    Animated.timing(opacity, {
      duration: 400,
      toValue: 1,
      delay: 500,
      useNativeDriver: true,
    }).start();
  }, [opacity]);
  return (
    <SafeAreaProvider>
      <Screen>
        <Animated.View style={{ flex: 1, opacity }}>
          {notasArchivadas.length === 0 ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Anadir />
              <Text style={{ color: "#717171" }}>
                No hay notas archivadas
              </Text>
            </View>
          ) : (
            <FlatList
              numColumns={2}
              data={notasArchivadas}
              keyExtractor={(nota) => String(nota.id)}
              renderItem={({ item }) => (
                <NotaMenu
                  id={item.id}
                  title={item.title}
                  content={item.content}
                  favourite={item.favourite}
                  pinned={item.pinned}
                  colorTheme={item.colorTheme}
                  archived={item.archived}
                  onRefresh={refreshArchivadas}
                ></NotaMenu>
              )}
            ></FlatList>
          )}
        </Animated.View>
      </Screen>
    </SafeAreaProvider>
  );
};

export function AnimatedArchives() {
  return <Archivadas />;
}
