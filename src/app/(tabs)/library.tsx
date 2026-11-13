import type { FavouriteItem } from "src/models";

import { useState } from "react";
import { toggleFavourite, useFavourites } from "src/db";
import {
  Heart as HeartIcon,
  LayoutGrid as GridIcon,
  List as ListIcon,
  Search as SearchIcon,
  X as ClearIcon,
} from "src/icons";
import { GridView, LoadingView, MediaCard, MediaListItem } from "src/ui";
import { groupBy, toCapitalize } from "src/utils";
import {
  Button,
  H4,
  Input,
  Paragraph,
  ScrollView,
  Separator,
  SizableText,
  Tabs,
  XStack,
  YStack,
} from "tamagui";

const FAVOURITE_TABS = ["song", "album", "playlist", "artist"] as const;
type FavouriteTab = (typeof FAVOURITE_TABS)[number];

export default function LibraryPage() {
  const [currentTab, setCurrentTab] = useState<FavouriteTab>("song");
  const [searchQuery, setSearchQuery] = useState("");
  const [isGridView, setIsGridView] = useState(false);
  const { items, isLoading } = useFavourites();
  const data = groupBy(items, (item: FavouriteItem) => item.type);

  if (isLoading) {
    return <LoadingView />;
  }

  return (
    <YStack flex={1} bg="background" px="3" pt="2">
      <XStack items="center" gap="2" mb="2">
        <XStack flex={1} items="center" bg="color-3" rounded="xl" px="2-5" py="1" gap="2">
          <SearchIcon size={15} color="color-9" />
          <Input
            flex={1}
            rounded="xl"
            placeholderTextColor="placeholder-color"
            size="sm"
            borderWidth={0}
            bg="transparent"
            color="color"
            placeholder={`Search ${currentTab}s in library...`}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {Boolean(searchQuery) && (
            <Button
              variant="quiet"
              circular
              size="sm"
              color="color-10"
              opacity="hover:0.8"
              icon={ClearIcon}
              onPress={() => setSearchQuery("")}
            />
          )}
        </XStack>

        <Button
          size="sm"
          color="color-10"
          bg="hover:color-3"
          scale="press:0.92"
          circular
          variant="quiet"
          icon={isGridView ? <ListIcon size={24} /> : <GridIcon size={24} />}
          onPress={() => setIsGridView((prev) => !prev)}
        />
      </XStack>

      <Tabs
        value={currentTab}
        onValueChange={(val) => setCurrentTab(val as FavouriteTab)}
        orientation="horizontal"
        flexDirection="column"
        flex={1}
        borderColor="border-color"
      >
        <Tabs.List justify="space-around" bg="background" gap="1-5">
          {FAVOURITE_TABS.map((tab) => {
            const count = (data[tab] || []).length;
            const isSelected = currentTab === tab;
            return (
              <Tabs.Tab
                key={tab}
                value={tab}
                size="sm"
                rounded="full"
                px="3"
                bg={
                  isSelected ? "accent-background hover:accent-background" : "color-3 hover:color-4"
                }
                borderColor={isSelected ? "accent-background" : "border-color"}
                borderWidth={1}
                opacity="press:0.85"
              >
                <SizableText
                  size="1"
                  fontWeight={isSelected ? "700" : "500"}
                  color={isSelected ? "white" : "color"}
                >
                  {toCapitalize(tab) + "s" + (count > 0 ? ` (${count})` : "")}
                </SizableText>
              </Tabs.Tab>
            );
          })}
        </Tabs.List>

        <Separator my="1-5" />

        {FAVOURITE_TABS.map((type) => {
          const typeItems = data[type] || [];
          const filteredItems = searchQuery.trim()
            ? typeItems.filter((item) => {
                const query = searchQuery.toLowerCase();
                return (
                  item.title?.toLowerCase().includes(query) ||
                  item.subtitle?.toLowerCase().includes(query)
                );
              })
            : typeItems;

          return (
            <Tabs.Content key={type} value={type} flex={1}>
              {filteredItems.length > 0 ? (
                isGridView ? (
                  <GridView>
                    {filteredItems.map((item) => (
                      <MediaCard
                        key={item.id}
                        title={item.title}
                        subtitle={item.subtitle}
                        image={item.image}
                        perma_url={item.perma_url}
                        circle={type === "artist"}
                      />
                    ))}
                  </GridView>
                ) : (
                  <ScrollView
                    flex={1}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 120 }}
                  >
                    <YStack>
                      {filteredItems.map((item, index) => (
                        <MediaListItem
                          key={item.id}
                          {...item}
                          trackNumber={index + 1}
                          iconAfterOverride=<Button
                            variant="quiet"
                            circular
                            size="sm"
                            bg="hover:color-4"
                            scale="press:0.9"
                            icon=<HeartIcon
                              size={18}
                              color="accent-background"
                              fill="accent-background"
                            />
                            onPress={(e) => {
                              e.stopPropagation();
                              toggleFavourite(item);
                            }}
                          />
                        />
                      ))}
                    </YStack>
                  </ScrollView>
                )
              ) : (
                <YStack flex={1} items="center" justify="center" p="4" gap="2">
                  <HeartIcon size={36} color="color-9" />
                  <H4 fontSize={16} fontWeight="700" letterSpacing={-0.2} color="color">
                    {searchQuery ? "No matches found" : `No favourite ${type}s`}
                  </H4>
                  <Paragraph fontSize={14} color="color-10" text="center">
                    {searchQuery
                      ? `No ${type}s matching "${searchQuery}"`
                      : `No favourite ${type}s added yet`}
                  </Paragraph>
                </YStack>
              )}
            </Tabs.Content>
          );
        })}
      </Tabs>
    </YStack>
  );
}
