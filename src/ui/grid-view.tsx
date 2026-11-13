import type { ReactNode } from "react";

import { ScrollView, XStack } from "tamagui";

export function GridView({ children }: { children: ReactNode }) {
  return (
    <ScrollView flex={1} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator>
      <XStack flexWrap="wrap" justify="center" gap="3" pb="16" pt="1-5">
        {children}
      </XStack>
    </ScrollView>
  );
}
