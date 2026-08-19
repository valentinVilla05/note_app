import { File, Directory, Paths } from "expo-file-system";

const IMAGE_DIR_NAME = "images";

const getDirectorioImagenes = () => {
  const dir = new Directory(Paths.document, IMAGE_DIR_NAME);
  if (!dir.exists) {
    dir.create();
  }

  return dir;
};

const getExtension = (uri) => {
  const match = uri.match(/\.(\w+)(\?|#|$)/);
  return match ? match[1].toLowerCase() : "jpg";
};

export const guardarImagen = async (uri) => {
  const dir = getDirectorioImagenes();
  const extension = getExtension(uri);
  const nombre = `${Date.now()}-${Math.random().toString(36)}.${extension}`;
  const destino = new File(dir, nombre);

  const origen = new File(uri);
  await origen.copy(destino, { overwrite: true });

  return destino.uri;
};

const MIME_POR_EXTENSION = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
};

export const transformarBase64 = async (uri) => {
  try {
    const uriArchivo = new File(uri);
    const base64 = await uriArchivo.base64();
    const extension = getExtension(uri);
    const mime = MIME_POR_EXTENSION[extension] ?? "image/jpeg";
    return "data:" + mime + ";base64," + base64;
  } catch {
    return null;
  }
};

export const expandirImagenesEnHTML = async (html) => {
  const regex = /<img\b[^>]*?\bsrc=["']?(file:\/\/[^"'>\s]+)["']?[^>]*>/gi;
  const matches = [...html.matchAll(regex)];

  if (matches.length === 0) return html;

  const partes = [];
  let ultimoIndice = 0;

  for (const match of matches) {
    const uri = match[1];
    const dataUri = await transformarBase64(uri);

    partes.push(html.slice(ultimoIndice, match.index));

    if (dataUri === null) {
      partes.push(match[0]);
    } else {
      partes.push(match[0].replace(uri, dataUri));
    }

    ultimoIndice = match.index + match[0].length;
  }

  partes.push(html.slice(ultimoIndice));

  return partes.join("");
};