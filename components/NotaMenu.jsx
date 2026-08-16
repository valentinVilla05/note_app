import { View, Text, Pressable } from "react-native";
import { StyleSheet } from "react-native";

export const Nota = (props) => {
  return (
    <Pressable onPress={() => {alert("Soy una nota")}} style={styles.celda}>
      <View>
        <Text
          style={{
            textAlign: "left",
            fontSize: 20,
            fontStyle: "italic",
            color: "white",
            backgroundColor: "#373737",
            borderRadius: 10,
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 0,
            padding: 5,
          }}
        >
          {props.title}
        </Text>
        <View>
          <Text
            style={{
              color: "white",
              padding: 5,
              fontWeight: 300,
              fontSize: 14,
            }}
          >
            {props.text}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  celda: {
    width: '48%',
    alignSelf: 'flex-start',
    backgroundColor: "#4a4a4a",
    margin: 7,
    borderRadius: 10,
    minWidth: 150,
  },
});
