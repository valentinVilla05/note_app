import {
  Pressable,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Modal,
  Platform,
  FlatList,
  Alert,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { PassCards } from "./PassCards";
import { useEffect, useState } from "react";
import { Screen } from "./Screen";
import { Anadir, Cancelar } from "./Icons";

export const Gestor = () => {
  const [password, setPassword] = useState("");
  const [app, setApp] = useState("");
  const [menuCrear, setMenuCrear] = useState(false);
  const [listaPasswords, setListaPasswords] = useState([]);

  useEffect(() => {
    getPasswords();
  }, []);

  const guardarContrasena = async (key, value) => {
    try {
      await SecureStore.setItemAsync(key, value);

      const lista = await SecureStore.getItemAsync("indice_passwords");

      let listaKeys = lista ? JSON.parse(lista) : [];

      if (!listaKeys.includes(key)) {
        listaKeys.push(key);
        await SecureStore.setItemAsync(
          "indice_passwords",
          JSON.stringify(listaKeys),
        );
      }
      setMenuCrear(false);

      getPasswords();
    } catch (e) {
      alert("Error al guardar la contraseñ");
    }
  };

  const getPasswords = async () => {
    try {
      const lista = await SecureStore.getItemAsync("indice_passwords");

      if (!lista) {
        setListaPasswords([]);
        return;
      }

      const listaConvertida = JSON.parse(lista);
      const contrasenasCompletas = [];

      for (const pass of listaConvertida) {
        const valor = await SecureStore.getItemAsync(pass);
        contrasenasCompletas.push({ app: pass, password: valor });
      }

      setListaPasswords(contrasenasCompletas);
    } catch (e) {
      alert("Error al cargar las contraseñas");
    }
  };

  const deletePassword = (key) => {
    Alert.alert(
      "¿Quiere borrar esta contraseña?",
      "Esta acción es irreversible",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await SecureStore.deleteItemAsync(key);

              const lista = await SecureStore.getItemAsync("indice_passwords");

              if (lista) {
                const listaKeys = JSON.parse(lista);
                const nuevaLista = listaKeys.filter((appKey) => appKey !== key);

                await SecureStore.setItemAsync(
                  "indice_passwords",
                  JSON.stringify(nuevaLista),
                );
              }
              await getPasswords();
            } catch (e) {
              Alert.alert("Error", "Error al borrar la contraseña");
            }
          },
        },
      ],
    );
  };

  const actualizarContrasena = async (app, newPass) => {
    try {
      await SecureStore.setItemAsync(app, newPass);
      await getPasswords();
    } catch (e) {
      alert("Error al actualiazr la contraseña");
    }
  };
  return (
    <>
      <SafeAreaProvider>
        <Screen>
          <View className="flex-1 w-full flex-col items-center justify-center pt-5">
            <Text className="color-[#717171] text-center text-sm m-2">
              Por seguridad, esta pantalla volverá a pedir autenticación cada 2
              minutos. Cada vez que reveles una contraseña esta se ocultará
              automáticamente a los 30 segundos.
            </Text>
            {listaPasswords.length > 0 ? (
              <FlatList
                numColumns={1}
                data={listaPasswords}
                keyExtractor={(item) => item.app}
                renderItem={({ item }) => (
                  <PassCards
                    app={item.app}
                    pass={item.password}
                    onDeletePassword={() => deletePassword(item.app)}
                    onActualizarContrasena={(nuevaContrasena) =>
                      actualizarContrasena(item.app, nuevaContrasena)
                    }
                  />
                )}
              />
            ) : (
              <View className="flex-1 items-center justify-center w-full">
                <Anadir />
                <Text style={{ color: "#717171" }}>
                  Aún no tienes contraseñas guardadas.
                </Text>
              </View>
            )}
            <Pressable
              onPress={() => setMenuCrear(true)}
              className="absolute bottom-6 bg-[#e17f29] active:bg-[#cf701e] px-6 h-12 flex flex-row items-center justify-center rounded-full shadow-lg z-10"
            >
              <Text className="text-white font-semibold text-base">
                + Añadir contraseña
              </Text>
            </Pressable>
          </View>
        </Screen>
      </SafeAreaProvider>

      <Modal
        visible={menuCrear}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMenuCrear(false)}
      >
        <Pressable
          className="flex-1 bg-black/70"
          onPress={() => {
            Keyboard.dismiss();
            setMenuCrear(false);
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <Pressable
                className="bg-[#2d2d2d] rounded-t-3xl p-6 w-full items-center"
                onPress={(e) => e.stopPropagation()}
              >
                <View className="w-full flex-row justify-between items-center mb-4">
                  <Text className="text-white text-lg font-bold">
                    Nueva Contraseña
                  </Text>
                  <Pressable hitSlop={8} onPress={() => setMenuCrear(false)}>
                    <Cancelar size={22} color="white" />
                  </Pressable>
                </View>

                <Text className="text-gray-400 text-xs mb-6 text-center">
                  Las contraseñas se guardan encriptadas localmente en su propio
                  dispositivo.
                </Text>

                <View className="w-full mb-4">
                  <Text className="text-white mb-1 font-medium">
                    Aplicación / Servicio
                  </Text>
                  <TextInput
                    value={app}
                    placeholder="Ej: Instagram, Netflix..."
                    placeholderTextColor="#888"
                    className="bg-[#404040] text-white px-4 py-3 rounded-lg w-full"
                    onChangeText={setApp}
                  />
                </View>

                <View className="w-full mb-6">
                  <Text className="text-white mb-1 font-medium">
                    Contraseña
                  </Text>
                  <TextInput
                    value={password}
                    secureTextEntry={true}
                    placeholder="Tu contraseña secreta"
                    placeholderTextColor="#888"
                    className="bg-[#404040] text-white px-4 py-3 rounded-lg w-full"
                    onChangeText={setPassword}
                  />
                </View>

                <Pressable
                  className="bg-[#e17f29] active:bg-[#cf701e] w-full h-12 items-center justify-center rounded-lg"
                  onPress={() => guardarContrasena(app, password)}
                >
                  <Text className="text-white font-semibold text-base">
                    Guardar contraseña
                  </Text>
                </Pressable>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </>
  );
};
