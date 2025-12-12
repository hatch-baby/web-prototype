import { features as seed } from "./data";
import type { Feature, StatsigFlagRef } from "./types";

export class FeatureRepo {
  private features: Feature[];

  constructor(initialFeatures: Feature[]) {
    this.features = [...initialFeatures];
  }

  getAll(): Feature[] {
    return [...this.features];
  }

  getById(id: string): Feature | undefined {
    return this.features.find((f) => f.id === id);
  }

  add(feature: Feature): Feature {
    this.features = [...this.features, feature];
    return feature;
  }

  update(feature: Feature): Feature {
    this.features = this.features.map((f) => (f.id === feature.id ? feature : f));
    return feature;
  }

  addStatsigFlag(featureId: string, flag: StatsigFlagRef): Feature | undefined {
    const existing = this.getById(featureId);
    if (!existing) return undefined;
    const updated: Feature = {
      ...existing,
      statsigFlags: [...existing.statsigFlags, flag],
    };
    this.update(updated);
    return updated;
  }
}

export const featureRepo = new FeatureRepo(seed);
