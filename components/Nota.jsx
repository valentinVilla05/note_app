import { View, Text } from "react-native";

export const Nota = props => {
  return (
    <View>
      <Text style={{textAlign:'left', fontSize:35, fontStyle:'italic', color:'white'}}>{props.title}</Text>
      <View>
        <Text style={{color:'white'}}>
            {props.text}
        </Text>
      </View>
    </View>
  );
};
