import image404 from "assets/images/404.png";
import { Link, Stack } from "expo-router";
import { H2, Image, Paragraph, SizableText, XStack, YStack } from "tamagui";

export default function NotFoundPage() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <YStack bg="background" flex={1} items="center" justify="center" gap="4" p="4">
        <Image src={image404} w="100%" aspectRatio={1000 / 470} objectFit="contain" />
        <H2 fontSize="7" fontWeight="700">
          This page seems to be missing.
        </H2>
        <Paragraph color="color-10" size="4" text="center">
          But, there are plenty of other great music!
          {"\n"}
          Try one of these:
        </Paragraph>
        <XStack>
          <Link href="/trending?type=song">
            <SizableText color="accent-background">Trending Songs</SizableText>
          </Link>
          <SizableText mx="2">/</SizableText>
          <Link href="/latest?type=album">
            <SizableText color="accent-background">Latest Albums</SizableText>
          </Link>
          <SizableText mx="2">/</SizableText>
          <Link href="/featured">
            <SizableText color="accent-background">Top Playlists</SizableText>
          </Link>
        </XStack>
      </YStack>
    </>
  );
}
