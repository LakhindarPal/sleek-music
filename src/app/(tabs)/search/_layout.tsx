import {
  type RelativePathString,
  router,
  Slot,
  useLocalSearchParams,
  usePathname,
} from "expo-router";
import { useState } from "react";
import { Search as SearchIcon, X as ClearIcon } from "src/icons";
import { Button, Form, Input, SizableText, XStack, YStack } from "tamagui";

const tabs = [
  { label: "Songs", path: "songs/" },
  { label: "Albums", path: "albums/" },
  { label: "Playlists", path: "playlists/" },
  { label: "Artists", path: "artists/" },
];

function gotoSearch(query: string, path?: string) {
  const trimmed = query.trim();
  if (trimmed) {
    router.navigate(`/search/${path ?? ""}${encodeURIComponent(trimmed)}` as RelativePathString);
  }
}

export default function SearchLayout() {
  const { query } = useLocalSearchParams<{ query: string }>();
  const [value, setValue] = useState(query);
  const pathname = usePathname();

  const currentTab = tabs.find((t) => t.path && pathname.includes(`/search/${t.path}`))?.path ?? "";

  return (
    <YStack flex={1} px="3" bg="background">
      <YStack gap="2-5" mt="2-5">
        <Form
          items="center"
          flexDirection="row"
          gap="2"
          onSubmit={() => gotoSearch(value, currentTab)}
        >
          <XStack flex={1} position="relative" items="center">
            <Input
              flex={1}
              size="md"
              rounded="2xl"
              pr={value ? "8" : "3"}
              borderColor="focus:accent-background"
              value={value}
              onChangeText={setValue}
              enterKeyHint="search"
              onSubmitEditing={() => gotoSearch(value, currentTab)}
              placeholder="Search for music..."
            />
            {!!value && (
              <Button
                position="absolute"
                r="2"
                size="xs"
                variant="quiet"
                circular
                icon={ClearIcon}
                onPress={() => setValue("")}
              />
            )}
          </XStack>
          <Form.Trigger asChild>
            <Button size="md" rounded="2xl" icon={SearchIcon} />
          </Form.Trigger>
        </Form>

        <XStack w="100%" mb="2" gap="1-5">
          {tabs.map(({ label, path }) => {
            const isSelected = currentTab === path;
            return (
              <Button
                key={label}
                flex={1}
                size="sm"
                rounded="full"
                px="1"
                bg={isSelected ? "accent-background" : "color-3"}
                borderColor={isSelected ? "accent-background" : "border-color"}
                borderWidth={1}
                scale="press:0.97"
                onPress={() => {
                  if (value?.trim()) {
                    gotoSearch(value, path);
                  }
                }}
              >
                <SizableText
                  size="1"
                  fontWeight={isSelected ? "700" : "500"}
                  color={isSelected ? "white" : "color-10"}
                  numberOfLines={1}
                >
                  {label}
                </SizableText>
              </Button>
            );
          })}
        </XStack>
      </YStack>
      <Slot />
    </YStack>
  );
}
