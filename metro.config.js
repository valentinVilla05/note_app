const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Aquí le indicamos a Metro que use NativeWind y dónde está tu archivo CSS
module.exports = withNativeWind(config, { input: "./global.css" });
