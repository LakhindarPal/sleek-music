import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

import * as schema from "./schema";

export const DATABASE_NAME = "sleek-music.db";

export const expoDb = openDatabaseSync(DATABASE_NAME, { enableChangeListener: true });

export const db = drizzle(expoDb, { schema });

export type AppDatabase = typeof db;
