import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";

export const Cancelar = (props) => {
  return <Ionicons name="close" size={24} color={"white"} {...props} />;
};

export const Anadir = (props) => {
  return <Ionicons name="add" size={30} color="#717171" {...props} />;
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
    return <Ionicons name="chevron-back" size={25} color={"white"} {...props} />
}