import type { Feature } from "./types";
import { head, put } from "@vercel/blob";

const BLOB_KEY = process.env.FEATURES_BLOB_KEY ?? "features.json";
const hasToken = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export async function loadFeatures(): Promise<Feature[]> {
  if (!hasToken) {
    console.warn("BLOB_READ_WRITE_TOKEN is not set; skipping blob load and returning empty array");
    return [];
  }
  try {
    const meta = await head(BLOB_KEY).catch(() => null);
    if (!meta?.url) {
      return [];
    }
    const res = await fetch(meta.url);
    if (!res.ok) throw new Error(`Failed to fetch blob ${res.status}`);
    const json = (await res.json()) as Feature[];
    return Array.isArray(json) ? json : [];
  } catch (err) {
    console.error("Failed to load features from blob; falling back to seed/empty", err);
    return [];
  }
}

export async function saveFeatures(features: Feature[]): Promise<void> {
  if (!hasToken) {
    console.warn("BLOB_READ_WRITE_TOKEN is not set; skipping blob save");
    return;
  }
  await put(BLOB_KEY, JSON.stringify(features, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}
