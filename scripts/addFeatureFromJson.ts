#!/usr/bin/env bun

/**
 * Dev helper to append a new Feature entry from a JSON payload to the persisted feature store.
 *
 * Usage examples:
 * bun scripts/addFeatureFromJson.ts --json='{"id":"new-feature","title":"New Feature","description":"Short summary","webUrl":"https://example.com","owner":"Alice","team":"Platform","pillar":"Pillar 1","status":"in_progress"}'
 *
 * cat payload.json | bun scripts/addFeatureFromJson.ts
 *
 * Optional args:
 *   --file=path/to/payload.json  (reads JSON from file)
 * Payload shape:
 * {
 *   id: string,
 *   title: string,
 *   description: string,
 *   webUrl: string,
 *   owner: string,
 *   team: string,
 *   pillar: "Pillar 0" | "Pillar 1" | "Pillar 2" | "Pillar Growth",
 *   status?: "in_progress" | "released" (default in_progress),
 *   dateCreated?: string (YYYY-MM-DD, defaults to today),
 *   dateReleased?: string,
 *   statsigFlags?: { name: string; isExperiment: boolean; isFeatureGate: boolean; url?: string }[]
 * }
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getGlobalFeatureRepo } from "../lib/features/globalRepo";
import type { Feature, Pillar, StatsigFlagRef, Team } from "../lib/features/types";

type Payload = {
  id: string;
  title: string;
  description: string;
  webUrl: string;
  owner: string;
  team: Team;
  pillar: Pillar;
  status?: "in_progress" | "released";
  dateCreated?: string;
  dateReleased?: string;
  statsigFlags?: StatsigFlagRef[];
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const dataPath = path.join(projectRoot, "data", "features.json");

const argPairs = process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/, "").split("=");
  return [key, rest.join("=")] as const;
});
const args = Object.fromEntries(argPairs);

const readPayload = (): Payload => {
  if (args.json) {
    return JSON.parse(args.json as string);
  }
  if (args.file) {
    const fileContent = fs.readFileSync(args.file as string, "utf8");
    return JSON.parse(fileContent);
  }
  const stdin = fs.readFileSync(0, "utf8").trim();
  if (!stdin) {
    console.error("No JSON payload provided. Use --json, --file, or pipe JSON via stdin.");
    process.exit(1);
  }
  return JSON.parse(stdin);
};

const payload = readPayload();

const pillarSet: Pillar[] = ["Pillar 0", "Pillar 1", "Pillar 2", "Pillar Growth"];
if (!pillarSet.includes(payload.pillar)) {
  console.error(`Invalid pillar '${payload.pillar}'. Must be one of: ${pillarSet.join(", ")}`);
  process.exit(1);
}

const status = payload.status ?? "in_progress";
if (status !== "in_progress" && status !== "released") {
  console.error("Status must be 'in_progress' or 'released'");
  process.exit(1);
}

const dateCreated =
  payload.dateCreated ??
  new Date().toLocaleDateString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
const dateReleased = payload.dateReleased;
const statsigFlags: StatsigFlagRef[] = payload.statsigFlags ?? [];

const repo = await getGlobalFeatureRepo();

if (await repo.getById(payload.id)) {
  console.error(`Feature with id '${payload.id}' already exists. Choose a unique id.`);
  process.exit(1);
}

const feature: Feature = {
  id: payload.id,
  title: payload.title,
  description: payload.description,
  webUrl: payload.webUrl,
  statsigFlags,
  dateCreated,
  dateReleased: dateReleased || undefined,
  owner: payload.owner,
  team: payload.team,
  status,
  pillar: payload.pillar,
};

await repo.add(feature);

console.log(
  `Added feature '${payload.title}' (id: ${payload.id}) to ${path.relative(projectRoot, dataPath)}`,
);
console.log("Statsig flags kept from payload (or empty if none provided).");
