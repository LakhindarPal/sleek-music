import {
  createThemes,
  fromShades,
  levels,
  ramp,
  raise,
  shadows,
  type GetThemeContext,
  type ThemeDefinitionContext,
  colorTokens,
} from "@tamagui/themes/builder";

export const tokens: { color: Record<string, string> } = {
  color: {
    ...colorTokens,
    "base-light-50": "hsla(220, 14%, 99%, 1)",
    "base-light-100": "hsla(220, 14%, 93%, 1)",
    "base-light-200": "hsla(220, 14%, 87%, 1)",
    "base-light-300": "hsla(220, 14%, 81%, 1)",
    "base-light-400": "hsla(220, 14%, 75%, 1)",
    "base-light-500": "hsla(220, 14%, 68%, 1)",
    "base-light-600": "hsla(220, 14%, 62%, 1)",
    "base-light-700": "hsla(220, 14%, 56%, 1)",
    "base-light-800": "hsla(220, 10%, 54%, 1)",
    "base-light-900": "hsla(220, 10%, 42%, 1)",
    "base-light-950": "hsla(220, 14%, 1%, 1)",
    "base-dark-50": "hsla(220, 14%, 99%, 1)",
    "base-dark-100": "hsla(220, 10%, 64%, 1)",
    "base-dark-200": "hsla(220, 10%, 48%, 1)",
    "base-dark-300": "hsla(220, 14%, 44%, 1)",
    "base-dark-400": "hsla(220, 14%, 38%, 1)",
    "base-dark-500": "hsla(220, 14%, 32%, 1)",
    "base-dark-600": "hsla(220, 14%, 26%, 1)",
    "base-dark-700": "hsla(220, 14%, 20%, 1)",
    "base-dark-800": "hsla(220, 14%, 14%, 1)",
    "base-dark-900": "hsla(220, 14%, 8%, 1)",
    "base-dark-950": "hsla(220, 14%, 2%, 1)",
    "accent-light-50": "hsla(212, 92%, 40%, 1)",
    "accent-light-100": "hsla(212, 92%, 43%, 1)",
    "accent-light-200": "hsla(212, 92%, 46%, 1)",
    "accent-light-300": "hsla(212, 92%, 49%, 1)",
    "accent-light-400": "hsla(212, 92%, 53%, 1)",
    "accent-light-500": "hsla(212, 92%, 56%, 1)",
    "accent-light-600": "hsla(212, 92%, 59%, 1)",
    "accent-light-700": "hsla(212, 92%, 62%, 1)",
    "accent-light-800": "hsla(212, 92%, 65%, 1)",
    "accent-light-900": "hsla(212, 92%, 95%, 1)",
    "accent-light-950": "hsla(212, 92%, 95%, 1)",
    "accent-dark-50": "hsla(212, 92%, 95%, 1)",
    "accent-dark-100": "hsla(212, 92%, 90%, 1)",
    "accent-dark-200": "hsla(212, 92%, 60%, 1)",
    "accent-dark-300": "hsla(212, 92%, 57%, 1)",
    "accent-dark-400": "hsla(212, 92%, 54%, 1)",
    "accent-dark-500": "hsla(212, 92%, 51%, 1)",
    "accent-dark-600": "hsla(212, 92%, 48%, 1)",
    "accent-dark-700": "hsla(212, 92%, 44%, 1)",
    "accent-dark-800": "hsla(212, 92%, 41%, 1)",
    "accent-dark-900": "hsla(212, 92%, 38%, 1)",
    "accent-dark-950": "hsla(212, 92%, 35%, 1)",
  },
};

const light = {
  background: 50,
  "background-hover": 100,
  "background-press": 50,
  "background-focus": 100,
  "background-active": "white",
  "border-color": 200,
  "border-color-hover": 300,
  "border-color-press": 200,
  "border-color-focus": 300,
  color: 950,
  "color-hover": 950,
  "color-press": 950,
  "color-focus": 950,
  "placeholder-color": 500,
  "outline-color": 400,
  "shadow-color": "shadow-4",
  "accent-background": "accent-light-600",
  "accent-color": "accent-light-50",
} as const;
const dark = {
  background: 950,
  "background-hover": 900,
  "background-press": 950,
  "background-focus": 900,
  "background-active": 900,
  "border-color": 800,
  "border-color-hover": 700,
  "border-color-press": 800,
  "border-color-focus": 700,
  color: 50,
  "color-hover": 50,
  "color-press": 50,
  "color-focus": 50,
  "placeholder-color": 500,
  "outline-color": 400,
  "shadow-color": "shadow-4",
  "accent-background": "accent-dark-500",
  "accent-color": "accent-dark-100",
} as const;

export const scales = {
  light: {
    1: light,
    2: raise(light, 1),
    3: raise(light, 2),
    4: raise(light, 3),
  },
  dark: {
    1: dark,
    2: raise(dark, -1),
    3: raise(dark, -2),
    4: raise(dark, -3),
  },
} as const;

type Recipe = {
  scheme: "light" | "dark";
  palette: "base-light" | "base-dark" | "accent-light" | "accent-dark";
  level?: 1 | 2 | 3 | 4;
};

export const tree = {
  light: { scheme: "light", palette: "base-light" },
  dark: { scheme: "dark", palette: "base-dark" },
  children: {
    ...levels(),
    accent: ({ parent }: ThemeDefinitionContext) => ({
      palette: parent.scheme === "dark" ? "accent-dark" : "accent-light",
      level: 1,
      children: levels(),
    }),
    inverse: ({ parent }: ThemeDefinitionContext) => {
      const scheme = parent.scheme === "light" ? "dark" : "light";
      return {
        scheme,
        palette: scheme === "dark" ? "base-dark" : "base-light",
        level: 1,
        children: levels(),
      };
    },
  },
} as const;

export function getTheme({ recipe }: GetThemeContext<typeof tokens, Recipe>) {
  const scale = scales[recipe.scheme][recipe.level ?? 1];
  const schemeShadows = shadows[recipe.scheme];
  return {
    ...ramp(recipe.palette, recipe.scheme, scale),
    ...fromShades(recipe.palette, scale),
    ...schemeShadows,
    "shadow-color": schemeShadows[scale["shadow-color"]],
  };
}

export const themes = createThemes(tokens, tree, { getTheme });
export type Themes = typeof themes;
