import type { Feature, StatsigFlagRef } from "./types";
import { FEATURE_SEED_DATA } from "./data";
import { loadFeatures, saveFeatures } from "./fileRepo";

export class FeatureRepo {
  private features: Feature[] = [];

  private constructor(initialFeatures: Feature[]) {
    this.features = initialFeatures;
  }

  static async create(): Promise<FeatureRepo> {
    const loaded = await loadFeatures();
    const initial = loaded.length > 0 ? loaded : FEATURE_SEED_DATA;
    if (loaded.length === 0) {
      await saveFeatures(initial);
    }
    return new FeatureRepo(initial);
  }

  getAll(): Feature[] {
    return [...this.features];
  }

  getById(id: string): Feature | undefined {
    return this.features.find((f) => f.id === id);
  }

  private async persist() {
    await saveFeatures(this.features);
  }

  async add(feature: Feature): Promise<Feature> {
    this.features = [...this.features, feature];
    await this.persist();
    return feature;
  }

  async update(feature: Feature): Promise<Feature> {
    this.features = this.features.map((f) => (f.id === feature.id ? feature : f));
    await this.persist();
    return feature;
  }

  async addStatsigFlag(featureId: string, flag: StatsigFlagRef): Promise<Feature | undefined> {
    const existing = this.getById(featureId);
    if (!existing) return undefined;
    const updated: Feature = {
      ...existing,
      statsigFlags: [...existing.statsigFlags, flag],
    };
    await this.update(updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const exists = this.features.some((f) => f.id === id);
    this.features = this.features.filter((f) => f.id !== id);
    await this.persist();
    return exists;
  }
}
