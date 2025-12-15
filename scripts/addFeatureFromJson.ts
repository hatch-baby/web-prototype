#!/usr/bin/env bun

/**
 * Dev helper to append a new Feature entry from a JSON payload to lib/features/data.ts.
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
import type { Pillar, StatsigFlagRef } from "../lib/features/types";

type Payload = {
  id: string;
  title: string;
  description: string;
  webUrl: string;
  owner: string;
  team: string;
  pillar: Pillar;
  status?: "in_progress" | "released";
  dateCreated?: string;
  dateReleased?: string;
  statsigFlags?: StatsigFlagRef[];
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const dataPath = path.join(projectRoot, "lib", "features", "data.ts");

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

const dataFile = fs.readFileSync(dataPath, "utf8");
if (dataFile.includes(`id: "${payload.id}"`)) {
  console.error(`Feature with id '${payload.id}' already exists in data.ts. Choose a unique id.`);
  process.exit(1);
}

const flagsString =
  statsigFlags.length === 0
    ? ""
    : statsigFlags
        .map(
          (f) =>
            `      {
        name: "${f.name}",
        isExperiment: ${f.isExperiment},
        isFeatureGate: ${f.isFeatureGate},${
              f.url ? `\n        url: "${f.url}",` : ""
            }
      }`,
        )
        .join(",\n");

const featureBlock = `  {
    id: "${payload.id}",
    title: "${payload.title}",
    description:
      "${payload.description}",
    webUrl: "${payload.webUrl}",
    statsigFlags: [${
      statsigFlags.length === 0 ? "" : `\n${flagsString}\n    `
    }],
    dateCreated: "${dateCreated}",
    ${dateReleased ? `dateReleased: "${dateReleased}",\n    ` : ""}owner: "${payload.owner}",
    team: "${payload.team}",
    status: "${status}",
    pillar: "${payload.pillar}",
  },
`;

const insertPos = dataFile.lastIndexOf("];");
if (insertPos === -1) {
  console.error("Could not find feature array terminator in data.ts");
  process.exit(1);
}

const updated = `${dataFile.slice(0, insertPos)}${featureBlock}${dataFile.slice(insertPos)}`;
fs.writeFileSync(dataPath, updated);

console.log(
  `Added feature '${payload.title}' (id: ${payload.id}) to ${path.relative(projectRoot, dataPath)}`,
);
console.log("Statsig flags kept from payload (or empty if none provided).");
