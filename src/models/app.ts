import type { MediaItem } from "@rntp/player";

export interface PlayerTrack extends MediaItem {
  mediaId: string;
  extras: {
    saavnId: string;
    permaUrl: string;
    language: string;
    releaseDate: string;
    isExplicit: boolean;
    hasLyrics: boolean;
  };
}

export interface FavouriteItem {
  id: string;
  title: string;
  subtitle?: string | null;
  perma_url: string;
  type: "song" | "album" | "playlist" | "artist" | "mix";
  image?: string | null;
}
