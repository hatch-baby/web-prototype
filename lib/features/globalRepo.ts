import { FeatureRepo } from "./repo";

let repoPromise: Promise<FeatureRepo> | null = null;

export function getGlobalFeatureRepo(): Promise<FeatureRepo> {
  if (!repoPromise) {
    repoPromise = FeatureRepo.create();
  }
  return repoPromise;
}
