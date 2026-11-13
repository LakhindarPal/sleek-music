import type { SearchSongResponse } from "src/models";

import { useLocalSearchParams } from "expo-router";
import { FlatList } from "react-native";
import { LoadingView, MediaListItem, TryAgain } from "src/ui";
import { apiFetcher } from "src/utils";
import useSWRInfinite from "swr/infinite";
import { Paragraph, Spinner, YStack } from "tamagui";

export default function SongSearchPage() {
  const { query } = useLocalSearchParams();

  const getKey = (page: number, prevPageData: SearchSongResponse | null) => {
    if (prevPageData && prevPageData.results?.length === 0) {
      return null;
    }
    return ["song_search", { q: query, p: page + 1 }];
  };

  const { data, error, isLoading, isValidating, size, setSize, mutate } =
    useSWRInfinite<SearchSongResponse>(getKey, apiFetcher);

  const results = data?.flatMap((page) => page?.results ?? []) ?? [];

  const renderItem = ({ item }: { item: SearchSongResponse["results"][number] }) => (
    <MediaListItem {...item} />
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
          No songs found for "{query}"
        </Paragraph>
      </YStack>
    );
  }

  return (
    <FlatList
      data={results}
      keyExtractor={(item, index) => `${item.id}_${index}`}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 100 }}
      onEndReached={() => setSize(size + 1)}
      onEndReachedThreshold={0.5}
      initialNumToRender={12}
      maxToRenderPerBatch={10}
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
