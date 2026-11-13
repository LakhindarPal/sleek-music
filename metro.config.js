// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { withTamagui } = require("@tamagui/metro-plugin");

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push("wasm");

module.exports = withTamagui(config);
