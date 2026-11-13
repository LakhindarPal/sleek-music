import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { db } from "./client";
import { favourites } from "./schema";

export const useIsFavourite = (itemId?: string): boolean => {
  const { data } = useLiveQuery(
    db
      .select({ id: favourites.id })
      .from(favourites)
      .where(eq(favourites.id, itemId ?? "")),
    [itemId],
  );

  if (!itemId) {
    return false;
  }

  return (data?.length ?? 0) > 0;
};
