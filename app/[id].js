import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function NotaAmpliada() {
    return (
        <View className="flex-1 justify-center items-center">
            <Link href="/">
                <Text>Volver atras</Text>
            </Link>
            <Text className="text-white font-bold">
                Texto de la nota
            </Text>
        </View>
    );
}