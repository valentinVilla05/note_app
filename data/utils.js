import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import { expandirImagenesEnHTML } from "../data/images";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";

export const formatearFecha = (timestamp) => {
  if (!timestamp) return "";
  const fecha = new Date(timestamp);
  return fecha.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const quitarHTML = (html) => {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();
};

export const coloresFondo = {
  black: "#3F4754",
  green: "#A5C9A8",
  blue: "#A6BFD5",
  yellow: "#E8D5A0",
  red: "#DAA8A8",
  pink: "#DCB1C5",
  white: "#D6D8DC",
};
export const coloresToolBar = {
  black: "#2D3748",
  green: "#4A6E5A",
  blue: "#4A6585",
  yellow: "#806020",
  red: "#7A4848",
  pink: "#7A4862",
  white: "#5A6373",
};

export const compartirNota = async (id, title, content, colorTheme) => {
  const html = await expandirImagenesEnHTML(content);

  const file = await printToFileAsync({
    html: `
        <html>
        <head>
          <style>
          @page {
            margin: 40px 30px 80px 30px;  
            background-color: ${colorTheme}
          }
            h1 {
             page-break-after: avoid; 
            }
            img {
              max-width: 80%;
              margin-left: 50px;
              height: auto;
              page-break-inside: avoid;
            }
          </style>
        </head>
        <body> 
        <div style="display: flex; justify-content: center">
          <h1>${title}</h1>
        </div>
        <hr style="color: 'gray'; margin-bottom: 20px" width=80%>
        ${html}
        </body>
        </html>
      `,
    base64: false,
  });
  await shareAsync(file.uri);
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const MAX_NOTIFICACIONES = 50;

export function useNotificationSetup() {
  useEffect(() => {
    async function solicitarPermiso() {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          lockscreenVisibility: true,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
    }
    solicitarPermiso();

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response?.notification?.request?.content?.data;
        console.log("Notificación presionada con datos:", data);
      });

    return () => {
      responseListener.remove();
    };
  }, []);

  const programarNotificacion = async (
    mensaje,
    fechaTimeStamp,
    repetirSegundos,
    reminderId,
  ) => {
    if (!repetirSegundos || repetirSegundos <= 0) {
      return [
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Recordatorio:",
            body: mensaje,
            sound: true,
            vibrate: [0, 250, 250, 250],
            data: {
              reminderId,
              mensaje,
              repetirSegundos: repetirSegundos || 0,
            },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: new Date(fechaTimeStamp),
          },
        }),
      ];
    }
    const ids = [];
    for (let i = 0; i < MAX_NOTIFICACIONES; i++) {
      const fechaNotificacion = fechaTimeStamp + i * repetirSegundos * 1000;
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Recordatorio",
          body: mensaje,
          sound: true,
          vibrate: [0, 250, 250, 250],
          data: { reminderId, mensaje, repetirSegundos },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: new Date(fechaNotificacion),
        },
      });
      ids.push(id);
    }
    return ids;
  };

  const renovarNotificaciones = async (reminder) => {
    if (!reminder.repeat) return null;

    const programadas = await Notifications.getAllScheduledNotificationsAsync();
    const restantes = programadas.filter(
      (notis) => notis.content?.data?.reminderId === reminder.id,
    );

    if (restantes.length > 5) return null;

    if (reminder.notificationId) {
      try {
        const idsAntiguos = JSON.parse(reminder.notificationId);
        await cancelarNotificacion(idsAntiguos);
      } catch {}
    }

    const ahora = Date.now();
    let fechaAprox = reminder.date;
    if (ahora >= fechaAprox) {
      const ciclos =
        Math.floor((ahora - fechaAprox) / (reminder.repeat * 1000)) + 1;
      fechaAprox = reminder.date + ciclos * reminder.repeat * 1000;
    }

    const nuevosIds = await programarNotificacion(
      reminder.name,
      fechaAprox,
      reminder.repeat,
      reminder.id,
    );

    return { notificationId: nuevosIds, date: fechaAprox };
  };

  const cancelarNotificacion = async (notificationIdOrIds) => {
    const ids = Array.isArray(notificationIdOrIds)
      ? notificationIdOrIds
      : [notificationIdOrIds];
    for (const id of ids) {
      if (id) await Notifications.cancelScheduledNotificationAsync(id);
    }
  };

  const cancelarTodasLasNotificaciones = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };
  return {
    programarNotificacion,
    cancelarNotificacion,
    cancelarTodasLasNotificaciones,
    renovarNotificaciones,
  };
}
