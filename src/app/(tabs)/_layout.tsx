import { Tabs } from "expo-router";
import { BottomTabBar } from "expo-router/js-tabs";
import {
  Library as LibraryIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
} from "src/icons";
import { FloatingPlayer } from "src/ui";
import { type ColorTokens, useTheme, YStack } from "tamagui";

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      tabBar={(props) => (
        <YStack bg="background">
          <FloatingPlayer />
          <BottomTabBar {...props} />
        </YStack>
      )}
      screenOptions={{
        tabBarActiveTintColor: theme["accent-background"]?.val,
        tabBarInactiveTintColor: theme["color-10"]?.val,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarStyle: {
          backgroundColor: theme.background?.val,
          borderTopColor: theme["border-color"]?.val,
          borderTopWidth: 1,
          elevation: 4,
          height: 56,
          paddingBottom: 10,
          paddingTop: 6,
        },
        headerStyle: {
          backgroundColor: theme.background?.val,
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.color?.val,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color }) => <HomeIcon color={color as ColorTokens} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => <SearchIcon color={color as ColorTokens} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ color }) => <LibraryIcon color={color as ColorTokens} />,
        }}
      />
      <Tabs.Screen
        name="config"
        options={{
          title: "Config",
          tabBarIcon: ({ color }) => <SettingsIcon color={color as ColorTokens} />,
        }}
      />
    </Tabs>
  );
}
