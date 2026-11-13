import type { SearchPlaylistResponse } from "src/models";

import { useLocalSearchParams } from "expo-router";
import { FlatList } from "react-native";
import { LoadingView, MediaCard, TryAgain } from "src/ui";
import { apiFetcher } from "src/utils";
import useSWRInfinite from "swr/infinite";
import { Paragraph, Spinner, YStack } from "tamagui";

export default function PlaylistSearchPage() {
  const { query } = useLocalSearchParams();

  const getKey = (page: number, prevPageData: SearchPlaylistResponse | null) => {
    if (prevPageData && prevPageData.results?.length === 0) {
      return null;
    }
    return ["playlist_search", { q: query, p: page + 1 }];
  };

  const { data, error, isLoading, isValidating, size, setSize, mutate } =
    useSWRInfinite<SearchPlaylistResponse>(getKey, apiFetcher);

  const results = data?.flatMap((page) => page?.results ?? []) ?? [];

  const renderItem = ({ item: playlist }: { item: SearchPlaylistResponse["results"][number] }) => (
    <MediaCard
      title={playlist.title}
      subtitle={playlist.subtitle}
      image={playlist.image}
      perma_url={playlist.perma_url}
    />
  );

  if (isLoading) {
    return <LoadingView />;
  }

  if (error) {
    return <TryAgain refresh={mutate} />;
  }

  if (results.length === 0) {
    return (
      <YStack flex={1} items="center" justify="center" gap="3">
        <Paragraph fontSize={14} color="color-9">
          No playlists found for "{query}"
        </Paragraph>
      </YStack>
    );
  }

  return (
    <FlatList
      data={results}
      keyExtractor={(item, index) => `${item.id}_${index}`}
      numColumns={2}
      columnWrapperStyle={{
        justifyContent: "space-around",
        gap: 12,
      }}
      contentContainerStyle={{ paddingBottom: 100 }}
      renderItem={renderItem}
      onEndReached={() => setSize(size + 1)}
      onEndReachedThreshold={0.5}
      initialNumToRender={8}
      maxToRenderPerBatch={8}
      windowSize={7}
      removeClippedSubviews
      ListFooterComponent={
        isValidating && results.length > 0 ? (
          <YStack items="center" py="3">
            <Spinner size="large" color="accent-background" />
          </YStack>
        ) : undefined
      }
    />
  );
}
