import { SafeAreaProvider } from "react-native-safe-area-context";
import { Screen } from "./Screen";
import { useEffect, useState, useRef } from "react";
import {
  Animated,
  View,
  Text,
  FlatList,
  Pressable,
  Modal,
  TextInput,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useReminders } from "../hooks/useNotes";
import { RecordatorioCard } from "./RecordatorioCard";
import { Anadir, Cancelar, Circulo, Recordarorio } from "./Icons";
import { useNotificationSetup } from "../data/utils";
import {
  createReminder,
  deleteReminder,
  updateReminder,
} from "../db/notesRepository";
import { AppState } from "react-native";

export const Recordatorios = () => {
  const opacity = useRef(new Animated.Value(0)).current;

  const [recordatorios, setRecordatorios] = useReminders();
  const {
    programarNotificacion,
    cancelarNotificacion,
    cancelarTodasLasNotificaciones,
    renovarNotificaciones,
  } = useNotificationSetup();

  const [menuCrear, setMenuCrear] = useState(false);
  const [modoPicker, setModoPicker] = useState("date");
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState(new Date());
  const [modalRepetir, setModalRepetir] = useState(false);
  const [repetirTexto, setRepetirTexto] = useState("No repetir");
  const [repetir, setRepetir] = useState(0);
  const [modalTiempo, setModalTiempo] = useState(false);
  const [hayPersonalizado, setHayPersonalizado] = useState(false);
  const [tiempoPersonalizado, setTiempoPersonalizado] = useState(0);
  const [unidadTiempo, setUnidadTiempo] = useState("min");

  const [posicion, setPosicion] = useState({ top: 0, left: 0 });

  const abrirMenu = (event) => {
    event.stopPropagation();
    Keyboard.dismiss();

    const { pageX, pageY } = event.nativeEvent;
    const { width, height } = Dimensions.get("window");
    const anchoMenu = 180;
    const altoMenuEstimado = 340;

    const left = Math.min(
      Math.max(10, pageX - anchoMenu),
      width - anchoMenu - 10,
    );
    const top = Math.min(
      Math.max(40, pageY - altoMenuEstimado),
      height - altoMenuEstimado - 20,
    );

    setPosicion({ top, left });

    setModalRepetir(true);
  };

  useEffect(() => {
    Animated.timing(opacity, {
      duration: 400,
      toValue: 1,
      delay: 300,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  const renovando = useRef(false);

  useEffect(() => {
    if (recordatorios.length === 0) return;
    if (renovando.current) return;

    (async () => {
      renovando.current = true;
      try {
        let algunCambio = false;
        for (const record of recordatorios) {
          const resultado = await renovarNotificaciones(record);
          if (resultado) {
            await updateReminder(record.id, {
              notificationId: JSON.stringify(resultado.notificationId),
              date: resultado.date,
            });
            algunCambio = true;
          }
        }
        if (algunCambio) setRecordatorios();
      } finally {
        renovando.current = false;
      }
    })();
  }, [recordatorios]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        setRecordatorios();
      }
    });
    return () => subscription.remove();
  }, []);

  const abrirSelector = (modo) => {
    setModoPicker(modo);
    setMostrarPicker(true);
  };

  const alCambiarFechaHora = (event, fechaSeleccionada) => {
    if (Platform.OS === "android") {
      setMostrarPicker(false);
    }
    if (fechaSeleccionada) {
      setFecha(fechaSeleccionada);
    }
  };

  const crearRecordatorio = async () => {
    if (!nombre.trim()) return;

    const nuevoRecordatorio = await createReminder({
      name: nombre,
      date: fecha.getTime(),
      repeat: repetir || 0,
      completed: false,
      notificationId: null,
    });

    const notificacionIds = await programarNotificacion(
      nombre.trim(),
      fecha.getTime(),
      repetir,
      nuevoRecordatorio.id,
    );

    await updateReminder(nuevoRecordatorio.id, {
      notificationId: JSON.stringify(notificacionIds),
    });

    setNombre("");
    setRepetir(0);
    setRepetirTexto("No repetir");
    setFecha(new Date());
    setMenuCrear(false);
    setRecordatorios();
  };

  const borrarRecordatorio = (id, notificationIdRaw) => {
    Alert.alert(
      "Eliminar recordatorio",
      "¿Seguro que quiere eliminar este recordatorio?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            if (notificationIdRaw) {
              try {
                const ids = JSON.parse(notificationIdRaw);
                await cancelarNotificacion(ids);
              } catch {}
            }
            await deleteReminder(id);
            setRecordatorios();
          },
        },
      ],
    );
  };

  const limpiarNotificacionesHuerfanas = () => {
    Alert.alert(
      "Limpiar notificaciones anticuadas",
      "Esto cancelará todas las notificaciones programadas en el teléfono de recordatorios pasados.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpiar todo",
          onPress: async () => {
            await cancelarTodasLasNotificaciones();
          },
        },
      ],
    );
  };

  // limpiarNotificacionesHuerfanas();

  const calcularTiempoPersonalizado = () => {
    const cantidad = Number(tiempoPersonalizado) || 0;
    if (unidadTiempo == "min") {
      setRepetir(cantidad * 60);
    } else if (unidadTiempo == "horas") {
      setRepetir(cantidad * 3600);
    } else if (unidadTiempo == "dias") {
      setRepetir(cantidad * 3600 * 24);
    } else {
      setRepetir(cantidad * 3600 * 24 * 7);
    }
  };
  return (
    <>
      <SafeAreaProvider>
        <Screen>
          <Animated.View style={{ flex: 1, opacity }}>
            <Text className="color-[#717171] text-center text-sm m-2">
              Debido a limitaciones del sistema las notificaciones suelen llegar
              con 1-3 minutos de retardo por lo que no es recomendable poner
              recordatorios con un intervalo de tiempo muy corto.
            </Text>
            {recordatorios.length === 0 ? (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Anadir className="pb-3" color={"gray"} />
                <Text style={{ color: "#717171" }}>No hay recordatorios</Text>
              </View>
            ) : (
              <FlatList
                contentContainerStyle={{ paddingBottom: 100 }}

                numColumns={1}
                data={recordatorios}
                keyExtractor={(recordatorio) => String(recordatorio.id)}
                renderItem={({ item }) => (
                  <RecordatorioCard
                    id={item.id}
                    name={item.name}
                    date={item.date}
                    repeat={item.repeat}
                    completed={item.completed}
                    created_at={item.createdAt}
                    notification_id={item.notificationId}
                    onDeleteReminder={() => {
                      borrarRecordatorio(item.id, item.notificationId);
                    }}
                  />
                )}
              ></FlatList>
            )}
            <Pressable
              onPress={() => {
                setMenuCrear(true);
              }}
              className="absolute bottom-16 right-36 flex-row p-2 bg-[#e17f29] active:bg-[#cf701e] active:opacity-50 rounded-md w-56 items-center justify-center"
            >
              <Recordarorio color={"white"} className="mx-3" />
              <Text className="text-white">Añadir recordatorio</Text>
            </Pressable>
          </Animated.View>
        </Screen>
      </SafeAreaProvider>
      <Modal
        visible={menuCrear}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setMenuCrear(false)}
      >
        <Pressable
          className="flex-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
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
                style={{ width: "100%", padding: 16, maxHeight: "80%" }}
                className="bg-[#2d2d2d] rounded-t-2xl"
                onPress={(e) => e.stopPropagation()}
              >
                <View className=" flex-row justify-between">
                  <Text className="text-white text-lg font-semibold mb-4">
                    Nuevo recordatorio:
                  </Text>
                  <Pressable hitSlop={7} onPress={() => setMenuCrear(false)}>
                    <Cancelar size={22} color={"white"} />
                  </Pressable>
                </View>

                <View className="flex flex-row items-center my-2">
                  <Text className="text-white w-16">Tarea:</Text>
                  <TextInput
                    value={nombre}
                    onChangeText={setNombre}
                    placeholder="Ej. Comprar leche"
                    placeholderTextColor="#888"
                    className="bg-[#454545] text-white px-3 py-2 rounded-md flex-1"
                  />
                </View>

                <View className="flex flex-row items-center justify-between my-3">
                  <Text className="text-white w-16">Avisar el:</Text>
                  <View className="flex-row flex-1 justify-around">
                    <Pressable
                      onPress={() => abrirSelector("date")}
                      className="bg-[#454545] px-3 py-2 rounded-md"
                    >
                      <Text className="text-white font-medium">
                        {fecha.toLocaleDateString()}
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => abrirSelector("time")}
                      className="bg-[#454545] px-3 py-2 rounded-md"
                    >
                      <Text className="text-white font-medium">
                        {fecha.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </Pressable>
                    <View className="flex flex-col items-center justify-center">
                      <Text className="text-white">Repetir cada:</Text>
                      <Pressable
                        hitSlop={10}
                        onPress={(event) => abrirMenu(event)}
                      >
                        <Text className="text-gray-300">{repetirTexto}</Text>
                      </Pressable>
                    </View>
                    {mostrarPicker && (
                      <DateTimePicker
                        value={fecha}
                        mode={modoPicker}
                        is24Hour={true}
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onValueChange={alCambiarFechaHora}
                      />
                    )}
                  </View>
                </View>
                <Pressable
                  onPress={crearRecordatorio}
                  className="bg-[#e17f29] active:bg-[#cf701e] py-3 mb-8 rounded-md mt-4 items-center"
                >
                  <Text className="text-white font-bold">Guardar</Text>
                </Pressable>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
      <Modal
        visible={modalRepetir}
        transparent={true}
        animationType="none"
        onRequestClose={() => setModalRepetir(false)}
      >
        <Pressable
          className="flex-1"
          style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
          onPress={() => setModalRepetir(false)}
        >
          <Pressable
            style={{
              position: "absolute",
              top: posicion.top,
              left: posicion.left,
              width: 180,
            }}
            className="bg-[#2d2d2d] rounded-xl p-1 border border-gray-700 shadow-2xl z-50"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="flex flex-col">
              <Pressable
                className="flex items-center justify-center my-1 p-3 active:bg-[#454545] rounded"
                onPress={() => {
                  setHayPersonalizado(false);
                  setTiempoPersonalizado(0);
                  setRepetir(0);
                  setRepetirTexto("No repetir");
                  setModalRepetir(false);
                }}
              >
                <Text className="text-gray-300"> No repetir </Text>
              </Pressable>
              <Pressable
                className="flex items-center justify-center my-1 p-3 active:bg-[#454545] rounded"
                onPress={() => {
                  setHayPersonalizado(false);
                  setTiempoPersonalizado(0);
                  setRepetir(3600);
                  setRepetirTexto("Cada hora");
                  setModalRepetir(false);
                }}
              >
                <Text className="text-gray-300"> Cada hora </Text>
              </Pressable>
              <Pressable
                className="flex items-center justify-center my-1 p-3 active:bg-[#454545] rounded"
                onPress={() => {
                  setHayPersonalizado(false);
                  setTiempoPersonalizado(0);
                  setRepetir(28800);
                  setRepetirTexto("Cada 8 horas");
                  setModalRepetir(false);
                }}
              >
                <Text className="text-gray-300">Cada 8 horas</Text>
              </Pressable>
              <Pressable
                className="flex items-center justify-center my-1 p-3 active:bg-[#454545] rounded"
                onPress={() => {
                  setHayPersonalizado(false);
                  setTiempoPersonalizado(0);
                  setRepetir(43200);
                  setRepetirTexto("Cada 12 horas");
                  setModalRepetir(false);
                }}
              >
                <Text className="text-gray-300">Cada 12 horas</Text>
              </Pressable>
              <Pressable
                className="flex items-center justify-center my-1 p-3 active:bg-[#454545] rounded"
                onPress={() => {
                  setHayPersonalizado(false);
                  setTiempoPersonalizado(0);
                  setRepetir(86400);
                  setRepetirTexto("Una vez al dia");
                  setModalRepetir(false);
                }}
              >
                <Text className="text-gray-300">Una vez al dia</Text>
              </Pressable>
              <Pressable
                className="flex items-center justify-center my-1 p-3 active:bg-[#454545] rounded"
                onPress={() => {
                  setHayPersonalizado(false);
                  setTiempoPersonalizado(0);
                  setRepetir(604800);
                  setRepetirTexto("Una vez a la semana");
                  setModalRepetir(false);
                }}
              >
                <Text className="text-gray-300">Una vez a la semana</Text>
              </Pressable>
              {hayPersonalizado == true ? (
                <Pressable
                  className="flex items-center justify-center my-1 p-3 active:bg-[#454545] rounded"
                  onPress={() => {
                    const etiqueta =
                      unidadTiempo == "min"
                        ? `Cada ${tiempoPersonalizado} minutos`
                        : unidadTiempo == "horas"
                          ? `Cada ${tiempoPersonalizado} horas`
                          : unidadTiempo == "dias"
                            ? `Cada ${tiempoPersonalizado} dias`
                            : `Cada ${tiempoPersonalizado} semanas`;
                    setRepetirTexto(etiqueta);
                    setModalRepetir(false);
                  }}
                >
                  <Text className="text-white">
                    {unidadTiempo == "min"
                      ? `Cada ${tiempoPersonalizado} minutos`
                      : unidadTiempo == "horas"
                        ? `Cada ${tiempoPersonalizado} horas`
                        : unidadTiempo == "dias"
                          ? `Cada ${tiempoPersonalizado} dias`
                          : `Cada ${tiempoPersonalizado} semanas`}
                  </Text>
                </Pressable>
              ) : (
                <></>
              )}
              <Pressable
                className="flex items-center justify-center my-1 p-3 active:bg-[#454545] rounded"
                onPress={() => {
                  setModalRepetir(false);
                  setModalTiempo(true);
                }}
              >
                <Text className="text-gray-300">Personalizar</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
      <Modal
        visible={modalTiempo}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalTiempo(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <Pressable
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
            onPress={() => {
              Keyboard.dismiss();
              setModalTiempo(false);
            }}
          >
            <Pressable
              style={{ width: "100%", maxWidth: 320 }}
              className="bg-[#2d2d2d] rounded-xl p-4 border border-gray-700 shadow-2xl"
              onPress={(e) => e.stopPropagation()}
            >
              <Text className="text-white text-base font-semibold mb-3 text-center">
                Repetir cada
              </Text>
              <TextInput
                placeholder="Cantidad"
                placeholderTextColor="#888"
                className="bg-[#454545] rounded-md text-white px-3 py-2 text-center"
                value={String(tiempoPersonalizado)}
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
                autoFocus
                onChangeText={(texto) => {
                  const soloNumeros = texto.replace(/[^0-9]/g, "");
                  setTiempoPersonalizado(
                    soloNumeros === "" ? 0 : Number(soloNumeros),
                  );
                }}
              />
              <View className="flex flex-row flex-wrap items-center justify-center mt-4 gap-2">
                {[
                  { valor: "min", etiqueta: "Minutos" },
                  { valor: "horas", etiqueta: "Horas" },
                  { valor: "dias", etiqueta: "Dias" },
                  { valor: "semanas", etiqueta: "Semanas" },
                ].map((opcion) => (
                  <Pressable
                    key={opcion.valor}
                    className="px-3 py-2 rounded-md"
                    style={{
                      backgroundColor:
                        unidadTiempo === opcion.valor ? "#e17f29" : "#454545",
                    }}
                    onPress={() => setUnidadTiempo(opcion.valor)}
                  >
                    <Text className="text-white">{opcion.etiqueta}</Text>
                  </Pressable>
                ))}
              </View>
              <View className="flex flex-row justify-around mt-5">
                <Pressable
                  onPress={() => {
                    Keyboard.dismiss();
                    setModalTiempo(false);
                  }}
                  className="px-5 py-2 rounded-md bg-red-500"
                >
                  <Text className="text-white">Cancelar</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    Keyboard.dismiss();
                    setModalTiempo(false);
                    setHayPersonalizado(true);
                    calcularTiempoPersonalizado();
                    const etiqueta =
                      unidadTiempo == "min"
                        ? `Cada ${tiempoPersonalizado} minutos`
                        : unidadTiempo == "horas"
                          ? `Cada ${tiempoPersonalizado} horas`
                          : unidadTiempo == "dias"
                            ? `Cada ${tiempoPersonalizado} dias`
                            : `Cada ${tiempoPersonalizado} semanas`;
                    setRepetirTexto(etiqueta);
                  }}
                  className="px-5 py-2 rounded-md bg-green-500"
                >
                  <Text className="text-white">Confirmar</Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};
