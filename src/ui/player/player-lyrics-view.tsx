import type { PlayerTrack } from "src/models";

import { decodeHTML } from "entities";
import { Share } from "react-native";
import { LetterText as LetterTextIcon, Share2 as ShareIcon } from "src/icons";
import { Avatar, Button, H4, Paragraph, ScrollView, Separator, XStack, YStack } from "tamagui";

export function PlayerLyricsView({
  track,
  lyrics,
}: {
  track: PlayerTrack;
  lyrics: string[][] | undefined;
}) {
  return (
    <YStack flex={1} w="100%" gap="2">
      <XStack justify="space-between" items="center" w="100%" px="1" pb="1">
        <XStack items="center" gap="2-5" flex={1} overflow="hidden" pr="2">
          <Avatar size={46} rounded="lg">
            <Avatar.Image src={track.artworkUrl?.toString()} />
            <Avatar.Fallback bg="color-4" rounded="lg" />
          </Avatar>
          <YStack flex={1} overflow="hidden">
            <H4 fontSize={16} fontWeight="700" letterSpacing={-0.2} numberOfLines={1}>
              {decodeHTML(track.title || "")}
            </H4>
            <Paragraph color="color-10" fontSize={13} numberOfLines={1} mt="0-5">
              {decodeHTML(track.artist || "")}
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
            Share.share({ message: track.extras.permaUrl }).catch(() => {});
          }}
        />
      </XStack>

      <Separator borderColor="border-color" />

      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 8 }}
      >
        {lyrics && lyrics.length > 0 ? (
          lyrics.map((lines, idx) => (
            <YStack key={idx} my="3" gap="1-5">
              {lines.map((line, i) => (
                <Paragraph
                  key={i}
                  fontSize={18}
                  fontWeight="600"
                  text="center"
                  letterSpacing={-0.2}
                  color="color"
                >
                  {line}
                </Paragraph>
              ))}
            </YStack>
          ))
        ) : (
          <YStack py="10" items="center" justify="center" gap="2">
            <LetterTextIcon size={36} color="color-9" />
            <Paragraph color="color-10" fontSize={15} text="center">
              No lyrics available for this song
            </Paragraph>
          </YStack>
        )}
      </ScrollView>
    </YStack>
  );
}
