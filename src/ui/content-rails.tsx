import type { ReactNode } from "react";

import { H3, ScrollView, XStack, YStack } from "tamagui";

import { MediaCard } from "./media-card";

export interface MediaRailItem {
  id?: string;
  title?: string;
  name?: string;
  subtitle?: string;
  description?: string | null;
  image?: string | null;
  perma_url?: string;
  circle?: boolean;
}

export interface RailData {
  id: string;
  more?: ReactNode;
  heading: string;
  items: MediaRailItem[] | undefined;
}

export function ContentRails({ data }: { data: RailData[] }) {
  return data
    .filter((section) => !!section.items?.length)
    .map(({ id, heading, items, more: moreLinkElement }) => (
      <YStack py="3" key={id}>
        <XStack items="center" justify="space-between" mb="2-5" pr="1">
          <H3 fontSize={20} fontWeight="700" letterSpacing={-0.3}>
            {heading}
          </H3>
          {moreLinkElement}
        </XStack>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <XStack gap="3" pr="3">
            {items?.map((item, index) => (
              <MediaCard
                key={item.id || index}
                title={item.title || item.name || ""}
                subtitle={item.subtitle || item.description || undefined}
                image={item.image || ""}
                perma_url={item.perma_url || ""}
                circle={item.circle}
              />
            ))}
          </XStack>
        </ScrollView>
      </YStack>
    ));
}
