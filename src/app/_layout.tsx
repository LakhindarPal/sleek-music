import "@tamagui/native/setup-gesture-handler";
import "@tamagui/native/setup-safe-area";
import "../../tamagui.generated.css";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router/react-navigation";
import { SQLiteProvider } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { DATABASE_NAME, migrateDbIfNeeded } from "src/db";
import { initPlayer } from "src/player";
import { usePreferenceStore } from "src/utils";
import { useTheme, TamaguiProvider, type TamaguiProviderProps, Toast } from "tamagui";

import { config } from "../../tamagui.config";

// Catch any errors thrown by the Layout component.
export { ErrorBoundary } from "expo-router";

///anchoring layout for deep-linking
export const unstable_settings = {
  anchor: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [interLoaded, interError] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  useEffect(() => {
    // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
    if (interLoaded || interError) {
      SplashScreen.hideAsync();
    }
    initPlayer();
  }, [interLoaded, interError]);

  if (!interLoaded && !interError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Providers>
          <RootLayoutNav />
        </Providers>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function resolveActiveTheme(
  themeSetting: string,
  colorScheme: "light" | "dark" | null | undefined,
): "light" | "dark" {
  if (themeSetting === "Auto") {
    return colorScheme === "dark" ? "dark" : "light";
  }
  return themeSetting.toLowerCase() === "light" ? "light" : "dark";
}

function Provider({ children, ...rest }: Omit<TamaguiProviderProps, "config" | "defaultTheme">) {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { theme: themeSetting } = usePreferenceStore();
  const activeTheme = resolveActiveTheme(themeSetting, colorScheme);

  return (
    <TamaguiProvider config={config} defaultTheme={activeTheme} insets={insets} {...rest}>
      <Toast position="top-center" closeButton>
        <Toast.Viewport>
          <Toast.List />
        </Toast.Viewport>
        {children}
      </Toast>
    </TamaguiProvider>
  );
}

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SQLiteProvider
      databaseName={DATABASE_NAME}
      onInit={migrateDbIfNeeded}
      options={{ enableChangeListener: true }}
    >
      <Provider>{children}</Provider>
    </SQLiteProvider>
  );
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { theme: themeSetting } = usePreferenceStore();
  const activeTheme = resolveActiveTheme(themeSetting, colorScheme);
  const theme = useTheme();

  return (
    <ThemeProvider value={activeTheme === "dark" ? DarkTheme : DefaultTheme}>
      <StatusBar style={activeTheme === "dark" ? "light" : "dark"} />
      <Stack
        screenOptions={{
          presentation: "card",
          headerStyle: {
            backgroundColor: theme.background?.val,
          },
          headerTintColor: theme.color?.val,
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: theme.background?.val,
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            presentation: "card",
          }}
        />

        <Stack.Screen
          name="player"
          options={{
            headerShown: false,
            presentation: "fullScreenModal",
            animation: "slide_from_bottom",
            gestureEnabled: true,
            gestureDirection: "vertical",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
