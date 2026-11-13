import type { FavouriteItem, LyricsResponse, PlayerTrack } from "src/models";

import { useActiveMediaItem, useIsPlaying, usePlaybackState } from "@rntp/player";
import { decodeHTML } from "entities";
import { router } from "expo-router";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useIsFavourite } from "src/db";
import { ChevronDown as ChevronDownIcon } from "src/icons";
import { useQueueTracks, useRepeatMode, useShuffleMode } from "src/player";
import {
  PlayerControls,
  PlayerLyricsView,
  PlayerMainView,
  PlayerQueueView,
  type ViewMode,
} from "src/ui/player";
import { apiFetcher, usePreferenceStore } from "src/utils";
import useSWRImmutable from "swr/immutable";
import { Button, Paragraph, XStack, YStack } from "tamagui";

export default function PlayerPage() {
  const insets = useSafeAreaInsets();
  const { autoplay, setAutoplay } = usePreferenceStore();
  const track = useActiveMediaItem() as PlayerTrack | null;
  const tracks = useQueueTracks() as PlayerTrack[];
  const playing = useIsPlaying();
  const playbackState = usePlaybackState();
  const { repeatMode, cycleRepeatMode } = useRepeatMode();
  const { shuffleMode, toggleShuffleMode } = useShuffleMode();
  const isFavourite = useIsFavourite(track?.extras?.saavnId);

  const [viewMode, setViewMode] = useState<ViewMode>("player");
  const [queueSearch, setQueueSearch] = useState("");

  const { data } = useSWRImmutable<LyricsResponse>(
    track?.extras?.hasLyrics && track?.extras?.saavnId
      ? ["song_lyrics", { lyrics_id: track.extras.saavnId }]
      : null,
    apiFetcher,
  );

  const lyrics = decodeHTML(data?.lyrics || "")
    ?.split("<br><br>")
    .map((stanza) =>
      stanza
        .split("<br>")
        .map((line) => line.trim())
        .filter(Boolean),
    );

  const favouriteItem: FavouriteItem | null = track
    ? {
        id: track.extras?.saavnId ?? track.mediaId,
        title: track.title ?? "",
        subtitle: track.artist ?? "",
        image: track.artworkUrl?.toString() ?? "",
        type: "song",
        perma_url: track.extras?.permaUrl ?? "",
      }
    : null;

  const filteredTracks = tracks
    .map((trackItem, originalIndex) => ({ track: trackItem, originalIndex }))
    .filter(({ track: queueTrack }) => {
      if (!queueSearch.trim()) {
        return true;
      }
      const query = queueSearch.toLowerCase();
      return (
        queueTrack.title?.toLowerCase().includes(query) ||
        queueTrack.artist?.toLowerCase().includes(query)
      );
    });

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  if (!track || !favouriteItem) {
    return (
      <YStack
        flex={1}
        bg="background"
        pt={insets.top + 8}
        pb={Math.max(insets.bottom, 20)}
        px="3-5"
        justify="space-between"
      >
        <XStack justify="flex-start" items="center" w="100%" pb="1">
          <Button
            icon={ChevronDownIcon}
            circular
            variant="quiet"
            size="md"
            color="color-9"
            scale="press:0.92"
            onPress={handleClose}
          />
        </XStack>
        <YStack flex={1} items="center" justify="center" gap="2">
          <Paragraph size="3" color="color-9">
            No track is currently playing
          </Paragraph>
        </YStack>
      </YStack>
    );
  }

  return (
    <YStack
      flex={1}
      bg="background"
      pt={insets.top + 8}
      pb={Math.max(insets.bottom, 30)}
      px="3-5"
      justify="space-between"
    >
      <XStack justify="flex-start" items="center" w="100%" pb="1">
        <Button
          icon={ChevronDownIcon}
          circular
          variant="quiet"
          size="md"
          color="color-9"
          scale="press:0.92"
          onPress={handleClose}
        />
      </XStack>

      {viewMode === "player" && (
        <PlayerMainView
          track={track}
          favouriteItem={favouriteItem}
          isFavourite={isFavourite}
          onDismiss={handleClose}
        />
      )}

      {viewMode === "lyrics" && <PlayerLyricsView track={track} lyrics={lyrics} />}

      {viewMode === "queue" && (
        <PlayerQueueView
          tracks={tracks}
          filteredTracks={filteredTracks}
          queueSearch={queueSearch}
          autoplay={autoplay}
          currentTrack={track}
          shuffleMode={shuffleMode}
          repeatMode={repeatMode}
          onSearchChange={setQueueSearch}
          onClearSearch={() => setQueueSearch("")}
          onToggleAutoplay={() => {
            setAutoplay(!autoplay);
          }}
          onToggleShuffle={toggleShuffleMode}
          onCycleRepeat={cycleRepeatMode}
        />
      )}

      <PlayerControls
        trackDurationFallback={Number(track?.duration) || 0}
        playing={playing}
        playbackState={playbackState}
        viewMode={viewMode}
        tracksCount={tracks.length}
        onSelectMode={setViewMode}
      />
    </YStack>
  );
}
