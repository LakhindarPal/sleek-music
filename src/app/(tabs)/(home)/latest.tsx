import type { LatestDataResponse } from "src/models";

import { Unmatched, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { GridView, LoadingView, MediaCard, TryAgain } from "src/ui";
import { apiFetcher, getLanguagesParam, groupBy, toCapitalize } from "src/utils";
import useSWR from "swr";
import { Separator, SizableText, Tabs, YStack } from "tamagui";

export default function LatestReleasesPage() {
  const { type: initialType } = useLocalSearchParams<{ type: string }>();
  const [currentTab, setCurrentTab] = useState(initialType || "song");
  const params = { languages: getLanguagesParam() };
  const {
    data: latestResponse,
    isLoading,
    error,
    mutate,
  } = useSWR<LatestDataResponse>(["latest_data", params], apiFetcher);
  const data = groupBy(latestResponse?.data, (item) => item.type);

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
      <Tabs
        value={currentTab}
        onValueChange={setCurrentTab}
        orientation="horizontal"
        flexDirection="column"
        flex={1}
      >
        <Tabs.List w="100%" mb="2" gap="1-5">
          {["song", "album"].map((tabName) => {
            const isSelected = currentTab === tabName;
            return (
              <Tabs.Tab
                key={tabName}
                value={tabName}
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
                  {toCapitalize(tabName) + "s"}
                </SizableText>
              </Tabs.Tab>
            );
          })}
        </Tabs.List>
        <Separator my="1-5" />
        {["song", "album"].map((type) => {
          const items = data[type] || [];
          return (
            <Tabs.Content key={type} value={type} flex={1}>
              {items.length > 0 ? (
                <GridView>
                  {items.map((item) => (
                    <MediaCard
                      key={item.id}
                      title={item.title}
                      subtitle={item.subtitle}
                      image={item.image}
                      perma_url={item.perma_url}
                    />
                  ))}
                </GridView>
              ) : (
                <YStack flex={1} items="center" justify="center" p="4">
                  <SizableText color="color-9">No latest {type}s found</SizableText>
                </YStack>
              )}
            </Tabs.Content>
          );
        })}
      </Tabs>
    </YStack>
  );
}
