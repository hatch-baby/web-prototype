#!/usr/bin/env bun

/**
 * Dev helper to append a new Feature entry to the JSON feature store on disk.
 *
 * Usage:
 * bun scripts/addFeature.ts \
 *   --id=my-feature \
 *   --title="My Feature" \
 *   --description="Short description" \
 *   --webUrl="https://example.com" \
 *   --owner="Alice" \
 *   --team="Platform" \
 *   --pillar="Pillar 1" \
 *   --status=in_progress \
 *   --dateCreated=2024-05-20 \
 *   --dateReleased=2024-06-01
 *
 * Required args: id, title, description, webUrl, owner, team, pillar
 * Optional args: status (in_progress|released, default in_progress),
 *                dateCreated (defaults to today, YYYY-MM-DD),
 *                dateReleased (for released items).
 *
 * Note: statsigFlags are initialized empty; edit the persisted file if you need flags.
 */

import path from "path";
import { fileURLToPath } from "url";
import { getGlobalFeatureRepo } from "../lib/features/globalRepo";
import type { Feature, Pillar, Team } from "../lib/features/types";

type ArgMap = Record<string, string | undefined>;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const dataPath = path.join(projectRoot, "data", "features.json");

const argPairs = process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/, "").split("=");
  return [key, rest.join("=")] as const;
});
const args: ArgMap = Object.fromEntries(argPairs);

const required = (key: string) => {
  const val = args[key];
  if (!val) {
    console.error(`Missing required argument --${key}`);
    process.exit(1);
  }
  return val;
};

const id = required("id");
const title = required("title");
const description = required("description");
const webUrl = required("webUrl");
const owner = required("owner");
const team = required("team") as Team;
const pillar = required("pillar") as Pillar;
const status = (args.status ?? "in_progress") as "in_progress" | "released";
const dateCreated = args.dateCreated ?? new Date().toISOString().slice(0, 10);
const dateReleased = args.dateReleased;

const pillarSet: Pillar[] = ["Pillar 0", "Pillar 1", "Pillar 2", "Pillar Growth"];
if (!pillarSet.includes(pillar)) {
  console.error(`Invalid pillar '${pillar}'. Must be one of: ${pillarSet.join(", ")}`);
  process.exit(1);
}

const repo = await getGlobalFeatureRepo();

if (await repo.getById(id)) {
  console.error(`Feature with id '${id}' already exists. Choose a unique id.`);
  process.exit(1);
}

const feature: Feature = {
  id,
  title,
  description,
  webUrl,
  statsigFlags: [],
  dateCreated,
  dateReleased: dateReleased || undefined,
  owner,
  team,
  status,
  pillar,
};

await repo.add(feature);

console.log(`Added feature '${title}' (id: ${id}) to ${path.relative(projectRoot, dataPath)}`);
console.log("Statsig flags defaulted to empty; update the persisted file if you need flags.");
