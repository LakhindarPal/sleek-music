import type { PlayerTrack } from "src/models";

import TrackPlayer from "@rntp/player";
import { decodeHTML } from "entities";
import { router, type RelativePathString } from "expo-router";
import { useRef } from "react";
import ReanimatedSwipeable, {
  type SwipeableMethods,
  SwipeDirection,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useIsActive, useReorderableDrag } from "react-native-reorderable-list";
import {
  AudioWaveform as AudioWaveformIcon,
  GripVertical as GripVerticalIcon,
  Play as PlayIcon,
  X as XIcon,
} from "src/icons";
import { formatDuration, parsePath } from "src/utils";
import { Avatar, SizableText, toast, XStack, YStack, ZStack } from "tamagui";

export type QueueRowData = {
  track: PlayerTrack;
  originalIndex: number;
  key: string;
};

function QueueLeftAction({
  progress,
  translation,
  onPlay,
}: {
  progress: SharedValue<number>;
  translation: SharedValue<number>;
  onPlay: () => void;
}) {
  const containerStyle = useAnimatedStyle(() => {
    const isVisible = translation.value > 0;
    return {
      opacity: isVisible ? 1 : 0,
      pointerEvents: isVisible ? "auto" : "none",
    };
  });

  const backgroundStyle = useAnimatedStyle(() => ({
    width: Math.max(90, translation.value),
  }));

  const iconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.1, 0.7], [0, 1], Extrapolation.CLAMP),
    transform: [{ scale: interpolate(progress.value, [0.3, 1], [0.5, 1], Extrapolation.CLAMP) }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: 90,
          height: "100%",
          position: "relative",
          justifyContent: "center",
          alignItems: "center",
        },
        containerStyle,
      ]}
    >
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            backgroundColor: "#10b981",
            borderRadius: 16,
          },
          backgroundStyle,
        ]}
      />
      <XStack
        w={90}
        h="100%"
        items="center"
        justify="center"
        cursor="pointer"
        opacity="press:0.8"
        scale="press:0.99"
        onPress={onPlay}
      >
        <Animated.View style={iconStyle}>
          <XStack items="center" gap="1-5" px="2">
            <PlayIcon size={18} color="white" fill="white" />
            <SizableText size="1" fontWeight="700" color="white">
              Play
            </SizableText>
          </XStack>
        </Animated.View>
      </XStack>
    </Animated.View>
  );
}

function QueueRightAction({
  progress,
  translation,
  onDelete,
}: {
  progress: SharedValue<number>;
  translation: SharedValue<number>;
  onDelete: () => void;
}) {
  const containerStyle = useAnimatedStyle(() => {
    const isVisible = translation.value < 0;
    return {
      opacity: isVisible ? 1 : 0,
      pointerEvents: isVisible ? "auto" : "none",
    };
  });

  const backgroundStyle = useAnimatedStyle(() => ({
    width: Math.max(95, -translation.value),
  }));

  const iconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.1, 0.7], [0, 1], Extrapolation.CLAMP),
    transform: [{ scale: interpolate(progress.value, [0.3, 1], [0.5, 1], Extrapolation.CLAMP) }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: 95,
          height: "100%",
          position: "relative",
          justifyContent: "center",
          alignItems: "center",
        },
        containerStyle,
      ]}
    >
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            backgroundColor: "#ef4444",
            borderRadius: 16,
          },
          backgroundStyle,
        ]}
      />
      <XStack
        w={95}
        h="100%"
        items="center"
        justify="center"
        cursor="pointer"
        opacity="press:0.8"
        scale="press:0.99"
        onPress={onDelete}
      >
        <Animated.View style={iconStyle}>
          <XStack items="center" gap="1-5" px="2">
            <SizableText size="1" fontWeight="700" color="white">
              Remove
            </SizableText>
            <XIcon size={18} color="white" />
          </XStack>
        </Animated.View>
      </XStack>
    </Animated.View>
  );
}

