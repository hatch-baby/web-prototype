"use client";

import { useMemo, useState } from "react";
import { featureRepo } from "./repo";
import type { Feature, FeatureStatus, Pillar, StatsigFlagRef } from "./types";

export type ReleasedFilter = "all" | "released" | "unreleased";
export type SortOption = "created_desc" | "created_asc" | "title_asc" | "title_desc";
export type FeatureStatusFilter = "all" | "in_progress" | "released";

const sortFeatures = (items: Feature[], sort: SortOption) => {
  const sorted = [...items];
  switch (sort) {
    case "created_asc":
      sorted.sort(
        (a, b) => new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime(),
      );
      break;
    case "title_asc":
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "title_desc":
      sorted.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case "created_desc":
    default:
      sorted.sort(
        (a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime(),
      );
      break;
  }
  return sorted;
};

const filterFeatures = (
  items: Feature[],
  selectedPillars: Pillar[],
  releasedFilter: ReleasedFilter,
  statusFilter: FeatureStatusFilter,
) => {
  let result = [...items];

   // status filter
  if (statusFilter !== "all") {
    result = result.filter((f) => f.status === statusFilter);
  }

  if (selectedPillars.length > 0) {
    result = result.filter((f) => selectedPillars.includes(f.pillar));
  }
  if (releasedFilter === "released") {
    result = result.filter((f) => f.status === "released");
  } else if (releasedFilter === "unreleased") {
    result = result.filter((f) => f.status !== "released");
  }
  return result;
};

export function useFeatureStore() {
  const [features, setFeatures] = useState<Feature[]>(featureRepo.getAll());
  const [selectedPillars, setSelectedPillars] = useState<Pillar[]>([]);
  const [releasedFilter, setReleasedFilter] = useState<ReleasedFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("created_desc");
  const [statusFilter, setStatusFilter] = useState<FeatureStatusFilter>("all");

  const refresh = () => setFeatures(featureRepo.getAll());

  const addStatsigFlag = (featureId: string, flag: StatsigFlagRef) => {
    const updated = featureRepo.addStatsigFlag(featureId, flag);
    if (updated) refresh();
    return updated;
  };

  const addFeature = (feature: Feature) => {
    featureRepo.add(feature);
    refresh();
  };

  const updateFeature = (feature: Feature) => {
    featureRepo.update(feature);
    refresh();
  };

  const removeFeature = (id: string) => {
    featureRepo.delete(id);
    refresh();
  };

  const filteredAndSortedFeatures = useMemo(
    () =>
      sortFeatures(
        filterFeatures(features, selectedPillars, releasedFilter, statusFilter),
        sortOption,
      ),
    [features, selectedPillars, releasedFilter, statusFilter, sortOption],
  );

  return {
    features,
    selectedPillars,
    releasedFilter,
    sortOption,
    statusFilter,
    setSelectedPillars,
    setReleasedFilter,
    setSortOption,
    setStatusFilter,
    addStatsigFlag,
    addFeature,
    updateFeature,
    removeFeature,
    filteredAndSortedFeatures,
  };
}
