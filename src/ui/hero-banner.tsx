import type { ReactNode } from "react";
import type { FavouriteItem, Song } from "src/models";

import TrackPlayer from "@rntp/player";
import { decodeHTML } from "entities";
import { Share } from "react-native";
import { toggleFavourite, useIsFavourite } from "src/db";
import {
  Heart as HeartIcon,
  ListPlus as ListPlusIcon,
  Play as PlayIcon,
  Share2 as ShareIcon,
} from "src/icons";
import { createTrack } from "src/utils";
import {
  Button,
  type ButtonProps,
  type ColorTokens,
  H1,
  Image,
  Paragraph,
  toast,
  XStack,
  YStack,
} from "tamagui";

const ActionButton = ({
  icon,
  onPress,
  bg = "color-3",
}: {
  icon: ButtonProps["icon"];
  onPress: () => void;
  bg?: ColorTokens;
}) => (
  <Button
    icon={icon}
    circular
    size="md"
    bg={`${bg} hover:color-4`}
    borderWidth={1}
    borderColor="border-color"
    opacity="hover:0.9 press:0.8"
    scale="press:0.92"
    onPress={onPress}
  />
);

export interface HeroBannerProps extends FavouriteItem {
  showImage?: boolean;
  songs: Song[];
  children?: ReactNode;
}

export function HeroBanner({
  id,
  title,
  subtitle = "",
  image,
  type,
  showImage = true,
  songs,
  perma_url,
  children: stats,
}: HeroBannerProps) {
  const isFavourite = useIsFavourite(id);
  const item: FavouriteItem = { id, title, subtitle, image, type, perma_url };
  const isArtist = type === "artist";

  return (
    <YStack
      mt="1-5"
      mb="2"
      p="4"
      bg="color-2"
      borderWidth={1}
      borderColor="border-color"
      rounded="2xl"
      boxShadow="0 1px 4px shadow-color"
      gap="3"
    >
      {showImage && (
        <YStack position="relative" items="center" justify="center" my="1">
          <YStack
            position="absolute"
            w={200}
            h={200}
            rounded={isArtist ? "full" : "2xl"}
            bg="accent-background"
            opacity={0.12}
            boxShadow="0 8px 32px rgba(0, 100, 255, 0.35)"
          />
          <YStack
            boxShadow="0 4px 16px shadow-color"
            rounded={isArtist ? "full" : "2xl"}
            overflow="hidden"
            borderWidth={1}
            borderColor="border-color"
          >
            <Image
              src={image?.replace(/(?:50|150)x(?:50|150)\.jpg/g, "250x250.jpg")}
              w={210}
              h={210}
              rounded={isArtist ? "full" : "2xl"}
            />
          </YStack>
        </YStack>
      )}

      <YStack gap="1">
        <H1 fontSize={28} fontWeight="800" letterSpacing={-0.5}>
          {decodeHTML(title)}
        </H1>
        {subtitle && (
          <Paragraph color="color-10" fontSize={14} fontWeight="500">
            {decodeHTML(subtitle)}
          </Paragraph>
        )}
      </YStack>

      {stats}

      <XStack gap="2-5" pt="0-5" items="center">
        {!!songs.length && (
          <Button
            icon=<PlayIcon size={15} color="white" fill="white" />
            bg="accent-background hover:accent-background"
            color="white"
            rounded="full"
            size="md"
            px="5"
            fontWeight="700"
            fontSize={15}
            scale="press:0.95"
            opacity="press:0.9"
            boxShadow="0 2px 8px rgba(0, 100, 255, 0.4)"
            onPress={() => playSongs(songs)}
          >
            Play
          </Button>
        )}
        {!!songs.length && (
          <ActionButton icon={ListPlusIcon} onPress={() => addSongsToQueue(songs)} />
        )}
        <ActionButton
          icon=<HeartIcon
            color={isFavourite ? "accent-background" : "color-10"}
            fill={isFavourite ? "accent-background" : "transparent"}
          />
          onPress={() => toggleFavourite(item)}
        />
        <ActionButton icon={ShareIcon} onPress={() => shareLink(perma_url)} />
      </XStack>
    </YStack>
  );
}

function playSongs(songs: Song[]) {
  if (!songs.length) {
    return;
  }
  const tracks = songs.map(createTrack);
  TrackPlayer.setMediaItems(tracks);
  TrackPlayer.play();
}

function addSongsToQueue(songs: Song[]) {
  if (!songs.length) {
    return;
  }
  const tracks = songs.map(createTrack);
  TrackPlayer.addMediaItems(tracks);
  toast.success(`${tracks.length} ${tracks.length > 1 ? "tracks" : "track"} added to queue.`);
}

function shareLink(url: string) {
  Share.share({ message: url }).catch(() => {});
}
