import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  Pressable,
  Dimensions,
  Modal,
  Animated,
} from "react-native";
import {
  Ajustes,
  Archivado,
  Ocultar,
  Contrasena,
  Menu,
  Notas,
  Recordarorio,
} from "../components/Icons";
import { useEffect, useRef, useState } from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Link, usePathname } from "expo-router";
import { migrateFromAsyncStorage } from "../db/migrator";

const anchoMenu = Dimensions.get("window").width * 0.6;

export default function Layout() {
  const insets = useSafeAreaInsets();
  const [migracionLista, setMigracionLista] = useState(false);
  const rutaActual = usePathname();

  useEffect(() => {
    migrateFromAsyncStorage().finally(() => setMigracionLista(true));
  }, []);

  const animacionX = useRef(new Animated.Value(-anchoMenu)).current;
  const [mostrarMenu, setMostrarMenu] = useState(false);

  const abrirMenu = () => {
    setMostrarMenu(true);
    Animated.timing(animacionX, {
      toValue: 0,
      duration: 400,
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

  if (!migracionLista) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#181818",
        }}
      >
        <StatusBar style="light" />
      </View>
    );
  }

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
            <Link
              href={{
                pathname: "/",
              }}
              asChild
            >
              <Pressable
                className="p-4 rounded-md flex-row items-center active:bg-[#3d3d3d]"
                onPress={() => setMostrarMenu(false)}
                style={{
                  backgroundColor: rutaActual == "/" ? "#3d3d3d" : "#181818",
                }}
              >
                <Notas color={"white"} size={22} className="me-3" />
                <Text className="text-white text-xl ">Mis notas</Text>
              </Pressable>
            </Link>
            <Link
              href={{
                pathname: "archivo",
              }}
              asChild
            >
              <Pressable
                className="p-4 rounded-md flex-row items-center active:bg-[#3d3d3d]"
                onPress={() => setMostrarMenu(false)}
                style={{
                  backgroundColor:
                    rutaActual == "/archivo" ? "#3d3d3d" : "#181818",
                }}
              >
                <Archivado color={"white"} size={22} className="me-3" />
                <Text className="text-white text-xl ">Notas archivadas</Text>
              </Pressable>
            </Link>
            <Link
              href={{
                pathname: "privado",
              }}
              asChild
            >
              <Pressable
                className="p-4 rounded-md flex-row items-center active:bg-[#3d3d3d]"
                onPress={() => setMostrarMenu(false)}
                style={{
                  backgroundColor:
                    rutaActual == "/privado" ? "#3d3d3d" : "#181818",
                }}
              >
                <Ocultar color={"white"} size={22} className="me-3" />
                <Text className="text-white text-xl ">Notas Privadas</Text>
              </Pressable>
            </Link>
            <Link
              href={{
                pathname: "gestorContrasenas",
              }}
              asChild
            >
              <Pressable
                onPress={() => {
                  setMostrarMenu(false);
                }}
                className="rounded-md active:bg-[#3d3d3d]"
                style={{
                  backgroundColor:
                    rutaActual == "/gestorContrasenas" ? "#3d3d3d" : "#181818",
                }}
              >
                <View className="p-4 rounded-md flex-row items-center">
                  <Contrasena color={"white"} size={22} className="me-3" />
                  <Text className="text-white text-xl ">
                    Gestor de contraseñas
                  </Text>
                </View>
              </Pressable>
            </Link>
            <Link
              href={{
                pathname: "recordatorios",
              }}
              asChild
            >
              <Pressable
                onPress={() => {
                  setMostrarMenu(false);
                }}
                className="rounded-md active:bg-[#3d3d3d]"
                style={{
                  backgroundColor:
                    rutaActual == "/recordatorios" ? "#3d3d3d" : "#181818",
                }}
              >
                <View className="p-4 rounded-md flex-row items-center">
                  <Recordarorio color={"white"} size={22} className="me-3" />
                  <Text className="text-white text-xl ">Recordatorios</Text>
                </View>
              </Pressable>
            </Link>
          </Animated.View>
          <Pressable className="flex-1 bg-transparent" onPress={cerrarMenu} />
        </View>
      </Modal>
    </View>
  );
}
