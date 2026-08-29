import { useEffect, useRef, useState } from "react";
import { Link } from "expo-router";
import { Privadas } from "../components/Privadas";
import * as LocalAuthentication from "expo-local-authentication";
import {
  Pressable,
  View,
  Text,
  ActivityIndicator,
  AppState,
} from "react-native";
import { Gestor } from "../components/Gestor";
import { usePreventScreenCapture } from "expo-screen-capture";
import * as Portapapeles from "expo-clipboard";

export default function gestorContrasenas() {
  usePreventScreenCapture();

  const [autorizado, setAutorizado] = useState(false);
  const [cargando, setCargando] = useState(false);

  const TIEMPO_EXPIRACION = 240000;
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current === "active" &&
        nextAppState.match(/inactive|background/)
      ) {
        limpiarPortapapeles();
        setAutorizado(false);
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    let timer;
    if (autorizado) {
      timer = setTimeout(() => {
        limpiarPortapapeles();
        setAutorizado(false);
        pedirAutenticacion();
      }, TIEMPO_EXPIRACION);
    }
    return () => clearTimeout(timer);
  }, [autorizado]);

  const pedirAutenticacion = async () => {
    setCargando(true);
    try {
      const tiposAcceso =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

      if (
        tiposAcceso.includes(
          LocalAuthentication.AuthenticationType.FINGERPRINT,
        ) ||
        tiposAcceso.includes(
          LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
        )
      ) {
        const hayAutenticacion = await LocalAuthentication.isEnrolledAsync();
        if (hayAutenticacion) {
          const autenticacion = await LocalAuthentication.authenticateAsync({
            promptDescription: "Accede a tus contraseñas",
            fallbackLabel: "Usar PIN",
            cancelLabel: "Cancelar",
          });
          autenticacion.success ? setAutorizado(true) : setAutorizado(false);
        } else {
          alert(
            "Configura la biometria o el PIN en los ajustes de tu dispositivo",
          );
        }
      } else {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Accede a tus notas privadas",
          fallbackLabel: "Usar PIN",
          cancelLabel: "Cancelar",
        });

        result.success ? setAutorizado(true) : alert("Autenticación cancelada");
      }
    } catch (e) {
      alert("Autenticación fallida");
    } finally {
      setCargando(false);
    }
  };

  const limpiarPortapapeles = async () => {
    await Portapapeles.setStringAsync("");
  };

  return (
    <View className="flex-1 bg-['#181818']">
      {autorizado ? (
        <Gestor />
      ) : cargando ? (
        <ActivityIndicator />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Pressable
            className="bg-[#e17f29] active:bg-[#cf701e] p-4 rounded-lg"
            onPress={pedirAutenticacion}
          >
            <Text className="text-white">Desbloquear</Text>
          </Pressable>
          <Link
            asChild
            href={{
              pathname: "/",
            }}
          >
            <Pressable className="bg-[#e17f29] active:bg-[#cf701e] p-3 rounded-lg mt-5">
              <Text className="text-white text-sm">Volver a Mis notas</Text>
            </Pressable>
          </Link>
        </View>
      )}
    </View>
  );
}
