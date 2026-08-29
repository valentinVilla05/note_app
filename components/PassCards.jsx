import { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { Mostrar, Ocultar, Opciones, PapeleraIcon } from "./Icons";
export const PassCards = (props) => {
  const [mostrar, setMostrar] = useState(false);

  const { app, pass, onDeletePassword, onActualizarContrasena } = props;

  const [contrasena, setNuevaContrasena] = useState(pass);

  const guardarCambio = () => {
    if (contrasena !== pass && onActualizarContrasena) {
      onActualizarContrasena(contrasena);
    }
  };

  return (
    <View className="m-2 bg-[#353535] w-[95%] rounded-md flex flex-row justify-between items-center p-2">
      <View className="flex flex-1 flex-row justify-between m-2 items-center">
        <Text className="text-white text-lg">{app}</Text>

        {mostrar == true ? (
          <TextInput
            className="text-white bg-[#454545] flex-1 mx-8"
            value={contrasena}
            onChangeText={setNuevaContrasena}
            onBlur={guardarCambio}
            onSubmitEditing={guardarCambio}
          ></TextInput>
        ) : (
          <Text className="text-white">{!pass ? "" : "****"}</Text>
        )}
        <Pressable
          onPress={() => {
            setMostrar(!mostrar);
          }}
        >
          {mostrar == false ? (
            <Mostrar color={"white"} />
          ) : (
            <Ocultar color={"white"} />
          )}
        </Pressable>
      </View>
      <Pressable hitSlop={10} onPress={props.onDeletePassword}>
        <PapeleraIcon className="ms-4 me-2" color={"red"} />
      </Pressable>
    </View>
  );
};
