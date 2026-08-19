import { View, Text, FlatList } from "react-native";
import { NotasEliminadas } from "./NotasEliminadas";
import { useDeletedNotes } from "../hooks/useNotes";

export function PapeleraMain() {
  const [notasPapelera, refreshPapelera] = useDeletedNotes();

  return (
    <View className="flex-1 bg-['#181818'] items-center justify-center">
      {notasPapelera.length === 0 ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ color: "#717171" }}>No hay notas en la papelera.</Text>
        </View>
      ) : (
        <FlatList
          numColumns={2}
          data={notasPapelera}
          keyExtractor={(nota) => String(nota.id)}
          renderItem={({ item }) => (
            <NotasEliminadas
              id={item.id}
              title={item.title}
              content={item.content}
              favourite={item.favourite}
              pinned={item.pinned}
              colorTheme={item.colorTheme}
              onRefresh={refreshPapelera}
            />
          )}
        />
      )}
    </View>
  );
}
