export const formatearFecha = (timestamp) => {
  if (!timestamp) return "";
  const fecha = new Date(timestamp);
  return fecha.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

  export const coloresFondo = {
    black: "#181818",
    green: "#7DCEA0",
    blue: "#85C1E9",
    yellow: "#F9E79F",
    red: "#FFA2A2",
    pink: "#FCCEE8",
    white: "#f0f0f0",
  };
  export const coloresToolBar = {
    black: "#101010",
    green: "#145A32",
    blue: "#1B4F72",
    yellow: "#9A7D0A",
    red: "#FF6467",
    pink: "#F6339A",
    white: "#E2E8F0",
  };