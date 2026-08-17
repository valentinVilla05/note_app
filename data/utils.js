export const formatearFecha = (timestamp) => {
  if (!timestamp) return "";
  const fecha = new Date(timestamp);
  return fecha.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long", 
    year: "numeric",
  });
};
