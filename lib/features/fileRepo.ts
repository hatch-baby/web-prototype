import { promises as fs } from "fs";
import path from "path";
import type { Feature } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "features.json");

export async function loadFeatures(): Promise<Feature[]> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    return JSON.parse(raw) as Feature[];
  } catch {
    return [];
  }
}

export async function saveFeatures(features: Feature[]): Promise<void> {
  const dir = path.dirname(DATA_PATH);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(features, null, 2), "utf8");
}
