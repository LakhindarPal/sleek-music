import { YStack, H2, Button, Paragraph } from "tamagui";

export function TryAgain({ refresh }: { refresh: () => void }) {
  return (
    <YStack bg="background" flex={1} items="center" justify="center" gap="3" p="4">
      <H2 fontSize={20} fontWeight="700" letterSpacing={-0.3} text="center">
        Unable to load data.
      </H2>
      <Paragraph fontSize={14} color="color-9" text="center">
        Please check your internet connection.
      </Paragraph>
      <Button
        size="sm"
        bg="accent-background"
        color="white"
        rounded="full"
        px="5"
        fontWeight="600"
        scale="press:0.96"
        onPress={refresh}
      >
        Try Again
      </Button>
    </YStack>
  );
}
