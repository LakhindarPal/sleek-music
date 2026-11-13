import type { SearchArtistResponse } from "src/models";

import { useLocalSearchParams } from "expo-router";
import { FlatList } from "react-native";
import { LoadingView, MediaCard, TryAgain } from "src/ui";
import { apiFetcher, toCapitalize } from "src/utils";
import useSWRInfinite from "swr/infinite";
import { Paragraph, Spinner, YStack } from "tamagui";

export default function ArtistSearchPage() {
  const { query } = useLocalSearchParams();

  const getKey = (page: number, prevPageData: SearchArtistResponse | null) => {
    if (prevPageData && prevPageData.results?.length === 0) {
      return null;
    }
    return ["artist_search", { q: query, p: page + 1 }];
  };

  const { data, error, isLoading, isValidating, size, setSize, mutate } =
    useSWRInfinite<SearchArtistResponse>(getKey, apiFetcher);

  const results = data?.flatMap((page) => page?.results ?? []) ?? [];

  const renderItem = ({ item: artist }: { item: SearchArtistResponse["results"][number] }) => (
    <MediaCard
      title={artist.name}
      subtitle={toCapitalize(artist.role)}
      image={artist.image}
      perma_url={artist.perma_url}
      circle
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
          No artists found for "{query}"
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
