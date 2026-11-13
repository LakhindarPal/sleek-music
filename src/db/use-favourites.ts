import type { FavouriteItem } from "src/models";

import { sql } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { db } from "./client";
import { favourites } from "./schema";

export const useFavourites = () => {
  const { data, error, updatedAt } = useLiveQuery(
    db
      .select()
      .from(favourites)
      .orderBy(sql`rowid DESC`),
  );

  const items: FavouriteItem[] = data ?? [];
  const isLoading = updatedAt === undefined && !error;

  return {
    items,
    isLoading,
    error,
    refresh: () => {},
  };
};
