import type { ArtistOverviewResponse } from "src/models";

import { Unmatched, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList } from "react-native";
import {
  FilterBar,
  type FilterOption,
  HeroBanner,
  LoadingView,
  MediaListItem,
  TryAgain,
} from "src/ui";
import { apiFetcher, prettifyNumber, toCapitalize } from "src/utils";
import useSWRInfinite from "swr/infinite";
import { Separator, SizableText, Spinner, XStack, YStack } from "tamagui";

export default function ArtistSongsPage() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const [category, setCategory] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const getKey = (pageIndex: number, previousPageData: ArtistOverviewResponse | null) => {
    if (previousPageData && previousPageData.topSongs?.length === 0) {
      return null;
    }
    return [
      "artist_overview",
      {
        token,
        p: pageIndex + 1,
        n_song: 20,
        n_album: 0,
        sub_type: "songs",
        more: true,
        category,
        sort_order: sortOrder,
      },
    ];
  };

  const { data, error, isLoading, isValidating, size, setSize, mutate } =
    useSWRInfinite<ArtistOverviewResponse>(getKey, apiFetcher);

  const handleFilterPress = (option: FilterOption) => {
    if (category === option.value) {
      if (option.canSort) {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      }
    } else {
      setCategory(option.value);
      setSortOrder(option.defaultOrder);
    }
  };

  const results = data?.flatMap((page) => page?.topSongs ?? []) ?? [];
  const artist = data?.[0];

  const renderItem = ({
    item,
    index,
  }: {
    item: ArtistOverviewResponse["topSongs"][number];
    index: number;
  }) => <MediaListItem {...item} trackNumber={index + 1} />;

  if (isLoading) {
    return <LoadingView />;
  }

  if (error) {
    return <TryAgain refresh={mutate} />;
  }

  if (!data || !artist) {
    return <Unmatched />;
  }

  return (
    <YStack flex={1} px="3" bg="background">
      <HeroBanner
        id={artist.artistId}
        title={artist.name}
        subtitle={artist.dominantType}
        type="artist"
        image={artist.image}
        showImage={false}
        songs={results}
        perma_url={artist.urls.songs}
      >
        <XStack items="center" gap="1-5">
          <SizableText fontSize={13} color="color-9" fontWeight="500">
            {toCapitalize(artist.dominantType)}
          </SizableText>
          <Separator vertical h={10} borderColor="border-color" />
          <SizableText fontSize={13} color="color-9" fontWeight="500">
            {prettifyNumber(Number(artist.fan_count))} Listeners
          </SizableText>
        </XStack>
      </HeroBanner>
      <Separator my="3" borderColor="border-color" />
      <FilterBar category={category} sortOrder={sortOrder} onSelectOption={handleFilterPress} />
      <FlatList
        data={results}
        keyExtractor={(item, index) => `${item.id}_${index}`}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        onEndReached={() => setSize(size + 1)}
        onEndReachedThreshold={0.5}
        initialNumToRender={12}
        maxToRenderPerBatch={10}
        windowSize={7}
        removeClippedSubviews
        ListFooterComponent={
          isValidating && results.length > 0 ? (
            <YStack items="center" py="3">
              <Spinner size="large" color="accent-background" />
            </YStack>
          ) : undefined
        }
      />
    </YStack>
  );
}
