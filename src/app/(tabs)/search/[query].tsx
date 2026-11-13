import type { AutoSearchResponse } from "src/models";

import { useLocalSearchParams } from "expo-router";
import { ContentRails, LoadingView, MoreLink, TryAgain } from "src/ui";
import { apiFetcher } from "src/utils";
import useSWR from "swr";
import { Paragraph, ScrollView, YStack } from "tamagui";

export default function SearchPage() {
  const { query } = useLocalSearchParams();
  const { data, error, isLoading, mutate } = useSWR<AutoSearchResponse>(
    ["auto_search", { query }],
    apiFetcher,
  );

  if (isLoading) {
    return <LoadingView />;
  }

  if (error) {
    return <TryAgain refresh={mutate} />;
  }

  if (!data) {
    return (
      <YStack flex={1} items="center" justify="center" gap="3">
        <Paragraph fontSize={14} color="color-9">
          No results found for "{query}"
        </Paragraph>
      </YStack>
    );
  }

  const results = [
    {
      id: "top-results",
      heading: "Top results",
      items: data?.topquery?.data?.filter((item) => item.type !== "artist"),
    },
    {
      id: "songs",
      more: <MoreLink path={`/search/songs/${query}`} />,
      heading: "Songs",
      items: data?.songs?.data,
    },
    {
      id: "albums",
      more: <MoreLink path={`/search/albums/${query}`} />,
      heading: "Albums",
      items: data?.albums?.data,
    },
    {
      id: "playlists",
      more: <MoreLink path={`/search/playlists/${query}`} />,
      heading: "Playlists",
      items: data?.playlists?.data,
    },
  ];

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
      <ContentRails data={results} />
    </ScrollView>
  );
}
