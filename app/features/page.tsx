"use client";

import { FeatureCard } from "@/components/FeatureCard";
import { useFeatureStore } from "@/lib/features/store";
import type { ReleasedFilter, SortOption, FeatureStatusFilter } from "@/lib/features/store";
import type { Pillar } from "@/lib/features/types";
import { colors } from "@/lib/theme";
import { FeatureForm } from "@/components/FeatureForm";
import { useState } from "react";

export default function FeatureListPage() {
  const {
    filteredAndSortedFeatures,
    selectedPillars,
    releasedFilter,
    statusFilter,
    sortOption,
    setSelectedPillars,
    setReleasedFilter,
    setStatusFilter,
    setSortOption,
    addFeature,
  } = useFeatureStore();

  const allPillars: Pillar[] = ["Pillar 0", "Pillar 1", "Pillar 2", "Pillar Growth"];
  const [showCreate, setShowCreate] = useState(false);

  const togglePillar = (pillar: Pillar) => {
    setSelectedPillars((prev) =>
      prev.includes(pillar) ? prev.filter((p) => p !== pillar) : [...prev, pillar],
    );
  };

  const releasedOptions: { label: string; value: ReleasedFilter }[] = [
    { label: "All", value: "all" },
    { label: "Released", value: "released" },
    { label: "Unreleased", value: "unreleased" },
  ];

  const statusOptions: { label: string; value: FeatureStatusFilter }[] = [
    { label: "All", value: "all" },
    { label: "In Progress", value: "in_progress" },
    { label: "Released", value: "released" },
  ];

  const sortOptions: { label: string; value: SortOption }[] = [
    { label: "Newest First (Created)", value: "created_desc" },
    { label: "Oldest First (Created)", value: "created_asc" },
    { label: "Title A–Z", value: "title_asc" },
    { label: "Title Z–A", value: "title_desc" },
  ];

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-white to-[#385481]/10 p-8 shadow-sm ring-1 ring-black/5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-stone-500">
              Library
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-stone-900">
              Feature Library
            </h1>
            <p className="mt-3 max-w-3xl text-lg text-stone-700">
              Track key product experiments and releases powered by Statsig. Browse
              prototypes, timelines, and rollout flags in one place.
            </p>
          </div>
          <button
            onClick={() => setShowCreate((prev) => !prev)}
            className="rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
            style={{ backgroundColor: colors.primary }}
          >
            {showCreate ? "Close" : "New Feature"}
          </button>
        </div>
      </section>

      {showCreate && (
        <FeatureForm
          mode="create"
          onCancel={() => setShowCreate(false)}
          onSubmit={(feature) => {
            addFeature(feature);
            setShowCreate(false);
          }}
        />
      )}

      <section className="space-y-4 rounded-3xl border border-stone-100 bg-white/80 p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-[0.2em] text-stone-500">
            Pillars
          </span>
          <button
            onClick={() => setSelectedPillars([])}
            className="rounded-full border px-3 py-1 text-xs font-semibold transition"
            style={{
              borderColor: selectedPillars.length === 0 ? `${colors.primary}40` : colors.borderSubtle,
              backgroundColor: selectedPillars.length === 0 ? `${colors.primary}15` : colors.surface,
              color: colors.textPrimary,
            }}
          >
            All Pillars
          </button>
          {allPillars.map((pillar) => {
            const active = selectedPillars.includes(pillar);
            return (
              <button
                key={pillar}
                onClick={() => togglePillar(pillar)}
                className="rounded-full border px-3 py-1 text-xs font-semibold transition"
                style={{
                  borderColor: active ? `${colors.primary}50` : colors.borderSubtle,
                  backgroundColor: active ? `${colors.primary}18` : colors.surface,
                  color: colors.textPrimary,
                }}
              >
                {pillar}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs uppercase tracking-[0.2em] text-stone-500">
            Release
          </span>
          <div className="flex overflow-hidden rounded-full border border-stone-200 bg-white shadow-sm">
            {releasedOptions.map((opt) => {
              const active = releasedFilter === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setReleasedFilter(opt.value)}
                  className="px-4 py-2 text-xs font-semibold transition"
                  style={{
                    backgroundColor: active ? `${colors.primary}18` : "transparent",
                    color: colors.textPrimary,
                    borderRight: "1px solid #eaeaea",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs uppercase tracking-[0.2em] text-stone-500">
            Status
          </span>
          <div className="flex overflow-hidden rounded-full border border-stone-200 bg-white shadow-sm">
            {statusOptions.map((opt, idx) => {
              const active = statusFilter === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setStatusFilter(opt.value)}
                  className="px-4 py-2 text-xs font-semibold transition"
                  style={{
                    backgroundColor: active ? `${colors.primary}18` : "transparent",
                    color: colors.textPrimary,
                    borderRight: idx === statusOptions.length - 1 ? "none" : "1px solid #eaeaea",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs uppercase tracking-[0.2em] text-stone-500">
            Sort
          </span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 shadow-sm"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredAndSortedFeatures.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} />
        ))}
      </section>
    </div>
  );
}
