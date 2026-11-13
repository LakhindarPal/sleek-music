import type { SleepTimerOption } from "src/player";

import { Check as CheckIcon } from "src/icons";
import { formatDuration } from "src/utils";
import {
  Button,
  ListItem,
  Paragraph,
  Separator,
  Sheet,
  SizableText,
  XStack,
  YStack,
} from "tamagui";

const TIMER_OPTIONS: { label: string; value: SleepTimerOption }[] = [
  { label: "15 minutes", value: 15 },
  { label: "30 minutes", value: 30 },
  { label: "45 minutes", value: 45 },
  { label: "60 minutes", value: 60 },
  { label: "End of current song", value: "track" },
];

export function SleepTimerSheet({
  open,
  onOpenChange,
  activeTimer,
  remainingSeconds,
  onSelectOption,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeTimer: SleepTimerOption;
  remainingSeconds: number | null;
  onSelectOption: (option: SleepTimerOption) => void;
}) {
  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[45]}
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

        <YStack items="center" gap="1" mb="1-5">
          <SizableText fontSize={18} fontWeight="700" letterSpacing={-0.3}>
            Sleep Timer
          </SizableText>
          {activeTimer && remainingSeconds !== null && (
            <XStack items="center" columnGap="2">
              <Paragraph fontSize={13} color="accent-background" fontWeight="500">
                Stopping playback in {formatDuration(remainingSeconds, "pretty")}
              </Paragraph>
              <Button
                size="sm"
                rounded="full"
                bg="hover:color-3 press:color-4"
                color="red-700"
                scale="press:0.99"
                onPress={() => {
                  onSelectOption(null);
                  onOpenChange(false);
                }}
              >
                clear timer
              </Button>
            </XStack>
          )}
        </YStack>

        <Separator borderColor="border-color" />

        <YStack w="100%" gap="1">
          {TIMER_OPTIONS.map((opt) => {
            const isSelected = activeTimer === opt.value;
            return (
              <ListItem
                key={opt.label}
                items="center"
                size="sm"
                py="2-5"
                px="2"
                rounded="xl"
                bg={isSelected ? "color-4" : "hover:color-3 press:color-4"}
                scale="press:0.99"
                title={
                  <SizableText
                    fontSize={15}
                    fontWeight={isSelected ? "700" : "500"}
                    color={isSelected ? "accent-background" : "color"}
                  >
                    {opt.label}
                  </SizableText>
                }
                iconAfter={
                  isSelected ? <CheckIcon size={18} color="accent-background" /> : undefined
                }
                onPress={() => {
                  onSelectOption(opt.value);
                  onOpenChange(false);
                }}
              />
            );
          })}
        </YStack>
      </Sheet.Container>
    </Sheet>
  );
}
