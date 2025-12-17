"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Feature, StatsigFlagRef } from "@/lib/features/types";
import { colors } from "@/lib/theme";
import { FeatureForm } from "./FeatureForm";
import { useFeatureStore } from "@/lib/features/store";

const statusLabel = (status: Feature["status"]) =>
  status === "released" ? "Released" : "In Progress";

const formatDate = (date: string) => {
  const [y, m, d] = date.split("-").map(Number);
  const parsed = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
};

type Props = {
  feature: Feature;
};

export default function FeatureDetailClient({ feature }: Props) {
  const router = useRouter();
  const { updateFeature, removeFeature } = useFeatureStore();
  const [editOpen, setEditOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [featureState, setFeatureState] = useState<Feature>(feature);

  useEffect(() => {
    let ignore = false;
    const loadLatest = async () => {
      try {
        const res = await fetch("/api/features");
        const json = await res.json();
        if (ignore) return;
        const latest = (json?.features as Feature[] | undefined)?.find(
          (f) => f.id === feature.id,
        );
        if (latest) setFeatureState(latest);
      } catch (err) {
        console.error("Failed to refresh feature", err);
      }
    };
    loadLatest();
    return () => {
      ignore = true;
    };
  }, [feature.id]);

  const handleDelete = async () => {
    const removed = await removeFeature(featureState.id);
    if (removed) {
      router.push("/features");
    } else {
      console.error("Failed to delete feature");
    }
  };

  const statsigContent = featureState.statsigFlags.map((flag) => {
    const content = (
      <span className="inline-flex items-center gap-2">
        <span className="rounded-full border border-[#385481]/40 bg-[#385481]/15 px-2 py-[2px] text-[10px] font-semibold uppercase text-[#1f2f4b]">
          {flag.isExperiment ? "E" : "G"}
        </span>
        <span className="text-xs font-medium text-[#1f2f4b]">{flag.name}</span>
      </span>
    );
    return flag.url ? (
      <a
        key={flag.name}
        href={flag.url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-[#385481]/25 bg-[#385481]/10 px-3 py-1 shadow-sm transition hover:-translate-y-0.5 hover:border-[#385481]/40 hover:bg-white"
      >
        {content}
      </a>
    ) : (
      <span
        key={flag.name}
        className="inline-flex items-center gap-2 rounded-full border border-[#385481]/20 bg-[#385481]/10 px-3 py-1 shadow-sm"
      >
        {content}
      </span>
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
            Feature Detail
          </p>
          <h1 className="text-3xl font-semibold text-stone-900">{featureState.title}</h1>
        <p
          className="mt-2 text-stone-700"
          style={{ whiteSpace: "pre-line" }}
        >
          {featureState.description}
        </p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-stone-700">
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-stone-700">
              {statusLabel(featureState.status)}
            </span>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]"
              style={{
                backgroundColor: `${colors.primary}14`,
                color: colors.textPrimary,
                border: `1px solid ${colors.primary}33`,
              }}
            >
              {featureState.pillar}
            </span>
            <span className="text-stone-600">Owner: {featureState.owner}</span>
            <span className="text-stone-600">Team: {featureState.team}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/features"
            className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-stone-300 hover:shadow"
          >
            ← Back to Features
          </Link>
          <button
            onClick={() => setEditOpen((prev) => !prev)}
            className="rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
            style={{ backgroundColor: colors.primary }}
          >
            {editOpen ? "Close Edit" : "Edit"}
          </button>
        </div>
      </div>

      {editOpen && (
        <FeatureForm
          mode="edit"
          initial={featureState}
          onCancel={() => setEditOpen(false)}
          onSubmit={(updated) => {
            updateFeature(updated).then((next) => {
              setFeatureState(next ?? updated);
            });
            setEditOpen(false);
          }}
        />
      )}

      <div className="rounded-3xl bg-white/80 p-6 shadow-md ring-1 ring-black/5">
        <h2 className="text-lg font-semibold text-stone-900">Statsig Flags</h2>
        <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
          E = Experiment · G = Feature Gate
        </p>
        <div className="mt-3 flex flex-wrap gap-2">{statsigContent}</div>

        <div className="mt-6 grid gap-4 text-sm text-stone-700 sm:grid-cols-2">
          <div className="rounded-2xl border border-stone-100 bg-gradient-to-b from-white to-stone-50 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
              Created
            </p>
            <p className="mt-2 text-base font-semibold text-stone-900">
              {formatDate(featureState.dateCreated)}
            </p>
          </div>
          <div className="rounded-2xl border border-stone-100 bg-gradient-to-b from-white to-stone-50 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
              Released
            </p>
            <p className="mt-2 text-base font-semibold text-stone-900">
              {featureState.dateReleased ? formatDate(featureState.dateReleased) : "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-stone-100 bg-white/90 shadow-md ring-1 ring-black/5">
        <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-stone-900">
            Open Feature Prototype
          </h2>
          <a
            href={featureState.webUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-stone-300 hover:shadow"
          >
            Open in new tab
          </a>
        </div>
        <div className="h-[520px] bg-stone-50">
          <iframe
            src={featureState.webUrl}
            title={featureState.title}
            className="h-full w-full rounded-3xl border-0"
          />
        </div>
      </div>

      <div className="rounded-3xl border border-red-200 bg-red-50/80 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-red-700">Danger Zone</h3>
        <p className="text-sm text-red-600">
          Delete this feature to remove it from the library for everyone.
        </p>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="mt-3 rounded-full border border-red-300 bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
        >
          Delete Feature
        </button>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 shadow-2xl">
            <h4 className="text-lg font-semibold text-stone-900">Delete Feature?</h4>
            <p className="mt-2 text-sm text-stone-700">
              Are you sure you want to delete this feature? This will remove it from the library for
              everyone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-stone-300 hover:shadow"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="rounded-full border border-red-300 bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
