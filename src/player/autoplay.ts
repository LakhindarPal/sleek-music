import type { PlayerTrack } from "src/models";

import TrackPlayer from "@rntp/player";
import { apiFetcher, createTrack, extractRadioSongs, preferenceStore } from "src/utils";

let autoplayInFlight = false;
export async function handleAutoplayNext() {
  if (!preferenceStore.getAutoplay()) {
    return;
  }
  if (autoplayInFlight) {
    return;
  }
  try {
    autoplayInFlight = true;
    const queue = TrackPlayer.getQueue();
    if (!queue || queue.length === 0) {
      return;
    }

    const existingLength = queue.length;
    const saavnIds = queue
      .map((item) => (item as PlayerTrack).extras?.saavnId)
      .filter((id): id is string => Boolean(id));
    const seedIds = saavnIds.slice(-5);

    const stationResponse = await apiFetcher([
      "entity_station",
      {
        entity_id: JSON.stringify(seedIds),
      },
    ]);

    const stationId = stationResponse?.stationid;
    if (!stationId) {
      return;
    }

    const radioResponse = await apiFetcher([
      "radio_songs",
      {
        stationid: stationId,
        k: 5,
        next: 1,
      },
    ]);

    const songs = extractRadioSongs(radioResponse);
    if (!songs || songs.length === 0) {
      return;
    }

    const existingIds = new Set(saavnIds);
    const uniqueSongs = songs.filter((song) => !existingIds.has(song.id));

    if (uniqueSongs.length === 0) {
      return;
    }

    const newTracks = uniqueSongs.map(createTrack);
    TrackPlayer.addMediaItems(newTracks);

    TrackPlayer.skipToIndex(existingLength);
  } catch (error) {
    console.error("Autoplay radio error:", error);
  } finally {
    autoplayInFlight = false;
  }
}
