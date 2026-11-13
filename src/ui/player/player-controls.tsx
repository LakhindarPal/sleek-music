import TrackPlayer, { PlaybackState, useProgress } from "@rntp/player";
import { useState } from "react";
import {
  Disc as DiscIcon,
  LetterText as LetterTextIcon,
  ListMusic as ListMusicIcon,
  Pause as PauseIcon,
  Play as PlayIcon,
  SkipBack as SkipBackIcon,
  SkipForward as SkipForwardIcon,
  Timer as TimerIcon,
  Volume1 as Volume1Icon,
  Volume2 as Volume2Icon,
  VolumeX as VolumeXIcon,
} from "src/icons";
import { usePlaybackSpeed, usePlayerVolume, useSleepTimer } from "src/player";
import { formatDuration } from "src/utils";
import { Button, SizableText, Slider, Spinner, View, XStack, YStack } from "tamagui";

import { SleepTimerSheet } from "./sleep-timer-sheet";

export type ViewMode = "lyrics" | "player" | "queue";

const NAV_CONFIG: { mode: ViewMode; label: string; icon: typeof LetterTextIcon }[] = [
  { mode: "lyrics", label: "Lyrics", icon: LetterTextIcon },
  { mode: "player", label: "Player", icon: DiscIcon },
  { mode: "queue", label: "Queue", icon: ListMusicIcon },
];

