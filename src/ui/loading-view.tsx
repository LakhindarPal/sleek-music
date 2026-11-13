import { Spinner, YStack } from "tamagui";

export function LoadingView() {
  return (
    <YStack bg="background" flex={1} items="center" justify="center">
      <Spinner size="large" color="accent-background" />
    </YStack>
  );
}
