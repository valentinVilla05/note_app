import { View, Text, FlatList } from "react-native";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NotasEliminadas } from "./NotasEliminadas";

export function PapeleraMain() {
  const [papeleraGuardadas, setPapeleraGuardadas] = useState([]);

  useFocusEffect(
    useCallback(() => {
      cargarNotasBorradas();
    }, []),
  );

  const cargarNotasBorradas = async () => {
    try {
      const listaNotasBorradas = await AsyncStorage.getItem("papelera");
      const papelera =
        listaNotasBorradas != null ? JSON.parse(listaNotasBorradas) : [];

      if (!Array.isArray(papelera)) {
        papelera = [];
      }

      const papeleraFiltrada = papelera.filter((nota) => {
        if (!nota.deleteDate) return true;
        return Date.now() - nota.deleteDate < 2592000000;
      });

      if (papeleraFiltrada.length !== papelera.length) {
        await AsyncStorage.setItem(
          "papelera",
          JSON.stringify(papeleraFiltrada),
        );
      }

      setPapeleraGuardadas(papeleraFiltrada);
    } catch (error) {
      console.error("Error al cargar la papelera:", error);
    }
  };
  return (
    <View className="flex-1 bg-['#181818'] items-center justify-center">
      {papeleraGuardadas?.length === 0 ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ color: "#717171" }}>
            No hay notas en la papelera.
          </Text>
        </View>
      ) : (
        <FlatList
          numColumns={2}
          data={papeleraGuardadas}
          keyExtractor={(nota) => String(nota.id)}
          renderItem={({ item }) => (
            <NotasEliminadas
              id={item.id}
              title={item.title}
              text={item.text}
              favourite={item.favourite}
              pinned={item.pinned}
              date={item.date}
              lastUpdate={item.lastUpdate}
              colorTheme={item.colorTheme}
              deleteDate={item.deleteDate}
              onNotaEliminadaPermanentemente={cargarNotasBorradas()}
              onNotaRestaurada={cargarNotasBorradas()}
            />
          )}
        />
      )}
    </View>
  );
}
