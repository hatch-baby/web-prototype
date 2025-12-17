import type { Feature, StatsigFlagRef } from "./types";
import { FEATURE_SEED_DATA } from "./data";
import { loadFeatures, saveFeatures } from "./blobRepo";

export class FeatureRepo {
  // No in-memory cache; always load fresh from Blob (or seed) per operation.
  static async create(): Promise<FeatureRepo> {
    const repo = new FeatureRepo();
    // Seed blob if empty on first creation.
    const initial = await repo.loadOrSeed();
    if (initial.seeded) {
      await saveFeatures(initial.features);
    }
    return repo;
  }

  private async loadOrSeed(): Promise<{ features: Feature[]; seeded: boolean }> {
    const loaded = await loadFeatures();
    if (loaded.length > 0) return { features: loaded, seeded: false };
    return { features: FEATURE_SEED_DATA, seeded: true };
  }

  getAll(): Feature[] {
    throw new Error("Use async getAllAsync instead");
  }

  async getAllAsync(): Promise<Feature[]> {
    const { features, seeded } = await this.loadOrSeed();
    if (seeded) await saveFeatures(features);
    return [...features];
  }

  async getById(id: string): Promise<Feature | undefined> {
    const all = await this.getAllAsync();
    return all.find((f) => f.id === id);
  }

  async add(feature: Feature): Promise<Feature> {
    const all = await this.getAllAsync();
    const next = [...all, feature];
    await saveFeatures(next);
    return feature;
  }

  async update(feature: Feature): Promise<Feature> {
    const all = await this.getAllAsync();
    const next = all.map((f) => (f.id === feature.id ? feature : f));
    await saveFeatures(next);
    return feature;
  }

  async addStatsigFlag(featureId: string, flag: StatsigFlagRef): Promise<Feature | undefined> {
    const existing = await this.getById(featureId);
    if (!existing) return undefined;
    const updated: Feature = {
      ...existing,
      statsigFlags: [...existing.statsigFlags, flag],
    };
    await this.update(updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const all = await this.getAllAsync();
    const next = all.filter((f) => f.id !== id);
    const exists = next.length !== all.length;
    if (exists) {
      await saveFeatures(next);
    }
    return exists;
  }
}
