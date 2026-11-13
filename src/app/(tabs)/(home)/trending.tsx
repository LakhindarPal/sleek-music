import type { TrendingItem } from "src/models";

import { Unmatched, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { GridView, LoadingView, MediaCard, TryAgain } from "src/ui";
import { apiFetcher, getPreferredLanguages } from "src/utils";
import useSWR from "swr";
import { ScrollView, Separator, SizableText, Tabs, ToggleGroup, YStack } from "tamagui";

export default function TrendingPage() {
  const { type: initialType } = useLocalSearchParams<{ type: string }>();
  const preferredLanguages = getPreferredLanguages();
  const [language, setLanguage] = useState(preferredLanguages[0]?.toLowerCase() || "hindi");
  const [type, setType] = useState(initialType || "song");

  const { data, isLoading, error, mutate } = useSWR<TrendingItem[]>(
    ["trending_data", { entity_type: type, entity_language: language }],
    apiFetcher,
  );

  if (isLoading) {
    return <LoadingView />;
  }

  if (error) {
    return <TryAgain refresh={mutate} />;
  }

  if (!data) {
    return <Unmatched />;
  }

  return (
    <YStack flex={1} bg="background" px="3" pt="2">
      {preferredLanguages.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0 }}
          mb="1-5"
        >
          <ToggleGroup
            type="single"
            value={language}
            onValueChange={(selectedLanguage) => selectedLanguage && setLanguage(selectedLanguage)}
            orientation="horizontal"
            flexDirection="row"
            gap="1-5"
            disableDeactivation
          >
            {preferredLanguages.map((lang) => {
              const isSelected = language === lang.toLowerCase();
              return (
                <ToggleGroup.Item
                  key={lang}
                  value={lang.toLowerCase()}
                  w="auto"
                  h="auto"
                  shrink={0}
                  rounded="full"
                  px="3"
                  py="1-5"
                  bg={isSelected ? "accent-background" : "color-3"}
                  borderColor={isSelected ? "accent-background" : "border-color"}
                  borderWidth={1}
                  scale="press:0.96"
                >
                  <SizableText
                    size="1"
                    fontWeight={isSelected ? "600" : "500"}
                    color={isSelected ? "white" : "color-9"}
                    numberOfLines={1}
                  >
                    {lang}
                  </SizableText>
                </ToggleGroup.Item>
              );
            })}
          </ToggleGroup>
        </ScrollView>
      )}
      <Separator my="1-5" />
      <Tabs value={type} onValueChange={setType} flex={1} flexDirection="column">
        <Tabs.List w="100%" mb="2" gap="1-5">
          {["Song", "Album", "Playlist"].map((tabName) => {
            const tabValue = tabName.toLowerCase();
            const isSelected = type === tabValue;
            return (
              <Tabs.Tab
                key={tabName}
                value={tabValue}
                flex={1}
                size="sm"
                rounded="xl"
                py="2"
                bg={isSelected ? "accent-background" : "color-3"}
                borderColor={isSelected ? "accent-background" : "border-color"}
                borderWidth={1}
                opacity="press:0.85"
                items="center"
                justify="center"
              >
                <SizableText
                  size="2"
                  fontWeight={isSelected ? "700" : "500"}
                  color={isSelected ? "white" : "color-9"}
                >
                  {tabName + "s"}
                </SizableText>
              </Tabs.Tab>
            );
          })}
        </Tabs.List>

        {["Song", "Album", "Playlist"].map((tabName) => (
          <Tabs.Content key={tabName} value={tabName.toLowerCase()} flex={1}>
            <GridView>
              {data?.map((item) => (
                <MediaCard
                  key={item.id}
                  title={item.title}
                  subtitle={item.subtitle}
                  image={item.image}
                  perma_url={item.perma_url}
                />
              ))}
            </GridView>
          </Tabs.Content>
        ))}
      </Tabs>
    </YStack>
  );
}
