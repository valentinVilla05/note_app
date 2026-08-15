import { StyleSheet } from "react-native";
import { View, Text, TextInput } from "react-native";

import archivo from "../assets/archivo.svg";

export function NuevaNota() {

    return (
        <View style={styles.barraHerramientas}>
            <Image source={archivo}/>
            
        </View>
    );
}

const  styles = StyleSheet.create({
    barraHerramientas: {

    }
})