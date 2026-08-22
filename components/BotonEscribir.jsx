import { createNote } from "../db/notesRepository";
import { router } from "expo-router";
import { StyleSheet, View, Pressable, Text } from "react-native";
import { Anadir } from "./Icons";

export const BotonEscribir = (props) => {
  const idCarpeta = props.folderId || null;
  const crearNota = async () => {
    try {
      const nuevaNota = await createNote({}, idCarpeta);
      router.push(`/${nuevaNota.id}`);
    } catch (e) {
      alert("Error al crear nota");
    }
  };
  return (
    <View style={styles.botonAnadir}>
      <Pressable
        onPress={crearNota}
        accessibilityRole="button"
        accessibilityLabel="Escribir nota"
        className="bg-[#e17f29] active:bg-[#cf701e] active:opacity-50"
      >
        {({ pressed }) => (
          <View
            className="justify-center items-center"
            style={{
              opacity: pressed ? 0.5 : 1,
            }}
          >
            <Anadir className="" color="white" />
          </View>
        )}
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  botonAnadir: {
    backgroundColor: "#e17f29",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignSelf: "flex-end",
    marginRight: 30,
    position: "absolute",
    bottom: 40,
  },
});
