import { View, Text } from "react-native"
import { useNotesFromFolder } from "../hooks/useNotes";

export const ContenidoCarpeta = (props) => {
    const idCarpeta = props.id;
    const nameCarpeta = props.name;
    const colorCarpeta = props.color;

    const notasCarpeta = useNotesFromFolder(idCarpeta);

    return (
        <View>
            <Text>Contenido Carpeta</Text>
        </View>
    )
}