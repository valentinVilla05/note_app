import { useLocalSearchParams } from "expo-router";
import { ContenidoCarpeta } from "../components/ContenidoCarpeta";

export default function Carpeta() {
    const params = useLocalSearchParams()
    const id = params.id;
    const name = params.name;
    const colorCarpeta = params.color;

    return (
        <ContenidoCarpeta id={id} name={name} color={colorCarpeta}/>
    )
}