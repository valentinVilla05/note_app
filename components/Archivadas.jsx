import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text } from "react-native";
import { NotaMenu } from "./NotaMenu";
import { FlatList } from "react-native";
import { useCallback, useEffect, useState, useRef } from "react";
import { Animated } from "react-native";
import { useFocusEffect } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Screen } from "./Screen";

export const Archivadas = () => {
  const [notasGuardadas, setNotasGuardadas] = useState([]);
  const opacity = useRef(new Animated.Value(0)).current;

  const conseguirNotasArchivadas = async () => {
    const listaNotas = await AsyncStorage.getItem("notas");
    const notasGuardadas = listaNotas !== null ? JSON.parse(listaNotas) : [];

    setNotasGuardadas(notasGuardadas);
  };

  const notasArchivadas = notasGuardadas.filter(
    (nota) => nota.archived == true,
  );

  useFocusEffect(
    useCallback(() => {
      conseguirNotasArchivadas();
    }, []),
  );

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
          <FlatList
            numColumns={2}
            data={notasArchivadas}
            keyExtractor={(nota) => String(nota.id)}
            renderItem={({ item }) => (
              <NotaMenu
                id={item.id}
                title={item.title}
                text={item.text}
                favourite={item.favourite}
                pinned={item.pinned}
                date={item.date}
                lastUpdate={item.lastUpdate}
                colorTheme={item.colorTheme}
                deleteDate={item.deleteDate}
                archived={item.archived}
                onNotaEliminada={conseguirNotasArchivadas}
                onNotaMarcada={conseguirNotasArchivadas}
                onNotaFijada={conseguirNotasArchivadas}
                onNotaArchivada={conseguirNotasArchivadas}
              ></NotaMenu>
            )}
          ></FlatList>
        </Animated.View>
      </Screen>
    </SafeAreaProvider>
  );
};

export function AnimatedArchives() {
  return <Archivadas />;
}
