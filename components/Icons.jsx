import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export const Cancelar = (props) => {
  return <Ionicons name="close" size={24} color={"white"} {...props} />;
};

export const Anadir = (props) => {
  return <Ionicons name="add" size={30} color={"#717171"} {...props} />;
};

export const Escribir = (props) => {
  return <Ionicons name="pencil" size={25} color={"white"} {...props} />;
};

export const Opciones = (props) => {
  return (
    <Ionicons name="ellipsis-vertical" size={20} color={"white"} {...props} />
  );
};

export const Menu = (props) => {
  return <Ionicons name="menu" size={30} color="#717171" {...props} />;
};

export const Atras = (props) => {
  return <Ionicons name="chevron-back" size={25} color={"white"} {...props} />;
};

export const Adjuntar = (props) => {
  return <Ionicons name="attach" size={25} color={"white"} {...props} />;
};

export const Texto = (props) => {
  return <Ionicons name="text" size={25} color={"white"} {...props} />;
};

export const Subrayado = (props) => {
  return <AntDesign name="font-colors" size={24} color="white" {...props} />;
};

export const Menos = (props) => {
  return <AntDesign name="minus" size={24} color="white" {...props} />;
};

export const PapeleraIcon = (props) => {
  return (
    <Ionicons name="trash-bin-outline" size={24} color="white" {...props} />
  );
};

export const FavoritoDesmarcado = (props) => {
  return (
    <Ionicons name="bookmark-outline" size={24} color="black" {...props} />
  );
};

export const FavoritoMarcado = (props) => {
  return <Ionicons name="bookmark" size={24} color="black" {...props} />;
};

export const Fijar = (props) => {
  return <AntDesign name="pushpin" size={24} color="black" {...props} />;
};

export const Circulo = (props) => {
  return <FontAwesome name="circle" size={22} color="black" {...props} />;
};

export const ColorFuente = (props) => {
  return (
    <MaterialIcons
      name="format-color-text"
      size={22}
      color="black"
      {...props}
    />
  );
};

export const Contrasena = (props) => {
  return <AntDesign name="lock" size={24} color="black" {...props} />;
};

export const Archivado = (props) => {
  return <Ionicons name="archive-outline" size={24} color="black" {...props} />;
};

export const Ajustes = (props) => {
  return (
    <Ionicons name="settings-outline" size={24} color="black" {...props} />
  );
};

export const Notas = (props) => {
  return (
    <FontAwesome name="sticky-note-o" size={24} color="black" {...props} />
  );
};

export const RestaurarIcon = (props) => {
  return <FontAwesome5 name="recycle" size={24} color="black" {...props} />;
};

export const Compartir = (props) => {
  return <FontAwesome name="share" size={24} color="black" {...props} />;
};

export const CompartirEditor = (props) => {
  return <AntDesign name="share-alt" size={24} color="black" {...props} />;
};

export const Encabezado1 = (props) => {
  return (
    <MaterialCommunityIcons
      name="format-header-1"
      size={24}
      color="black"
      {...props}
    />
  );
};

export const Encabezado2 = (props) => {
  return (
    <MaterialCommunityIcons
      name="format-header-2"
      size={24}
      color="black"
      {...props}
    />
  );
};
export const Encabezado3 = (props) => {
  return (
    <MaterialCommunityIcons
      name="format-header-3"
      size={24}
      color="black"
      {...props}
    />
  );
};

export const Deshacer = (props) => {
  return <MaterialIcons name="undo" size={24} color="black" {...props} />;
};

export const Rehacer = (props) => {
  return <MaterialIcons name="redo" size={24} color="black" {...props} />;
};

export const ZoomInIcon = (props) => {
  return <AntDesign name="zoom-in" size={24} color="black" {...props} />;
};

export const ZoomOutIcon = (props) => {
  return <AntDesign name="zoom-out" size={24} color="black" {...props} />;
};

export const Ocultar = (props) => {
  return <AntDesign name="eye-invisible" size={24} color="black" {...props} />;
};

export const Mostrar = (props) => {
  return <AntDesign name="eye" size={24} color="black" {...props} />;
};

export const AnadirCarpeta = (props) => {
  return <AntDesign name="folder-add" size={24} color="black" {...props} />;
};

export const Carpeta = (props) => {
  return <AntDesign name="folder" size={24} color="black" {...props} />;
};