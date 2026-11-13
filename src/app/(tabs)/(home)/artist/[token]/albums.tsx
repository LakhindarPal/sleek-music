import type { ArtistOverviewResponse } from "src/models";

import { Unmatched, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList } from "react-native";
import { FilterBar, type FilterOption, HeroBanner, LoadingView, MediaCard, TryAgain } from "src/ui";
import { apiFetcher, prettifyNumber, toCapitalize } from "src/utils";
import useSWRInfinite from "swr/infinite";
import { Separator, SizableText, Spinner, XStack, YStack } from "tamagui";

export default function ArtistAlbumsPage() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const [category, setCategory] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const getKey = (pageIndex: number, previousPageData: ArtistOverviewResponse | null) => {
    if (previousPageData && !previousPageData.topAlbums?.length) {
      return null;
    }
    return [
      "artist_overview",
      {
        token,
        p: pageIndex + 1,
        n_song: 0,
        n_album: 20,
        sub_type: "albums",
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

  const results = data?.flatMap((page) => page?.topAlbums ?? []) ?? [];
  const artist = data?.[0];

  const renderItem = ({ item: album }: { item: ArtistOverviewResponse["topAlbums"][number] }) => (
    <MediaCard
      title={album.title}
      subtitle={album.subtitle}
      image={album.image}
      perma_url={album.perma_url}
    />
  );

  if (isLoading) {
    return <LoadingView />;
  }

  if (error) {
    return <TryAgain refresh={mutate} />;
  }

  if (!artist) {
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
        perma_url={artist.urls.albums}
        songs={[]}
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
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-around",
          gap: 12,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={renderItem}
        onEndReached={() => setSize(size + 1)}
        onEndReachedThreshold={0.5}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
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
