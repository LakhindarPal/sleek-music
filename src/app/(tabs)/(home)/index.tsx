import type { LaunchDataResponse } from "src/models";

import { Unmatched } from "expo-router";
import { ContentRails, LoadingView, MoreLink, TryAgain } from "src/ui";
import { groupBy, apiFetcher, usePreferenceStore } from "src/utils";
import useSWR from "swr";
import { ScrollView } from "tamagui";

export default function ExplorePage() {
  const { languages } = usePreferenceStore();
  const { data, error, isLoading, mutate } = useSWR<LaunchDataResponse>(
    ["launch_data", { languages }],
    apiFetcher,
  );
  const trending = groupBy(data?.new_trending, (item) => item.type);
  const latest = groupBy(data?.new_albums, (item) => item.type);

  if (isLoading) {
    return <LoadingView />;
  }

  if (error) {
    return <TryAgain refresh={mutate} />;
  }

  if (!data) {
    return <Unmatched />;
  }

  const contents = [
    {
      id: "trending-songs",
      more: <MoreLink path="/trending?type=song" />,
      heading: "Trending Songs",
      items: trending.song,
    },
    {
      id: "trending-albums",
      more: <MoreLink path="/trending?type=album" />,
      heading: "Trending Albums",
      items: trending.album,
    },
    {
      id: "trending-playlists",
      more: <MoreLink path="/trending?type=playlist" />,
      heading: "Trending Playlists",
      items: trending.playlist,
    },
    {
      id: "editorial-picks",
      more: <MoreLink path="/featured" />,
      heading: "Editorial Picks",
      items: data?.top_playlists,
    },
    {
      id: "latest-songs",
      more: <MoreLink path="/latest?type=song" />,
      heading: "Latest Songs",
      items: latest.song,
    },
    {
      id: "latest-albums",
      more: <MoreLink path="/latest?type=album" />,
      heading: "Latest Albums",
      items: latest.album,
    },
    {
      id: "top-charts",
      heading: "Top Charts",
      items: data?.charts,
    },
    {
      id: "spotlight-artists",
      heading: "Spotlight Artists",
      items: data?.artist_recos,
    },
    {
      id: "mood-mixes",
      heading: "Mood Mixes",
      items: data?.tag_mixes,
    },
  ];

  return (
    <ScrollView
      px="3"
      bg="background"
      contentContainerStyle={{ paddingBottom: 120, paddingTop: 4 }}
      showsVerticalScrollIndicator={false}
    >
      <ContentRails data={contents} />
    </ScrollView>
  );
}
