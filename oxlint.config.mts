import { defineConfig } from "oxlint";
import native from "oxlint-config-universe/native";

export default defineConfig({
  extends: [native],
  plugins: ["import", "react", "react-perf"],
  ignorePatterns: [
    ".github/**",
    ".expo/**",
    ".tamagui",
    "android",
    "ios",
    "dist",
    "tamagui.generated.css",
  ],
});
