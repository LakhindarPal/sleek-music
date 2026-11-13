import type { ArtistBase } from "src/models";

import defaultArtistImage from "assets/images/default-artist.png";

import { toCapitalize } from "./to-capitalize";

export function dedupArtists(artists: ArtistBase[]): ArtistBase[] {
  const artistMap = new Map<string, ArtistBase>();

  for (const artist of artists) {
    const existing = artistMap.get(artist.id);
    if (existing) {
      const existingRoles = existing.role ? existing.role.split(", ") : [];
      const newRole = toCapitalize(artist.role);
      const combinedRoles = new Set(existingRoles);
      if (newRole) {
        combinedRoles.add(newRole);
      }
      existing.role = Array.from(combinedRoles).filter(Boolean).join(", ");
    } else {
      artistMap.set(artist.id, {
        ...artist,
        role: toCapitalize(artist.role),
        image: artist.image ?? defaultArtistImage,
      });
    }
  }

  return Array.from(artistMap.values());
}
