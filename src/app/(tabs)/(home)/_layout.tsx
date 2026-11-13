import { Stack } from "expo-router";
import { useTheme } from "tamagui";

export default function HomeStackLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
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
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Stack.Screen
        name="song/[token]"
        options={{
          title: "Song",
        }}
      />
      <Stack.Screen
        name="album/[token]"
        options={{
          title: "Album",
        }}
      />
      <Stack.Screen
        name="playlist/[token]"
        options={{
          title: "Playlist",
        }}
      />
      <Stack.Screen
        name="mix/[token]"
        options={{
          title: "Mix",
        }}
      />
      <Stack.Screen
        name="artist/[token]/index"
        options={{
          title: "Artist",
        }}
      />
      <Stack.Screen
        name="artist/[token]/songs"
        options={{
          title: "Artist Songs",
        }}
      />
      <Stack.Screen
        name="artist/[token]/albums"
        options={{
          title: "Artist Albums",
        }}
      />
      <Stack.Screen
        name="trending"
        options={{
          title: "Trending",
        }}
      />
      <Stack.Screen
        name="featured"
        options={{
          title: "Featured",
        }}
      />
      <Stack.Screen
        name="latest"
        options={{
          title: "Latest",
        }}
      />
    </Stack>
  );
}
