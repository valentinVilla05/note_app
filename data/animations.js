import { Animated } from "react-native";

export const secuenciaTrasladoY = (animValue, coords, callback) => {
  Animated.sequence(
    coords.map(([toValue, duration]) =>
      Animated.timing(animValue, {
        toValue,
        duration,
        useNativeDriver: true,
      }),
    ),
  ).start(() => callback?.());
};
