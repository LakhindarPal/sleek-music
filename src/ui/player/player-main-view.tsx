import type { FavouriteItem, PlayerTrack } from "src/models";

import { decodeHTML } from "entities";
import { Link, type RelativePathString } from "expo-router";
import { Share } from "react-native";
import { toggleFavourite } from "src/db";
import { Heart as HeartIcon, Share2 as ShareIcon } from "src/icons";
import { parsePath } from "src/utils";
import { Button, H2, Image, Paragraph, XStack, YStack } from "tamagui";

export function PlayerMainView({
  track,
  favouriteItem,
  isFavourite,
  onDismiss,
}: {
  track: PlayerTrack;
  favouriteItem: FavouriteItem;
  isFavourite: boolean;
  onDismiss: () => void;
}) {
  return (
    <YStack flex={1} justify="space-evenly" items="center" w="100%" py="2">
      <YStack
        rounded="2xl"
        overflow="hidden"
        boxShadow="0 8px 32px shadow-color"
        borderWidth={1}
        borderColor="border-color"
      >
        <Image src={track.artworkUrl?.toString()} w={320} h={320} />
      </YStack>

      <XStack justify="space-between" items="center" w="100%" px="1" pt="1">
        <YStack flex={1} overflow="hidden" pr="2">
          <Link
            href={parsePath(track.extras?.permaUrl ?? "") as RelativePathString}
            onPress={onDismiss}
          >
            <H2 fontSize={26} fontWeight="800" letterSpacing={-0.6} numberOfLines={1}>
              {decodeHTML(track.title || "")}
            </H2>
          </Link>
          <Paragraph color="color-10" fontSize={15} numberOfLines={1} pt="1" fontWeight="500">
            {decodeHTML(track.artist || "")}
          </Paragraph>
        </YStack>

        <XStack items="center" gap="0-5">
          <Button
            icon=<HeartIcon
              size={22}
              color={isFavourite ? "accent-background" : "color-9"}
              fill={isFavourite ? "accent-background" : "transparent"}
            />
            color={isFavourite ? "accent-background" : "color-9"}
            size="md"
            scale="press:0.88"
            scaleIcon={1.2}
            variant="quiet"
            circular
            onPress={() => toggleFavourite(favouriteItem)}
          />
          <Button
            icon=<ShareIcon size={22} color="color-9" />
            size="md"
            scale="press:0.88"
            scaleIcon={1.2}
            variant="quiet"
            circular
            onPress={() => {
              Share.share({ message: track.extras.permaUrl }).catch(() => {});
            }}
          />
        </XStack>
      </XStack>
    </YStack>
  );
}
