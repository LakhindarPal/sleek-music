import { baseUrl, defaultParams, sources } from "src/consts/jiosaavn";
import { randomUA } from "src/consts/user-agents";

import type { APIEndpoints } from "../models";

import { getLanguagesParam } from "./preference-store";

export async function apiFetcher<K extends keyof APIEndpoints>(
  args: [endpoint: K, params?: Record<string, unknown> | undefined],
): Promise<APIEndpoints[K]>;
export async function apiFetcher<T>(
  args: [endpoint: string, params?: Record<string, unknown> | undefined],
): Promise<T>;
export async function apiFetcher<T = unknown>([endpoint, params]: [
  endpoint: string,
  params?: Record<string, unknown> | undefined,
]): Promise<T> {
  const sourceParam = sources[endpoint];
  if (!sourceParam) {
    throw new Error(`Unknown API endpoint: ${endpoint}`);
  }

  const url = new URL(baseUrl);
  const query = new URLSearchParams(sourceParam);

  for (const [k, v] of Object.entries(defaultParams)) {
    if (!query.has(k)) {
      query.set(k, String(v));
    }
  }

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v != null) {
        query.set(k, String(v));
      }
    }
  }

  url.search = query.toString();

  const languages = getLanguagesParam();
  const Cookie = `DL=english; L=${encodeURIComponent(languages)}`;

  const resp = await fetch(url.toString(), {
    headers: {
      accept: "application/json, text/plain, */*",
      "User-Agent": randomUA(),
      Cookie,
    },
  });

  if (!resp.ok) {
    throw new Error(`API request failed with status: ${resp.status}`);
  }

  return (await resp.json()) as T;
}
