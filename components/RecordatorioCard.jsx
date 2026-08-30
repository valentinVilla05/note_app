import { Pressable, View, Text } from "react-native";
import { PapeleraIcon } from "./Icons";

export const RecordatorioCard = (props) => {
  const {
    id,
    name,
    date,
    repeat,
    completed,
    created_at,
    notification_id,
    onDeleteReminder,
  } = props;

  const obtenerTextoRepetir = (segundos) => {
    if (!segundos || segundos === 0) return "No repetir";
    if (segundos === 3600) return "cada hora";
    if (segundos === 28800) return "cada 8 horas";
    if (segundos === 43200) return "cada 12 horas";
    if (segundos === 86400) return "una vez al día";
    if (segundos === 604800) return "una vez a la semana";

    if (segundos % 604800 === 0) {
      const semanas = segundos / 604800;
      return `cada ${semanas} semana${semanas === 1 ? "" : "s"}`;
    }
    if (segundos % 86400 === 0) {
      const dias = segundos / 86400;
      return `cada ${dias} día${dias === 1 ? "" : "s"}`;
    }
    if (segundos % 3600 === 0) {
      const horas = segundos / 3600;
      return `cada ${horas} hora${horas === 1 ? "" : "s"}`;
    }
    if (segundos % 60 === 0) {
      const minutos = segundos / 60;
      return `cada ${minutos} minuto${minutos === 1 ? "" : "s"}`;
    }
    return `cada ${segundos} segundos`;
  };

  const obtenerProximaFechaHora = (fechaMs, repetirSegundos) => {
    const ahora = Date.now();
    let proxima = fechaMs;

    // Si la fecha inicial ya pasó y el recordatorio tiene repetición, calculamos la siguiente iteración
    if (ahora >= fechaMs && repetirSegundos > 0) {
      const intervaloMs = repetirSegundos * 1000;
      const ciclos = Math.floor((ahora - fechaMs) / intervaloMs) + 1;
      proxima = fechaMs + ciclos * intervaloMs;
    }

    const fechaObj = new Date(proxima);
    return fechaObj.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <Pressable className="flex flex-col bg-[#353535] m-3 rounded-md">
      <View className="p-2 flex flex-row justify-between items-center bg-[#505050] rounded-md">
        <Text className="text-white text-2xl">{name}</Text>
        <Pressable className="m-3" onPress={() => props.onDeleteReminder()}>
          <PapeleraIcon color={"red"} size={24} />
        </Pressable>
      </View>
      <View className="m-2 flex-row justify-between items-center">
        <Text className="text-white">
          Sonará: {obtenerProximaFechaHora(date, repeat)}
        </Text>
        <Text className="text-white">
          Repitiendo {obtenerTextoRepetir(repeat)}
        </Text>
      </View>
    </Pressable>
  );
};