export function QueueRow({
  item,
  isCurrentTrack,
  onOpenRow,
  onCloseRow,
}: {
  item: QueueRowData;
  isCurrentTrack: boolean;
  onOpenRow: (ref: SwipeableMethods) => void;
  onCloseRow: (ref: SwipeableMethods) => void;
}) {
  const drag = useReorderableDrag();
  const isDragging = useIsActive();
  const swipeableRef = useRef<SwipeableMethods | null>(null);
  const { track, originalIndex } = item;

  const handlePlay = () => {
    swipeableRef.current?.close();
    TrackPlayer.skipToIndex(originalIndex);
  };

  const handleDelete = () => {
    swipeableRef.current?.close();
    TrackPlayer.removeMediaItem(originalIndex);
    toast.error("Track removed from queue.");
  };

  const handleDrag = () => {
    if (swipeableRef.current) {
      onCloseRow(swipeableRef.current);
      swipeableRef.current.close();
    }
    drag();
  };

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      enabled={!isDragging}
      friction={2}
      leftThreshold={50}
      rightThreshold={50}
      overshootLeft
      overshootRight
      overshootFriction={2}
      containerStyle={{ overflow: "hidden", borderRadius: 16 }}
      onSwipeableWillOpen={() => {
        if (swipeableRef.current) {
          onOpenRow(swipeableRef.current);
        }
      }}
      onSwipeableOpen={(direction) => {
        if (direction === SwipeDirection.RIGHT) {
          handlePlay();
        } else if (direction === SwipeDirection.LEFT) {
          handleDelete();
        }
      }}
      onSwipeableClose={() => {
        if (swipeableRef.current) {
          onCloseRow(swipeableRef.current);
        }
      }}
      renderLeftActions={(progress, translation) => (
        <QueueLeftAction progress={progress} translation={translation} onPlay={handlePlay} />
      )}
      renderRightActions={(progress, translation) => (
        <QueueRightAction progress={progress} translation={translation} onDelete={handleDelete} />
      )}
    >
      <XStack
        items="center"
        justify="space-between"
        w="100%"
        h={58}
        py="1-5"
        px="2-5"
        rounded="xl"
        bg={isDragging ? "color-4" : isCurrentTrack ? "color-3" : "color-1"}
        scale={isDragging ? 1.02 : "press:0.99"}
        boxShadow={isDragging ? "0 4px 12px shadow-color" : undefined}
        cursor="pointer"
        onPress={() => {
          swipeableRef.current?.close();
            router.push(parsePath(track.extras.permaUrl) as RelativePathString);
        }}
        onLongPress={handleDrag}
        disabled={isDragging}
      >
        <XStack items="center" gap="2-5" flex={1} overflow="hidden" pr="2">
          <ZStack w={46} h={46} items="center" justify="center">
            <Avatar size={46} rounded="lg">
              <Avatar.Image src={track.artworkUrl?.toString()} />
              <Avatar.Fallback bg="color-4" rounded="lg" />
            </Avatar>
            {isCurrentTrack && (
              <YStack
                position="absolute"
                inset={0}
                bg="rgba(0, 0, 0, 0.55)"
                rounded="lg"
                items="center"
                justify="center"
                pointerEvents="none"
              >
                <AudioWaveformIcon size={18} color="accent-background" />
              </YStack>
            )}
          </ZStack>

          <YStack flex={1} overflow="hidden">
            <SizableText
              fontSize={15}
              fontWeight={isCurrentTrack ? "700" : "600"}
              letterSpacing={-0.1}
              color={isCurrentTrack ? "accent-background" : "color"}
              numberOfLines={1}
            >
              {decodeHTML(track.title || "")}
            </SizableText>
            <SizableText fontSize={12} color="color-9" numberOfLines={1}>
              {decodeHTML(track.artist || "")}
            </SizableText>
          </YStack>
        </XStack>

        <XStack items="center" gap="2">
          <SizableText fontSize={12} color="color-9" fontWeight="500">
            {formatDuration(Number(track.duration) || 0)}
          </SizableText>
          <XStack
            p="1-5"
            cursor="grab"
            opacity="hover:0.8 press:0.6"
            onPressIn={handleDrag}
            disabled={isDragging}
          >
            <GripVerticalIcon size={16} color="color-9" />
          </XStack>
        </XStack>
      </XStack>
    </ReanimatedSwipeable>
  );
}
