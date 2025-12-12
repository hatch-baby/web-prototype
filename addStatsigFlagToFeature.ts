import { featureRepo } from "@/lib/features/repo";
import type { StatsigFlagRef } from "@/lib/features/types";

// Dev repro script to append a Statsig flag to a feature.
// Run with: bun addStatsigFlagToFeature.ts

const targetFeatureId = "sleep-logging";

const newFlag: StatsigFlagRef = {
  name: "web_dev_test",
  isExperiment: true,
  isFeatureGate: false,
  url: "https://console.statsig.com/0JEh0qdbLTd3W81GsLZa4/experiments/web_dev_test/results",
};

const feature = featureRepo.addStatsigFlag(targetFeatureId, newFlag);

if (feature) {
  console.log(`Added Statsig flag ${newFlag.name} to feature ${feature.title}`);
  console.log("Updated flags:", feature.statsigFlags.map((f) => f.name));
} else {
  console.error(`Feature with id '${targetFeatureId}' not found.`);
  process.exitCode = 1;
}