export function PlayerControls({
  trackDurationFallback,
  playing,
  playbackState,
  viewMode,
  tracksCount,
  onSelectMode,
}: {
  trackDurationFallback?: number;
  playing: boolean;
  playbackState: PlaybackState;
  viewMode: ViewMode;
  tracksCount: number;
  onSelectMode: (mode: ViewMode) => void;
}) {
  const { position, duration, buffered } = useProgress(0.25);
  const [isSliding, setIsSliding] = useState(false);
  const [slidingValue, setSlidingValue] = useState(0);

  const { speed, cycleSpeed } = usePlaybackSpeed();
  const { volume, isMuted, setVolume, toggleMute } = usePlayerVolume();
  const { activeTimer, remainingSeconds, setTimer } = useSleepTimer();
  const [sleepTimerSheetOpen, setSleepTimerSheetOpen] = useState(false);

  const totalDuration = duration > 0 ? duration : trackDurationFallback || 0;
  const currentPosition = isSliding ? slidingValue : Math.floor(position);
  const remaining = Math.max(0, totalDuration - currentPosition);
  const bufferedWidth: `${number}%` =
    totalDuration > 0 ? `${Math.min(100, (buffered / totalDuration) * 100)}%` : "0%";

  return (
    <YStack w="100%" gap="4" pt="1">
      {/* Scrubber */}
      <XStack items="center" gap="2" w="100%">
        <SizableText fontSize={12} color="color-9" fontWeight="600" minW={40} text="right">
          {formatDuration(currentPosition)}
        </SizableText>

        <Slider
          flex={1}
          orientation="horizontal"
          value={[currentPosition]}
          max={Math.max(1, Math.floor(totalDuration))}
          step={1}
          onSlideStart={() => {
            setIsSliding(true);
            setSlidingValue(Math.floor(position));
          }}
          onValueChange={(values) => {
            setIsSliding(true);
            setSlidingValue(values[0]);
          }}
          onSlideEnd={(_, endValue) => {
            const seekTarget = typeof endValue === "number" ? endValue : slidingValue;
            setIsSliding(false);
            TrackPlayer.seekTo(seekTarget);
          }}
        >
          <Slider.Track bg="color-4" h={4} rounded="full">
            <View bg="color-6" position="absolute" h="100%" w={bufferedWidth} rounded="full" />
            <Slider.TrackActive bg="accent-background" rounded="full" />
          </Slider.Track>
          <Slider.Thumb size="sm" index={0} circular bg="accent-background" />
        </Slider>

        <SizableText fontSize={12} color="color-9" fontWeight="600" minW={44}>
          -{formatDuration(Math.floor(remaining))}
        </SizableText>
      </XStack>

      {/* Transport Controls */}
      <XStack justify="space-between" items="center" w="100%" px="1">
        <Button
          size="sm"
          circular
          variant="quiet"
          color="color-9"
          scale="press:0.88"
          scaleIcon={1.2}
          onPress={cycleSpeed}
          w={44}
          h={44}
        >
          <SizableText fontSize={13} fontWeight="700" color="color-9">
            {speed}x
          </SizableText>
        </Button>

        <Button
          icon={SkipBackIcon}
          size="lg"
          variant="quiet"
          circular
          color="color"
          scale="press:0.88"
          scaleIcon={1.3}
          onPress={() => {
            try {
              TrackPlayer.skipToPrevious();
            } catch {}
          }}
        />

        <Button
          icon={
            playbackState === PlaybackState.Buffering ? (
              <Spinner size="large" color="white" />
            ) : playing ? (
              PauseIcon
            ) : (
              PlayIcon
            )
          }
          size="xl"
          circular
          bg="accent-background hover:accent-background"
          color="white"
          scale="press:0.92"
          scaleIcon={1.5}
          boxShadow="0 4px 16px rgba(0, 100, 255, 0.4)"
          disabled={playbackState === PlaybackState.Buffering}
          onPress={() => {
            if (playing) {
              TrackPlayer.pause();
            } else {
              TrackPlayer.play();
            }
          }}
        />

        <Button
          icon={SkipForwardIcon}
          size="lg"
          variant="quiet"
          circular
          color="color"
          scale="press:0.88"
          scaleIcon={1.3}
          onPress={() => {
            try {
              TrackPlayer.skipToNext();
            } catch {}
          }}
        />

        <Button
          icon=<TimerIcon
            size={20}
            color={activeTimer !== null ? "accent-background" : "color-9"}
          />
          size="sm"
          variant="quiet"
          circular
          scaleIcon={1.3}
          onPress={() => setSleepTimerSheetOpen(true)}
          w={44}
          h={44}
        >
          {remainingSeconds !== null && (
            <SizableText fontSize={11} fontWeight="700" color="accent-background" ml="0-5">
              {formatDuration(activeTimer === "track" ? remaining : remainingSeconds, "colon")}
            </SizableText>
          )}
        </Button>
      </XStack>

      {/* Volume Slider */}
      <XStack items="center" gap="2" w="100%" px="1">
        <Button
          icon={isMuted ? VolumeXIcon : Volume1Icon}
          variant="quiet"
          circular
          size="xs"
          color="color-9"
          scaleIcon={1.2}
          onPress={toggleMute}
        />

        <Slider
          flex={1}
          orientation="horizontal"
          value={[volume * 100]}
          max={100}
          step={1}
          onValueChange={(values) => setVolume(values[0] / 100)}
        >
          <Slider.Track bg="color-4" h={3} rounded="full">
            <Slider.TrackActive bg="color-8" rounded="full" />
          </Slider.Track>
          <Slider.Thumb size="xs" index={0} circular />
        </Slider>

        <Button
          icon={Volume2Icon}
          variant="quiet"
          circular
          size="xs"
          color="color-9"
          scaleIcon={1.2}
          onPress={() => setVolume(1)}
        />
      </XStack>

      {/* Bottom Mode Navigation */}
      <XStack justify="space-between" items="center" w="100%" gap="2">
        {NAV_CONFIG.map(({ mode, label, icon: Icon }) => {
          const isActive = viewMode === mode;
          const displayLabel = mode === "queue" ? `${label} (${tracksCount})` : label;

          return (
            <Button
              key={mode}
              icon=<Icon size={15} color={isActive ? "white" : "color-10"} />
              size="sm"
              scale="press:0.92"
              variant={isActive ? undefined : "quiet"}
              bg={isActive ? "accent-background hover:accent-background" : "color-3 hover:color-4"}
              borderColor={isActive ? "accent-background" : "transparent"}
              borderWidth={1}
              color={isActive ? "white" : "color-9"}
              rounded="full"
              px="3"
              h={36}
              flex={1}
              onPress={() => onSelectMode(mode)}
            >
              <SizableText fontSize={13} fontWeight="600" color={isActive ? "white" : "color-10"}>
                {displayLabel}
              </SizableText>
            </Button>
          );
        })}
      </XStack>

      <SleepTimerSheet
        open={sleepTimerSheetOpen}
        onOpenChange={setSleepTimerSheetOpen}
        activeTimer={activeTimer}
        remainingSeconds={activeTimer === "track" ? remaining : remainingSeconds}
        onSelectOption={setTimer}
      />
    </YStack>
  );
}
