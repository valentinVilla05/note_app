import { View, Text, Pressable } from "react-native";

export const Nota = (props) => {
  return (
    <Pressable
      onPress={() => alert("Soy una nota")}
      className="w-[48%] self-start bg-[#4a4a4a] m-[7px] rounded-[10px] min-w-[150px]"
    >
      <View>
        <Text className="text-left text-xl italic text-white bg-[#373737] rounded-t-[10px] p-[5px]">
          {props.title}
        </Text>
        <View>
          <Text className="text-white p-[5px] font-light text-sm">
            {props.text}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
