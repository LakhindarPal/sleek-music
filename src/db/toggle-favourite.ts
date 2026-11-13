import type { FavouriteItem } from "src/models";

import { eq } from "drizzle-orm";
import { toast } from "tamagui";

import { db } from "./client";
import { favourites, type MediaType } from "./schema";

export async function toggleFavourite(item: FavouriteItem): Promise<boolean> {
  const { id, title, subtitle, type, perma_url, image } = item;

  const [existing] = await db
    .select({ id: favourites.id })
    .from(favourites)
    .where(eq(favourites.id, id))
    .limit(1);

  if (existing) {
    await db.delete(favourites).where(eq(favourites.id, id));

    toast.error("Removed from library.");

    return false;
  } else {
    await db.insert(favourites).values({
      id,
      title,
      subtitle: subtitle ?? null,
      type: type as MediaType,
      perma_url,
      image: image ?? null,
    });

    toast.success("Added to library.");

    return true;
  }
}
