import TrackPlayer, {
  PlaybackState,
  useActiveMediaItem,
  useIsPlaying,
  usePlaybackState,
  useProgress,
} from "@rntp/player";
import { decodeHTML } from "entities";
import { router, type RelativePathString } from "expo-router";
import { Platform, type ViewStyle } from "react-native";
import { GestureDetector, usePanGesture } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import {
  Pause as PauseIcon,
  Play as PlayIcon,
  SkipBack as SkipBackIcon,
  SkipForward as SkipForwardIcon,
} from "src/icons";
import {
  Avatar,
  Button,
  Card,
  H4,
  Paragraph,
  Progress,
  SizableText,
  Spinner,
  View,
  XStack,
  YStack,
} from "tamagui";

function FloatingProgressBar({ durationFallback }: { durationFallback?: number }) {
  const { position, duration } = useProgress(0.25);
  const totalDuration = duration > 0 ? duration : durationFallback || 0;
  const progressPercent =
    totalDuration > 0 ? Math.min(100, Math.max(0, (position / totalDuration) * 100)) : 0;

  return (
    <Progress value={progressPercent} max={100} h={2} rounded="0" bg="color-4">
      <Progress.Indicator bg="accent-background" />
    </Progress>
  );
}

export function FloatingPlayer() {
  const playing = useIsPlaying();
  const playbackState = usePlaybackState();
  const track = useActiveMediaItem();

  const translateX = useSharedValue(0);

  const handleSkipNext = () => {
    try {
      TrackPlayer.skipToNext();
    } catch {
      // ignore
    }
  };

  const handleSkipPrevious = () => {
    try {
      TrackPlayer.skipToPrevious();
    } catch {
      // ignore
    }
  };

  const panGesture = usePanGesture({
    activeOffsetX: [-12, 12],
    failOffsetY: [-12, 12],
    onUpdate: (event) => {
      const maxDrag = 110;
      const drag = event.translationX;
      if (Math.abs(drag) > maxDrag) {
        const sign = Math.sign(drag);
        const over = Math.abs(drag) - maxDrag;
        translateX.value = sign * (maxDrag + over * 0.2);
      } else {
        translateX.value = drag;
      }
    },
    onDeactivate: (event) => {
      const { translationX: dx, velocityX: vx } = event;
      if (dx < -50 || (dx < -20 && vx < -400)) {
        scheduleOnRN(handleSkipNext);
      } else if (dx > 50 || (dx > 20 && vx > 400)) {
        scheduleOnRN(handleSkipPrevious);
      }

      translateX.value = withSpring(0, {
        damping: 20,
        stiffness: 220,
        mass: 0.8,
      });
    },
    onFinalize: () => {
      translateX.value = withSpring(0, {
        damping: 20,
        stiffness: 220,
        mass: 0.8,
      });
    },
  });

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const prevIndicatorStyle = useAnimatedStyle(() => {
    const val = translateX.value;
    const opacity = interpolate(val, [10, 50], [0, 1], Extrapolation.CLAMP);
    const scale = interpolate(val, [10, 50], [0.6, 1], Extrapolation.CLAMP);
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const nextIndicatorStyle = useAnimatedStyle(() => {
    const val = -translateX.value;
    const opacity = interpolate(val, [10, 50], [0, 1], Extrapolation.CLAMP);
    const scale = interpolate(val, [10, 50], [0.6, 1], Extrapolation.CLAMP);
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  if (!track) {
    return null;
  }

  return (
    <View position="relative" mx="2-5" mb="1-5">
      {/* Background hint revealed when swiping */}
      <XStack
        position="absolute"
        inset={0}
        items="center"
        justify="space-between"
        px="4"
        bg="color-4"
        rounded="xl"
        overflow="hidden"
      >
        <Animated.View style={prevIndicatorStyle}>
          <XStack items="center" gap="1-5">
            <SkipBackIcon size={16} color="accent-background" />
            <SizableText fontSize={12} fontWeight="700" color="accent-background">
              Previous
            </SizableText>
          </XStack>
        </Animated.View>

        <Animated.View style={nextIndicatorStyle}>
          <XStack items="center" gap="1-5">
            <SizableText fontSize={12} fontWeight="700" color="accent-background">
              Next
            </SizableText>
            <SkipForwardIcon size={16} color="accent-background" />
          </XStack>
        </Animated.View>
      </XStack>

      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            animatedCardStyle,
            Platform.OS === "web"
              ? ({
                  userSelect: "none",
                  touchAction: "pan-y",
                } as unknown as ViewStyle)
              : null,
          ]}
        >
          <Card
            boxShadow="0 2px 12px shadow-color"
            borderWidth={1}
            borderColor="border-color"
            bg="color-2"
            rounded="sm"
            overflow="hidden"
            opacity="press:0.95"
            scale="press:0.99"
            onPress={() => router.push("/player" as RelativePathString)}
          >
            <XStack items="center" justify="space-between" gap="2-5" px="3" py="2-5">
              <Avatar size={42}>
                <Avatar.Image src={track.artworkUrl?.toString()} />
                <Avatar.Fallback bg="color-4" />
              </Avatar>

              <YStack flex={1} overflow="hidden">
                <H4 fontSize={15} fontWeight="600" letterSpacing={-0.1} numberOfLines={1}>
                  {decodeHTML(track.title || "")}
                </H4>
                <Paragraph fontSize={13} color="color-10" numberOfLines={1} mt="0-5">
                  {decodeHTML(track.artist || "")}
                </Paragraph>
              </YStack>

              <Button
                icon={
                  playbackState === PlaybackState.Buffering ? (
                    <Spinner size="small" color="accent-background" />
                  ) : playing ? (
                    PauseIcon
                  ) : (
                    PlayIcon
                  )
                }
                color="accent-background"
                size="sm"
                scale="press:0.9"
                variant="quiet"
                circular
                disabled={playbackState === PlaybackState.Buffering}
                onPress={(e) => {
                  e.stopPropagation();
                  if (playing) {
                    TrackPlayer.pause();
                  } else {
                    TrackPlayer.play();
                  }
                }}
              />
            </XStack>

            <FloatingProgressBar durationFallback={Number(track.duration) || 0} />
          </Card>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
