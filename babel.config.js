module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        { jsxImportSource: "nativewind" }, // ¡Esta es la clave!
      ],
    ],
    plugins: ["react-native-reanimated/plugin"],
  };
};
