import { View } from "react-native";

export function Screen({children}) {
    return (
      <View className="flex-1 " style={{ backgroundColor: "#181818" }}>
        {children}
      </View>
    );
}