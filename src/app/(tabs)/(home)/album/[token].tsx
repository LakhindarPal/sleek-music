import type { AlbumBase, AlbumDetailResponse } from "src/models";

import { Unmatched, useLocalSearchParams } from "expo-router";
import { ContentRails, HeroBanner, LoadingView, MediaListItem, TryAgain } from "src/ui";
import { apiFetcher, dedupArtists, durationOfList, toCapitalize } from "src/utils";
import useSWRImmutable from "swr/immutable";
import { ScrollView, Separator, SizableText, XStack, YStack } from "tamagui";

export default function AlbumPage() {
  const { token } = useLocalSearchParams();
  const { data, error, isLoading, mutate } = useSWRImmutable<AlbumDetailResponse>(
    ["album_detail", { token }],
    apiFetcher,
  );

  const { data: recommended } = useSWRImmutable<AlbumBase[]>(
    data?.modules?.reco?.source_params ? ["album_reco", data.modules.reco.source_params] : null,
    apiFetcher,
  );

  const { data: yearAlbums } = useSWRImmutable<AlbumBase[]>(
    data?.modules?.topAlbumsFromSameYear?.source_params
      ? ["year_albums", data.modules.topAlbumsFromSameYear.source_params]
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
      id: "from-same-year",
      heading: "From same year",
      items: yearAlbums,
    },
    {
      id: "all-artists",
      heading: "All Artists",
      items: dedupArtists(data.more_info.artistMap.artists || []),
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
        subtitle={data.subtitle}
        type="album"
        image={data.image}
        perma_url={data.perma_url}
        songs={data.list}
      >
        <XStack items="center" gap="1-5">
          <SizableText fontSize={13} color="color-9" fontWeight="500">
            {data.year}
          </SizableText>
          <Separator vertical h={10} borderColor="border-color" />
          <SizableText fontSize={13} color="color-9" fontWeight="500">
            {toCapitalize(data.language)} Album
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
