import type { ArtistOverviewResponse } from "src/models";

import { Unmatched, useLocalSearchParams } from "expo-router";
import {
  ContentRails,
  HeroBanner,
  LoadingView,
  MediaCard,
  MediaListItem,
  MoreLink,
  TryAgain,
} from "src/ui";
import { apiFetcher, prettifyNumber, toCapitalize } from "src/utils";
import useSWR from "swr";
import { H3, ScrollView, Separator, SizableText, XStack, YStack } from "tamagui";

export default function ArtistOverviewPage() {
  const { token } = useLocalSearchParams();
  const { data, error, isLoading, mutate } = useSWR<ArtistOverviewResponse>(
    ["artist_overview", { token, p: 0, n_song: 10, n_album: 10 }],
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
      id: "just-artist",
      heading: `Just ${data.name.split(" ")[0]}`,
      items: data.dedicated_artist_playlist,
    },
    {
      id: "featured-in",
      heading: "Featured In",
      items: data.featured_artist_playlist,
    },
    {
      id: "top-singles",
      heading: "Top Singles",
      items: data.singles,
    },
    {
      id: "new-releases",
      heading: "New Releases",
      items: data.latest_release,
    },
    {
      id: "similar-artists",
      heading: "Similar Artists",
      items: data.similarArtists,
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
        id={data.artistId}
        title={data.name}
        subtitle={data.dominantType}
        type="artist"
        image={data.image}
        songs={data.topSongs}
        perma_url={data.urls.overview}
      >
        <XStack items="center" gap="1-5">
          <SizableText fontSize={13} color="color-9" fontWeight="500">
            {toCapitalize(data.dominantType)}
          </SizableText>
          <Separator vertical h={10} borderColor="border-color" />
          <SizableText fontSize={13} color="color-9" fontWeight="500">
            {prettifyNumber(Number(data.fan_count))} Listeners
          </SizableText>
        </XStack>
      </HeroBanner>
      <Separator my="3" borderColor="border-color" />

      <YStack>
        <XStack gap="2" justify="space-between" items="center" mb="1-5">
          <H3 fontSize={20} fontWeight="700" letterSpacing={-0.3}>
            Top Songs
          </H3>
          <MoreLink path={`/artist/${token}/songs`} />
        </XStack>
        <YStack>
          {data.topSongs.map((song, index) => (
            <MediaListItem key={song.id} {...song} trackNumber={index + 1} />
          ))}
        </YStack>
      </YStack>

      {data.topAlbums?.length > 0 && (
        <>
          <Separator my="3" borderColor="border-color" />
          <YStack>
            <XStack gap="2" justify="space-between" items="center" mb="1-5">
              <H3 fontSize={20} fontWeight="700" letterSpacing={-0.3}>
                Top Albums
              </H3>
              <MoreLink path={`/artist/${token}/albums`} />
            </XStack>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              mb="1-5"
              contentContainerStyle={{
                gap: 12,
                paddingRight: 16,
              }}
            >
              {data.topAlbums.map((album) => (
                <MediaCard
                  key={album.id}
                  title={album.title}
                  subtitle={album.subtitle}
                  image={album.image}
                  perma_url={album.perma_url}
                />
              ))}
            </ScrollView>
          </YStack>
        </>
      )}
      <Separator my="3" borderColor="border-color" />
      <ContentRails data={extras} />
    </ScrollView>
  );
}
