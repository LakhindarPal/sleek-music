import type { AlbumDetailResponse, Song, SongDetailResponse } from "src/models";

import TrackPlayer from "@rntp/player";
import { Unmatched, useLocalSearchParams } from "expo-router";
import { ListPlus as ListPlusIcon } from "src/icons";
import { ContentRails, HeroBanner, LoadingView, MediaListItem, TryAgain } from "src/ui";
import { apiFetcher, createTrack, dedupArtists, formatDuration, prettifyNumber } from "src/utils";
import useSWRImmutable from "swr/immutable";
import { Button, H3, ScrollView, Separator, SizableText, toast, XStack, YStack } from "tamagui";

export default function SongPage() {
  const { token } = useLocalSearchParams();
  const { data, error, isLoading, mutate } = useSWRImmutable<SongDetailResponse>(
    ["song_detail", { token }],
    apiFetcher,
  );
  const song = data?.songs[0];

  const albumToken = song?.more_info?.album_url
    ? song.more_info.album_url.split("/").filter(Boolean).pop()
    : undefined;

  const { data: album } = useSWRImmutable<AlbumDetailResponse>(
    albumToken ? ["album_detail", { token: albumToken }] : null,
    apiFetcher,
  );

  const albumSongs = album?.list.filter((albumSong) => albumSong.id !== song?.id);

  const { data: recommended } = useSWRImmutable<Song[]>(
    data?.modules?.reco?.source_params ? ["song_reco", data.modules.reco.source_params] : null,
    apiFetcher,
  );

  const { data: actorSongs } = useSWRImmutable<Song[]>(
    data?.modules?.songsBysameActors?.source_params
      ? ["actor_songs", data.modules.songsBysameActors.source_params]
      : null,
    apiFetcher,
  );

  const { data: artistSongs } = useSWRImmutable<Song[]>(
    data?.modules?.songsBysameArtists?.source_params
      ? ["artist_songs", data.modules.songsBysameArtists.source_params]
      : null,
    apiFetcher,
  );

  if (isLoading) {
    return <LoadingView />;
  }

  if (error) {
    return <TryAgain refresh={mutate} />;
  }

  if (!song) {
    return <Unmatched />;
  }

  const extras = [
    {
      id: "you-might-like",
      heading: "You might like",
      items: recommended,
      more: <AddAllButton songs={recommended} />,
    },
    {
      id: "from-same-artists",
      heading: "From same artists",
      items: artistSongs,
      more: <AddAllButton songs={artistSongs} />,
    },
    {
      id: "from-same-actors",
      heading: "From same actors",
      items: actorSongs,
      more: <AddAllButton songs={actorSongs} />,
    },
    {
      id: "artists-and-actors",
      heading: "Artists & Actors",
      items: dedupArtists(song.more_info.artistMap.artists || []),
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
        id={song.id}
        title={song.title}
        subtitle={song.subtitle}
        type="song"
        image={song.image}
        songs={data.songs}
        perma_url={song.perma_url}
      >
        <XStack items="center" gap="1-5">
          <SizableText fontSize={13} color="color-9" fontWeight="500">
            {song.year}
          </SizableText>
          <Separator vertical h={10} borderColor="border-color" />
          <SizableText fontSize={13} color="color-9" fontWeight="500">
            {prettifyNumber(Number(song.play_count))} plays
          </SizableText>
          <Separator vertical h={10} borderColor="border-color" />
          <SizableText fontSize={13} color="color-9" fontWeight="500">
            {formatDuration(Number(song.more_info.duration), "pretty")}
          </SizableText>
        </XStack>
      </HeroBanner>
      {!!albumSongs?.length && (
        <>
          <Separator my="3" borderColor="border-color" />
          <YStack>
            <XStack items="center" justify="space-between" mb="1-5">
              <H3 fontSize={20} fontWeight="700" letterSpacing={-0.3}>
                From same album
              </H3>
              <AddAllButton songs={albumSongs} />
            </XStack>
            <YStack>
              {albumSongs.map((albumSong, index) => (
                <MediaListItem key={albumSong.id} {...albumSong} trackNumber={index + 1} />
              ))}
            </YStack>
          </YStack>
        </>
      )}
      <Separator my="3" borderColor="border-color" />
      <ContentRails data={extras} />
    </ScrollView>
  );
}

function AddAllButton({ songs }: { songs: Song[] | undefined }) {
  if (!songs?.length) {
    return undefined;
  }
  return (
    <Button
      size="xs"
      rounded="full"
      color="accent-background"
      fontWeight="600"
      opacity="hover:0.8 press:0.7"
      scale="press:0.97"
      variant="quiet"
      iconAfter={ListPlusIcon}
      onPress={() => {
        const tracks = songs.map(createTrack);
        TrackPlayer.addMediaItems(tracks);
        toast.success(`${tracks.length} ${tracks.length > 1 ? "tracks" : "track"} added to queue.`);
      }}
    >
      Add all
    </Button>
  );
}
