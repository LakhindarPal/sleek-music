import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const MEDIA_TYPES = ["song", "album", "artist", "playlist", "mix"] as const;
export type MediaType = (typeof MEDIA_TYPES)[number];

export const favourites = sqliteTable(
  "favourites",
  {
    id: text("id").primaryKey().notNull(),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    type: text("type", { enum: MEDIA_TYPES }).notNull(),
    perma_url: text("perma_url").notNull(),
    image: text("image"),
  },
  (table) => [index("idx_media_type").on(table.type)],
);

export type Favourite = typeof favourites.$inferSelect;
export type NewFavourite = typeof favourites.$inferInsert;
