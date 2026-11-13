import type { PlaylistBase, PlaylistDetailResponse } from "src/models";

import { Unmatched, useLocalSearchParams } from "expo-router";
import { ContentRails, HeroBanner, LoadingView, MediaListItem, TryAgain } from "src/ui";
import { apiFetcher, dedupArtists, durationOfList } from "src/utils";
import useSWR from "swr";
import { ScrollView, Separator, SizableText, XStack, YStack } from "tamagui";

export default function PlaylistPage() {
  const { token } = useLocalSearchParams();
  const { data, error, isLoading, mutate } = useSWR<PlaylistDetailResponse>(
    ["playlist_detail", { token }],
    apiFetcher,
  );
  const { data: recommended } = useSWR<PlaylistBase[]>(
    data?.modules?.relatedPlaylist?.source_params
      ? ["playlist_reco", data.modules.relatedPlaylist.source_params]
      : null,
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

  const extras = [
    {
      id: "you-might-like",
      heading: "You might like",
      items: recommended,
    },
    {
      id: "all-artists",
      heading: "All Artists",
      items: dedupArtists(data.more_info.artists || []),
    },
  ];

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
        <XStack items="center" gap="1-5">
          <SizableText fontSize={13} color="color-9" fontWeight="500">
            {data.subtitle}
          </SizableText>
          <Separator vertical h={10} borderColor="border-color" />
          <SizableText fontSize={13} color="color-9" fontWeight="500">
            {data.list_count} Songs
          </SizableText>
          <Separator vertical h={10} borderColor="border-color" />
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
      <Separator my="3" borderColor="border-color" />
      <ContentRails data={extras} />
    </ScrollView>
  );
}
