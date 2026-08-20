import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import { expandirImagenesEnHTML } from "../data/images";
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

export const compartirNota = async (id, title, content) => {
  const html = await expandirImagenesEnHTML(content);

  const file = await printToFileAsync({
    html: `
        <html>
        <head>
          <style>
            h1 {
             font-size: 20px; page-break-after: avoid; 
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
        <h1>${title}</h1>
        ${html}
        </body>
        </html>
      `,
    base64: false,
  });
  await shareAsync(file.uri);
};
