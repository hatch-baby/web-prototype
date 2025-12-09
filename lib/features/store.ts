"use client";

import { useMemo, useState } from "react";
import { features as initialFeatures } from "./data";
import type { Feature, Pillar } from "./types";

export type ReleasedFilter = "all" | "released" | "unreleased";
export type SortOption = "created_desc" | "created_asc" | "title_asc" | "title_desc";

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
) => {
  let result = [...items];
  if (selectedPillars.length > 0) {
    result = result.filter((f) => selectedPillars.includes(f.pillar));
  }
  if (releasedFilter === "released") {
    result = result.filter((f) => Boolean(f.dateReleased));
  } else if (releasedFilter === "unreleased") {
    result = result.filter((f) => !f.dateReleased);
  }
  return result;
};

export function useFeatureStore() {
  const [features] = useState<Feature[]>(initialFeatures);
  const [selectedPillars, setSelectedPillars] = useState<Pillar[]>([]);
  const [releasedFilter, setReleasedFilter] = useState<ReleasedFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("created_desc");

  const filteredAndSortedFeatures = useMemo(
    () =>
      sortFeatures(
        filterFeatures(features, selectedPillars, releasedFilter),
        sortOption,
      ),
    [features, selectedPillars, releasedFilter, sortOption],
  );

  return {
    features,
    selectedPillars,
    releasedFilter,
    sortOption,
    setSelectedPillars,
    setReleasedFilter,
    setSortOption,
    filteredAndSortedFeatures,
  };
}
