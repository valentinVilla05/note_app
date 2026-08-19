import { File, Directory, Paths } from "expo-file-system";

const IMAGE_DIR_NAME = "images";

const getDirectorioImagenes = () => {
    const dir = new Directory(Paths.document, IMAGE_DIR_NAME);
    if(!dir.exists) {
        dir.create();
    }

    return dir;
}

const getExtension = (uri) => {
    const match = uri.match(/\.(\w+)(\?|#|$)/);
    return match ? match[1].toLowerCase() : "jpg";
}

export const guardarImagen = async (uri) => {
    const dir = getDirectorioImagenes();
    const extension = getExtension(uri);
    const nombre = `${Date.now()}-${Math.random().toString(36)}.${extension}`;
    const destino = new File(dir, nombre);

    const origen = new File(uri);
    await origen.copy(destino, {overwrite: true});

    return destino.uri;
}