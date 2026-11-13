import type { FavouriteItem, PlayerTrack, Song } from "src/models";

import TrackPlayer from "@rntp/player";
import { decodeHTML } from "entities";
import { useState } from "react";
import { Share } from "react-native";
import { toggleFavourite, useIsFavourite } from "src/db";
import {
  Heart as HeartIcon,
  ListPlus as ListPlusIcon,
  MoreVertical as MoreIcon,
  Play as PlayIcon,
  Share2 as ShareIcon,
} from "src/icons";
import { createTrack } from "src/utils";
import {
  Avatar,
  Button,
  H4,
  ListItem,
  Paragraph,
  Separator,
  Sheet,
  SizableText,
  toast,
  XStack,
  YStack,
} from "tamagui";

import type { MediaListItemData } from "./media-list-item";

export type SongOptionsMenuProps =
  | {
      track: PlayerTrack;
      song?: never;
    }
  | {
      song: Song | MediaListItemData;
      track?: never;
    }
  | (MediaListItemData & {
      track?: never;
      song?: never;
    });

export function SongOptionsMenu(props: SongOptionsMenuProps) {
  const [open, setOpen] = useState(false);

  const track = props.track;
  const song = props.song ?? (track ? undefined : (props as MediaListItemData));

  const id = track ? track.extras?.saavnId || track.mediaId : (song?.id ?? "");
  const title = track ? track.title || "" : (song?.title ?? "");
  const subtitle = track ? track.artist || "" : (song?.subtitle ?? "");
  const image = track ? track.artworkUrl?.toString() || "" : (song?.image ?? "");
  const permaUrl = track ? track.extras?.permaUrl || "" : (song?.perma_url ?? "");
  const itemType = (track ? "song" : song?.type || "song") as FavouriteItem["type"];

  const isFavourite = useIsFavourite(id);
  const favouriteItem: FavouriteItem = {
    id,
    title,
    subtitle,
    image,
    type: itemType,
    perma_url: permaUrl,
  };

  const handlePlayNow = () => {
    if (track) {
      TrackPlayer.setMediaItems([track]);
    } else if (song) {
      TrackPlayer.setMediaItems([createTrack(song)]);
    }
    TrackPlayer.play();
    setOpen(false);
  };

  const handleAddToQueue = () => {
    if (track) {
      TrackPlayer.addMediaItem(track);
    } else if (song) {
      TrackPlayer.addMediaItem(createTrack(song));
    }
    toast.success("Track added to queue.");
    setOpen(false);
  };

  return (
    <>
      <Button variant="quiet" icon={MoreIcon} circular size="sm" onPress={() => setOpen(true)} />
      {open && (
        <Sheet
          modal
          open={open}
          onOpenChange={setOpen}
          snapPoints={[40]}
          dismissOnSnapToBottom
          zIndex={100_000}
          transition="medium"
        >
          <Sheet.Overlay transition="lazy" bg="shadow-6" opacity="enter:0 exit:0" />

          <Sheet.Container flex={1} p="4" gap="2-5">
            <Sheet.Handle bg="color-7" />
            <Sheet.Background
              borderTopLeftRadius="2xl"
              borderTopRightRadius="2xl"
              borderTopWidth={1}
              borderTopColor="border-color"
            />
            <XStack items="center" gap="3" mb="2-5" px="1">
              <Avatar size={48} rounded="xl">
                <Avatar.Image src={image} />
                <Avatar.Fallback bg="color-4" rounded="xl" />
              </Avatar>
              <YStack flex={1} overflow="hidden">
                <H4 fontSize={16} fontWeight="700" letterSpacing={-0.2} numberOfLines={1}>
                  {decodeHTML(title)}
                </H4>
                {Boolean(subtitle) && (
                  <Paragraph fontSize={13} color="color-10" numberOfLines={1} mt="0-5">
                    {decodeHTML(subtitle)}
                  </Paragraph>
                )}
              </YStack>
            </XStack>

            <Separator borderColor="border-color" />

            <YStack w="100%" gap="1">
              <ListItem
                items="center"
                size="sm"
                py="2-5"
                px="2"
                rounded="xl"
                bg="hover:color-3 press:color-4"
                scale="press:0.99"
                icon=<PlayIcon size={18} color="accent-background" />
                title={
                  <SizableText fontSize={15} fontWeight="500" color="color">
                    Play song now
                  </SizableText>
                }
                onPress={handlePlayNow}
              />
              <ListItem
                items="center"
                size="sm"
                py="2-5"
                px="2"
                rounded="xl"
                bg="hover:color-3 press:color-4"
                scale="press:0.99"
                icon=<ListPlusIcon size={18} color="color-9" />
                title={
                  <SizableText fontSize={15} fontWeight="500" color="color">
                    Add to queue
                  </SizableText>
                }
                onPress={handleAddToQueue}
              />
              <ListItem
                items="center"
                size="sm"
                py="2-5"
                px="2"
                rounded="xl"
                bg="hover:color-3 press:color-4"
                scale="press:0.99"
                icon=<HeartIcon
                  size={18}
                  color={isFavourite ? "accent-background" : "color-9"}
                  fill={isFavourite ? "accent-background" : "transparent"}
                />
                title={
                  <SizableText fontSize={15} fontWeight="500" color="color">
                    {isFavourite ? "Remove from library" : "Save to library"}
                  </SizableText>
                }
                onPress={async () => {
                  setOpen(false);
                  await toggleFavourite(favouriteItem);
                }}
              />
              <ListItem
                items="center"
                size="sm"
                py="2-5"
                px="2"
                rounded="xl"
                bg="hover:color-3 press:color-4"
                scale="press:0.99"
                icon=<ShareIcon size={18} color="color-9" />
                title={
                  <SizableText fontSize={15} fontWeight="500" color="color">
                    Share the song
                  </SizableText>
                }
                onPress={() => {
                  Share.share({ message: permaUrl }).catch(() => {});
                }}
              />
            </YStack>
          </Sheet.Container>
        </Sheet>
      )}
    </>
  );
}
