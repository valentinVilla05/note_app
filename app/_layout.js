import { Stack } from "expo-router";
import {
  View,
  Text,
  Pressable,
  Dimensions,
  Modal,
  Animated,
} from "react-native";
import { Main } from "../components/Main";
import { Ajustes, Archivado, Contrasena, Menu } from "../components/Icons";
import { useRef, useState } from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { coloresToolBar as colorHeader } from "../data/utils";

const anchoMenu = Dimensions.get("window").width * 0.6;

export default function Layout() {
  const insets = useSafeAreaInsets();

  const animacionX = useRef(new Animated.Value(-anchoMenu)).current;
  const [mostrarMenu, setMostrarMenu] = useState(false);

  const abrirMenu = () => {
    setMostrarMenu(true);
    Animated.timing(animacionX, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const cerrarMenu = () => {
    Animated.timing(animacionX, {
      toValue: -anchoMenu,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setMostrarMenu(false);
    });
  };

  return (
    <View className="flex-1">
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#181818" },
          headerTintColor: "white",
          headerTitle: "",
          headerLeft: () => (
            <Pressable onPress={abrirMenu}>
              <Menu color={"white"} />
            </Pressable>
          ),
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>

      <Modal
        visible={mostrarMenu}
        transparent={true}
        animationType="none"
        onRequestClose={() => {
          setMostrarMenu(false);
        }}
      >
        <View
          style={{
            marginTop: insets.top,
            marginBottom: insets.bottom,
          }}
          className="flex-1 flex-row"
        >
          <Animated.View
            style={{ transform: [{ translateX: animacionX }] }}
            className="w-[60%] bg-[#181818] h-full p-6 z-50 border-r border-gray-800 shadow-2xl"
          >
            <Pressable
              onPress={() => {
                alert("Proximamente");
                setMostrarMenu(false);
              }}
            >
              <View className="flex-row">
                <Archivado
                  color={"white"}
                  size={22}
                  className="me-3"
                ></Archivado>
                <Text className="text-white text-xl  mb-8 ">
                  Notas archivadas
                </Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => {
                alert("Proximamente");
                setMostrarMenu(false);
              }}
            >
              <View className="flex-row ">
                <Contrasena color={"white"} size={22} className="me-3" />
                <Text className="text-white text-xl  mb-8 ">
                  Gestor de contraseñas
                </Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => {
                alert("Proximamente");
                setMostrarMenu(false);
              }}
            >
              <View className="flex-row ">
                <Ajustes color={"white"} size={22} className="me-3" />
                <Text className="text-white text-xl  mb-8 ">Ajustes</Text>
              </View>
            </Pressable>
          </Animated.View>
          <Pressable className="flex-1 bg-transparent" onPress={cerrarMenu} />
        </View>
      </Modal>
    </View>
  );
}
