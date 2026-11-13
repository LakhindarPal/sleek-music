import type { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";
import type { PlayerTrack } from "src/models";

import TrackPlayer, { RepeatMode } from "@rntp/player";
import { decodeHTML } from "entities";
import { useRef } from "react";
import { Share } from "react-native";
import ReorderableList, {
  type ReorderableListRenderItemInfo,
  type ReorderableListReorderEvent,
} from "react-native-reorderable-list";
import {
  Infinity as InfinityIcon,
  ListMusic as ListMusicIcon,
  Repeat1 as RepeatOneIcon,
  Repeat as RepeatIcon,
  Search as SearchIcon,
  Shuffle as ShuffleIcon,
  Trash2 as TrashIcon,
  X as XIcon,
  Share2 as ShareIcon,
} from "src/icons";
import {
  Avatar,
  Button,
  H3,
  H4,
  Input,
  Paragraph,
  Separator,
  SizableText,
  View,
  XStack,
  YStack,
} from "tamagui";

import { QueueRow, type QueueRowData } from "./queue-row";

const ITEM_LAYOUT = (_: unknown, index: number) => ({
  length: 58,
  offset: 58 * index,
  index,
});

export function PlayerQueueView({
  tracks,
  filteredTracks,
  queueSearch,
  autoplay,
  currentTrack,
  shuffleMode,
  repeatMode,
  onSearchChange,
  onClearSearch,
  onToggleAutoplay,
  onToggleShuffle,
  onCycleRepeat,
}: {
  tracks: PlayerTrack[];
  filteredTracks: { track: PlayerTrack; originalIndex: number }[];
  queueSearch: string;
  autoplay: boolean;
  currentTrack: PlayerTrack;
  shuffleMode: boolean;
  repeatMode: RepeatMode;
  onSearchChange: (text: string) => void;
  onClearSearch: () => void;
  onToggleAutoplay: () => void;
  onToggleShuffle: () => void;
  onCycleRepeat: () => void;
}) {
  const isRepeatActive = repeatMode !== RepeatMode.Off;
  const RepeatIconComponent = repeatMode === RepeatMode.One ? RepeatOneIcon : RepeatIcon;
  const openRowRef = useRef<SwipeableMethods | null>(null);

  const handleOpenRow = (ref: SwipeableMethods) => {
    if (openRowRef.current && openRowRef.current !== ref) {
      openRowRef.current.close();
    }
    openRowRef.current = ref;
  };

  const handleCloseRow = (ref: SwipeableMethods) => {
    if (openRowRef.current === ref) {
      openRowRef.current = null;
    }
  };

  const currentMediaId = currentTrack?.mediaId;

  const queueData: QueueRowData[] = filteredTracks.map((item) => ({
    ...item,
    key: item.track.mediaId || String(item.track.url ?? `track-${item.originalIndex}`),
  }));

  const renderItem = ({ item }: ReorderableListRenderItemInfo<QueueRowData>) => (
    <QueueRow
      item={item}
      isCurrentTrack={Boolean(currentMediaId && item.track.mediaId === currentMediaId)}
      onOpenRow={handleOpenRow}
      onCloseRow={handleCloseRow}
    />
  );

  return (
    <YStack flex={1} w="100%" gap="2">
      <XStack justify="space-between" items="center" w="100%" px="1" pb="1">
        <XStack items="center" gap="2-5" flex={1} overflow="hidden" pr="2">
          <Avatar size={46} rounded="lg">
            <Avatar.Image src={currentTrack.artworkUrl?.toString()} />
            <Avatar.Fallback bg="color-4" rounded="lg" />
          </Avatar>
          <YStack flex={1} overflow="hidden">
            <H4 fontSize={16} fontWeight="700" letterSpacing={-0.2} numberOfLines={1}>
              {decodeHTML(currentTrack.title || "")}
            </H4>
            <Paragraph color="color-10" fontSize={13} numberOfLines={1} mt="0-5">
              {decodeHTML(currentTrack.artist || "")}
            </Paragraph>
          </YStack>
        </XStack>

        <Button
          icon=<ShareIcon size={22} color="color-9" />
          size="sm"
          scale="press:0.88"
          scaleIcon={1.2}
          variant="quiet"
          circular
          onPress={() => {
            Share.share({ message: currentTrack.extras.permaUrl }).catch(() => {});
          }}
        />
      </XStack>

      <Separator borderColor="border-color" />

      <XStack items="center" justify="space-between" gap="2" w="100%">
        <Button
          flex={1}
          size="sm"
          rounded="xl"
          bg={shuffleMode ? "accent-background" : "color-3"}
          color={shuffleMode ? "white" : "color-10"}
          scale="press:0.95"
          variant={shuffleMode ? undefined : "quiet"}
          icon=<ShuffleIcon size={14} color={shuffleMode ? "white" : "color-10"} />
          onPress={onToggleShuffle}
        >
          <SizableText size="1" fontWeight="600" color={shuffleMode ? "white" : "color-10"}>
            Shuffle
          </SizableText>
        </Button>

        <Button
          flex={1}
          size="sm"
          rounded="xl"
          bg={isRepeatActive ? "accent-background" : "color-3"}
          color={isRepeatActive ? "white" : "color-10"}
          scale="press:0.95"
          variant={isRepeatActive ? undefined : "quiet"}
          icon=<RepeatIconComponent size={14} color={isRepeatActive ? "white" : "color-10"} />
          onPress={onCycleRepeat}
        >
          <SizableText size="1" fontWeight="600" color={isRepeatActive ? "white" : "color-10"}>
            {repeatMode === RepeatMode.One ? "Repeat 1" : "Repeat"}
          </SizableText>
        </Button>

        <Button
          flex={1}
          size="sm"
          rounded="xl"
          bg={autoplay ? "accent-background" : "color-3"}
          color={autoplay ? "white" : "color-10"}
          scale="press:0.95"
          variant={autoplay ? undefined : "quiet"}
          icon=<InfinityIcon size={14} color={autoplay ? "white" : "color-10"} />
          onPress={onToggleAutoplay}
        >
          <SizableText size="1" fontWeight="600" color={autoplay ? "white" : "color-10"}>
            Autoplay
          </SizableText>
        </Button>
      </XStack>

      {/* Queue Header & Actions */}
      <XStack justify="space-between" items="center" w="100%" px="1">
        <XStack items="center" gap="2">
          <H3 fontSize={20} fontWeight="700" letterSpacing={-0.3}>
            Queue
          </H3>
          <View bg="color-4" px="2" py="0-5" rounded="full">
            <SizableText size="1" fontWeight="700" color="color-10">
              {tracks.length}
            </SizableText>
          </View>
        </XStack>

        <Button
          size="xs"
          rounded="xl"
          px="2-5"
          bg="red-600"
          scale="press:0.94"
          variant="quiet"
          color="color-11"
          icon=<TrashIcon size={13} color="color-11" />
          onPress={() => {
            if (currentTrack) {
              TrackPlayer.setMediaItems([currentTrack]);
            }
          }}
        >
          Clear
        </Button>
      </XStack>

      {/* Queue Search */}
      <XStack items="center" bg="color-3" rounded="xl" px="2-5" py="1" gap="2">
        <SearchIcon size={15} color="color-9" />
        <Input
          flex={1}
          placeholderTextColor="placeholder-color"
          size="sm"
          borderWidth={0}
          bg="transparent"
          color="color"
          placeholder="Search in queue..."
          value={queueSearch}
          onChangeText={onSearchChange}
        />
        {queueSearch.length > 0 && (
          <Button
            size="xs"
            variant="quiet"
            circular
            icon=<XIcon size={14} color="color-9" />
            onPress={onClearSearch}
          />
        )}
      </XStack>

      {/* Reorderable Queue List */}
      {queueData.length > 0 ? (
        <ReorderableList<QueueRowData>
          data={queueData}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          getItemLayout={ITEM_LAYOUT}
          initialNumToRender={12}
          maxToRenderPerBatch={8}
          windowSize={5}
          updateCellsBatchingPeriod={50}
          shouldUpdateActiveItem
          onReorder={({ from, to }: ReorderableListReorderEvent) => {
            if (from === to) {
              return;
            }
            const fromTrack = queueData[from];
            const toTrack = queueData[to];
            if (fromTrack && toTrack) {
              TrackPlayer.moveMediaItem(fromTrack.originalIndex, toTrack.originalIndex);
            }
          }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <Separator h={6} />}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      ) : (
        <YStack py="10" items="center" justify="center" gap="2">
          <ListMusicIcon size={36} color="color-9" />
          <Paragraph color="color-10" fontSize={15}>
            {queueSearch ? "No matching songs found in queue" : "Queue is empty"}
          </Paragraph>
        </YStack>
      )}
    </YStack>
  );
}
