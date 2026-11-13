import type { PlaylistFeaturedResponse } from "src/models";

import { Unmatched } from "expo-router";
import { GridView, LoadingView, MediaCard, TryAgain } from "src/ui";
import { apiFetcher, getLanguagesParam } from "src/utils";
import useSWR from "swr";
import { YStack } from "tamagui";

export default function FeaturedPlaylistsPage() {
  const params = { languages: getLanguagesParam() };
  const { data, error, isLoading, mutate } = useSWR<PlaylistFeaturedResponse>(
    ["featured_playlists", params],
    apiFetcher,
  );

  if (isLoading) {
    return <LoadingView />;
  }

  if (error) {
    return <TryAgain refresh={mutate} />;
  }

  if (!data) {
    return <Unmatched />;
  }

  return (
    <YStack flex={1} bg="background" px="3" pt="2">
      <GridView>
        {data?.data.map((playlist) => (
          <MediaCard
            key={playlist.id}
            title={playlist.title}
            subtitle={playlist.subtitle}
            image={playlist.image}
            perma_url={playlist.perma_url}
          />
        ))}
      </GridView>
    </YStack>
  );
}
