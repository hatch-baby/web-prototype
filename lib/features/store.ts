"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [features, setFeatures] = useState<Feature[]>([]);
  const [selectedPillars, setSelectedPillars] = useState<Pillar[]>([]);
  const [releasedFilter, setReleasedFilter] = useState<ReleasedFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("created_desc");
  const [statusFilter, setStatusFilter] = useState<FeatureStatusFilter>("all");
  const [isLoading, setIsLoading] = useState(true);

  const safeParse = async (res: Response) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      console.error("Failed to parse JSON response", text);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/features");
        if (!mounted) return;
        const json = await safeParse(res);
        if (!res.ok) {
          console.error("Failed to load features", json);
          return;
        }
        setFeatures(json?.features ?? []);
      } catch (e) {
        console.error("Failed to load features", e);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const addStatsigFlag = async (
    featureId: string,
    flag: StatsigFlagRef,
  ): Promise<Feature | undefined> => {
    try {
      const res = await fetch("/api/features/flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featureId, flag }),
      });
      const json = await safeParse(res);
      if (!res.ok) {
        console.error("Failed to add flag", json);
        return undefined;
      }
      if (json?.features) setFeatures(json.features);
      return json?.feature as Feature | undefined;
    } catch (e) {
      console.error("Failed to add flag", e);
      return undefined;
    }
  };

  const addFeature = async (feature: Feature): Promise<Feature | undefined> => {
    try {
      const res = await fetch("/api/features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feature),
      });
      const json = await safeParse(res);
      if (!res.ok) {
        console.error("Failed to add feature", json);
        return undefined;
      }
      if (json?.features) setFeatures(json.features);
      return json?.feature as Feature | undefined;
    } catch (e) {
      console.error("Failed to add feature", e);
      return undefined;
    }
  };

  const updateFeature = async (feature: Feature): Promise<Feature | undefined> => {
    try {
      const res = await fetch("/api/features", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feature),
      });
      const json = await safeParse(res);
      if (!res.ok) {
        console.error("Failed to update feature", json);
        return undefined;
      }
      if (json?.features) setFeatures(json.features);
      return json?.feature as Feature | undefined;
    } catch (e) {
      console.error("Failed to update feature", e);
      return undefined;
    }
  };

  const removeFeature = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/features?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = await safeParse(res);
      if (!res.ok) {
        console.error("Failed to delete feature", json);
        return false;
      }
      if (json?.features) setFeatures(json.features);
      return true;
    } catch (e) {
      console.error("Failed to delete feature", e);
      return false;
    }
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
    isLoading,
  };
}
