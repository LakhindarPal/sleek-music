import type { Language, Quality } from "src/models";

import Storage from "expo-sqlite/kv-store";
import { useSyncExternalStore } from "react";
import QUALITIES from "src/consts/qualities";

export function getPreferredLanguages(): Language[] {
  const stored = Storage.getItemSync("preferred_languages");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as Language[];
      }
    } catch (e) {
      console.error("Failed to parse preferred_languages", e);
    }
  }
  return ["Hindi", "English"];
}

export function getLanguagesParam(): string {
  return getPreferredLanguages()
    .map((l) => l.toLowerCase())
    .join(",");
}

export function getPreferredQuality(): Quality {
  const stored = Storage.getItemSync("preferred_quality");
  if (stored && (QUALITIES as readonly string[]).includes(stored)) {
    return stored as Quality;
  }
  return "_320";
}

function getPreferredAutoplay(): boolean {
  const stored = Storage.getItemSync("preferred_autoplay");
  return stored !== "false";
}

type PreferenceState = {
  theme: string;
  quality: Quality;
  languages: (Language | string)[];
  autoplay: boolean;
};

let state: PreferenceState = {
  theme: Storage.getItemSync("preferred_theme") || "Auto",
  quality: getPreferredQuality(),
  languages: getPreferredLanguages(),
  autoplay: getPreferredAutoplay(),
};

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

export const preferenceStore = {
  getQuality: () => state.quality,
  getAutoplay: () => state.autoplay,
  getTheme: () => state.theme,
  getLanguages: () => state.languages,
  setTheme: (theme: string) => {
    Storage.setItemSync("preferred_theme", theme);
    state = { ...state, theme };
    listeners.forEach((l) => l());
  },
  setQuality: (quality: Quality | string) => {
    const validQuality = (QUALITIES as readonly string[]).includes(quality)
      ? (quality as Quality)
      : "_320";
    Storage.setItemSync("preferred_quality", validQuality);
    state = { ...state, quality: validQuality };
    listeners.forEach((l) => l());
  },
  setLanguages: (languages: (Language | string)[]) => {
    Storage.setItemSync("preferred_languages", JSON.stringify(languages));
    state = { ...state, languages };
    listeners.forEach((l) => l());
  },
  setAutoplay: (autoplay: boolean) => {
    Storage.setItemSync("preferred_autoplay", String(autoplay));
    state = { ...state, autoplay };
    listeners.forEach((l) => l());
  },
};

export function usePreferenceStore() {
  const current = useSyncExternalStore(subscribe, getSnapshot);
  return { ...current, ...preferenceStore };
}
