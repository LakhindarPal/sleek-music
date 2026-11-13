import type { JSX } from "react";

import { decodeHTML } from "entities";
import { router, type RelativePathString } from "expo-router";
import { formatDuration, parsePath } from "src/utils";
import { Avatar, ListItem, SizableText, XStack } from "tamagui";

import { SongOptionsMenu } from "./song-options-menu";

export type MediaListItemData = {
  id: string;
  title: string;
  subtitle?: string | null;
  image?: string | null;
  perma_url: string;
  type?: string;
  language?: string;
  explicit_content?: "0" | "1";
  more_info?: {
    duration?: string | number;
    encrypted_media_url?: string;
    album?: string;
    release_date?: string;
    has_lyrics?: string;
  };
};

export type MediaListItemProps = MediaListItemData & {
  trackNumber?: number;
  iconAfterOverride?: JSX.Element;
};

export function MediaListItem({ trackNumber, iconAfterOverride, ...song }: MediaListItemProps) {
  const isArtistItem = song.type === "artist" || /\/artist\//i.test(song.perma_url);
  const duration = song.more_info?.duration
    ? formatDuration(Number(song.more_info.duration))
    : null;

  return (
    <ListItem
      w="100%"
      items="center"
      size="3"
      py="1-5"
      px="2"
      gap="2-5"
      bg="hover:color-3 press:color-4"
      scale="press:0.99"
      rounded="xl"
      cursor="pointer"
      onPress={() => router.push(parsePath(song.perma_url) as RelativePathString)}
      icon={
        <XStack items="center" gap="2">
          {trackNumber !== undefined && (
            <SizableText fontSize={12} color="color-9" w={20} text="right" fontWeight="500">
              {trackNumber < 10 ? `0${trackNumber}` : trackNumber}
            </SizableText>
          )}
          <Avatar size={46} circular={isArtistItem} rounded={isArtistItem ? undefined : "lg"}>
            <Avatar.Image src={song.image ?? undefined} />
            <Avatar.Fallback bg="color-4" rounded={isArtistItem ? undefined : "lg"} />
          </Avatar>
        </XStack>
      }
      title={
        <SizableText fontSize={15} fontWeight="600" letterSpacing={-0.1} numberOfLines={1}>
          {decodeHTML(song.title)}
        </SizableText>
      }
      subTitle={
        song.subtitle ? (
          <SizableText fontSize={12} color="color-10" numberOfLines={1} mt="0-5">
            {decodeHTML(song.subtitle)}
          </SizableText>
        ) : undefined
      }
      iconAfter={
        <XStack items="center" gap="1-5">
          {iconAfterOverride !== undefined ? (
            iconAfterOverride
          ) : (
            <>
              {duration && (
                <SizableText fontSize={12} color="color-9" fontWeight="500">
                  {duration}
                </SizableText>
              )}
              <SongOptionsMenu song={song} />
            </>
          )}
        </XStack>
      }
    />
  );
}
