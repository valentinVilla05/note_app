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
