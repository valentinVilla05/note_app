import { ActivityIndicator } from "react-native";
import { StyleSheet } from "react-native";
import { View, Text } from "react-native";
import { Nota } from "./Nota";
import { FlatList } from "react-native";

const listaNotas = [
  { id: 1, title: "Nota Prueba", text: "Esto es una prueba" },
  { id: 2, title: "Nota Prueba 2", text: "Esto es otra prueba" },
  { id: 3, title: "Nota Prueba 3", text: "Esto es otra prueba mas" },
];

export function Notas() {

    return (
      <View>
        <FlatList
          data={listaNotas}
          keyExtractor={(nota) => nota.id}
          renderItem={({ item }) => (
            <Nota title={item.title} text={item.text} />
          )}
        ></FlatList>
      </View>
    );
}