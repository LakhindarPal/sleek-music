import type { TopSearchItem } from "src/models";

import { LoadingView, MediaCard, TryAgain } from "src/ui";
import { apiFetcher } from "src/utils";
import useSWR from "swr";
import { H3, ScrollView, XStack, YStack } from "tamagui";

export default function SearchPage() {
  const { data, error, isLoading, mutate } = useSWR<TopSearchItem[]>(["top_searches"], apiFetcher);

  if (isLoading) {
    return <LoadingView />;
  }

  if (error || !data) {
    return <TryAgain refresh={mutate} />;
  }

  return (
    <ScrollView
      px="3"
      bg="background"
      contentContainerStyle={{ paddingBottom: 120, paddingTop: 4 }}
      showsVerticalScrollIndicator={false}
    >
      {data.length > 0 && (
        <YStack py="2-5">
          <XStack items="center" justify="space-between" mb="2" pr="1">
            <H3 fontSize={20} fontWeight="700" letterSpacing={-0.3} color="color">
              Trending Searches
            </H3>
          </XStack>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 12,
              paddingRight: 16,
            }}
          >
            {data.map((item) => (
              <MediaCard
                key={item.id}
                title={item.title}
                subtitle={item.subtitle}
                image={item.image}
                perma_url={item.perma_url}
                circle={item.type === "artist"}
              />
            ))}
          </ScrollView>
        </YStack>
      )}
    </ScrollView>
  );
}
