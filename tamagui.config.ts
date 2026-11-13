import { animationPresets } from "@tamagui/animation-helpers";
import { createAnimations } from "@tamagui/animations-reanimated";
import { createV6Config } from "@tamagui/config/v6";
import { createTamagui } from "tamagui";

import { themes, tokens } from "./tamagui.theme";

export const config = createTamagui({
  ...createV6Config({ themes, colorTokens: tokens.color }),
  animations: createAnimations(animationPresets),
});

// Suppress build-time false-positive duplicate instance warning during Metro static evaluation
if (typeof globalThis !== "undefined") {
  globalThis.__tamaguiEvaluationConfig = config;
}

export default config;

export type Conf = typeof config;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}
