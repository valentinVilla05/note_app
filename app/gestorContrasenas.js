import { useEffect, useState } from "react";
import { Link } from "expo-router";
import { Privadas } from "../components/Privadas";
import * as LocalAuthentication from "expo-local-authentication";
import { Pressable, View, Text, ActivityIndicator } from "react-native";
import { Gestor } from "../components/Gestor";

export default function gestorContrasenas() {
  const [autorizado, setAutorizado] = useState(false);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const iniciar = async () => {
      await pedirAutenticacion();
    };
  });

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
