import { useState, useEffect, useRef } from "react";
import { View, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useHiddenNotes } from "../hooks/useNotes";
import { FlatList, Animated } from "react-native";
import { NotaMenu } from "./NotaMenu";
import { Screen } from "./Screen";
import { Anadir, Contrasena } from "./Icons";

export const Privadas = () => {
  const opacity = useRef(new Animated.Value(0)).current;

  const [listaOcultas, setListaOcultas] = useHiddenNotes();

  useEffect(() => {
    Animated.timing(opacity, {
      duration: 400,
      toValue: 1,
      delay: 300,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  return (
    <SafeAreaProvider>
      <Screen>
        <Animated.View style={{ flex: 1, opacity }}>
          {listaOcultas.length === 0 ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Contrasena className="pb-3" color={"gray"} />
              <Text style={{ color: "#717171" }}>No hay notas ocultas</Text>
            </View>
          ) : (
            <FlatList
              numColumns={2}
              data={listaOcultas}
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
                  hidden={item.hidden}
                  onRefresh={setListaOcultas}
                ></NotaMenu>
              )}
            ></FlatList>
          )}
        </Animated.View>
      </Screen>
    </SafeAreaProvider>
  );
};
