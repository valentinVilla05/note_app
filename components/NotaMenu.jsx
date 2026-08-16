import { View, Text, Pressable } from "react-native";
import { Link } from "expo-router";
import { Opciones } from "./Icons";

export const Nota = (props) => {
  return (
    <Link href={`/${String(props.id)}`} asChild>
      <Pressable className="w-[47%] self-start bg-[#4a4a4a] m-[7px] rounded-[10px] min-w-[150px]">
        <View>
          <View className="flex-row items-center justify-between bg-[#373737] rounded-t-[10px] p-[5px]">
            <Text className="text-left text-xl italic text-white flex-1">
              {props.title}
            </Text>

            <Pressable
              onPress={(event) => {
                event.stopPropagation()
                alert("Opciones");
              }}
            >
              <Opciones />
            </Pressable>
          </View>

          <View>
            <Text className="text-white p-[5px] font-light text-sm">
              {props.text}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
};
