import type { MixDetailResponse } from "src/models";

import { Unmatched, useLocalSearchParams } from "expo-router";
import { HeroBanner, LoadingView, MediaListItem, TryAgain } from "src/ui";
import { apiFetcher, durationOfList } from "src/utils";
import useSWR from "swr";
import { ScrollView, Separator, SizableText, XStack, YStack } from "tamagui";

export default function MixPage() {
  const { token } = useLocalSearchParams();
  const { data, error, isLoading, mutate } = useSWR<MixDetailResponse>(
    ["mix_detail", { token }],
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
    <ScrollView
      px="3"
      bg="background"
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <HeroBanner
        id={data.id}
        title={data.title}
        subtitle={data.header_desc}
        type="playlist"
        image={data.image}
        perma_url={data.perma_url}
        songs={data.list}
      >
        <XStack items="center" gap="1">
          <SizableText fontSize={13} color="color-9" fontWeight="500">
            {durationOfList(data.list)}
          </SizableText>
        </XStack>
      </HeroBanner>
      <Separator my="3" borderColor="border-color" />
      <YStack>
        {data.list.map((song, index) => (
          <MediaListItem key={song.id} {...song} trackNumber={index + 1} />
        ))}
      </YStack>
    </ScrollView>
  );
}
