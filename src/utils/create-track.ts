import type { PlayerTrack, Song } from "src/models";
import type { MediaListItemData } from "src/ui/media-list-item";

import { decodeHTML } from "entities";

import { decryptMedia } from "./decrypt-media";
import { getPreferredQuality } from "./preference-store";

export function createTrack(song: Song | MediaListItemData): PlayerTrack {
  const decrypted = decryptMedia(song.more_info?.encrypted_media_url ?? "");
  const qualityId = getPreferredQuality();
  const mediaUrl = decrypted
    ? decrypted.replace(/_(?:320|160|96|48|12)(?=\.[a-zA-Z0-9]+$)/, qualityId) ||
      decrypted.replace("_96", qualityId)
    : "";

  return {
    mediaId: song.id + Date.now(),
    title: decodeHTML(song.title ?? ""),
    artist: decodeHTML(song.subtitle ?? ""),
    artworkUrl: song.image
      ? song.image.replace(/(?:50|150)x(?:50|150)\.jpg/g, "500x500.jpg")
      : undefined,
    url: mediaUrl,
    albumTitle: decodeHTML(song.more_info?.album ?? ""),
    duration: Number(song.more_info?.duration ?? 0),
    extras: {
      saavnId: song.id,
      permaUrl: song.perma_url,
      language: song.language ?? "",
      releaseDate: (song.more_info?.release_date ?? "") + "T00:00:00+05:30",
      isExplicit: Boolean(song.explicit_content === "1"),
      hasLyrics: Boolean(song.more_info?.has_lyrics === "true"),
    },
  };
}
