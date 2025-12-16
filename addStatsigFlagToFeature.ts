import { getGlobalFeatureRepo } from "./lib/features/globalRepo";
import type { StatsigFlagRef } from "./lib/features/types";

// Dev repro script to append a Statsig flag to a feature.
// Run with: bun addStatsigFlagToFeature.ts

const targetFeatureId = "sleep-logging";

const newFlag: StatsigFlagRef = {
  name: "web_dev_test",
  isExperiment: true,
  isFeatureGate: false,
  url: "https://console.statsig.com/0JEh0qdbLTd3W81GsLZa4/experiments/web_dev_test/results",
};

const repo = await getGlobalFeatureRepo();
const feature = await repo.addStatsigFlag(targetFeatureId, newFlag);

if (!feature) {
  console.error(`Feature with id '${targetFeatureId}' not found.`);
  process.exitCode = 1;
} else {
  console.log(`Added Statsig flag ${newFlag.name} to feature ${feature.title}`);
  console.log("Updated flags:", feature.statsigFlags.map((f) => f.name));
}
