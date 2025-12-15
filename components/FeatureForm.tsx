"use client";

import { useState } from "react";
import { colors } from "@/lib/theme";
import type {
  Feature,
  Pillar,
  StatsigFlagRef,
  Team,
  FeatureStatus,
} from "@/lib/features/types";
import { FEATURE_STATUSES, PILLARS, TEAMS } from "@/lib/features/constants";

type FlagDraft = {
  id: string;
  name: string;
  type: "gate" | "experiment";
  url?: string;
};

type Props = {
  initial?: Partial<Feature>;
  onSubmit: (feature: Feature) => void;
  onCancel: () => void;
  mode: "create" | "edit";
};

const emptyFlag = (): FlagDraft => ({
  id:
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `flag-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
  name: "",
  type: "gate",
  url: "",
});

const todayIso = () =>
  new Date().toLocaleDateString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

export function FeatureForm({ initial, onSubmit, onCancel, mode }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [webUrl, setWebUrl] = useState(initial?.webUrl ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [pillar, setPillar] = useState<Pillar>(initial?.pillar ?? "Pillar 1");
  const [team, setTeam] = useState<Team>(initial?.team ?? "Platform");
  const [status, setStatus] = useState<FeatureStatus>(initial?.status ?? "in_progress");
  const [owner, setOwner] = useState(initial?.owner ?? "");
  const [dateCreated, setDateCreated] = useState(
    initial?.dateCreated && initial.dateCreated.length > 10
      ? initial.dateCreated.slice(0, 10)
      : initial?.dateCreated ?? todayIso(),
  );
  const [dateReleased, setDateReleased] = useState(
    initial?.dateReleased ? initial.dateReleased.slice(0, 10) : "",
  );
  const [flags, setFlags] = useState<FlagDraft[]>(
    initial?.statsigFlags?.map<FlagDraft>((f) => ({
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `flag-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      name: f.name,
      type: f.isExperiment ? "experiment" : "gate",
      url: f.url ?? "",
    })) ?? [],
  );

  const buildFeature = (): Feature | null => {
    if (!title || !webUrl || !description || !pillar || !team || !status) return null;
    const releaseDate =
      dateReleased || status === "released" ? (dateReleased || dateCreated) : undefined;
    const statsigFlags: StatsigFlagRef[] = flags
      .filter((f) => f.name.trim())
      .map((f) => ({
        name: f.name.trim(),
        isExperiment: f.type === "experiment",
        isFeatureGate: f.type === "gate",
        url: f.url?.trim() || undefined,
      }));

    return {
      id:
        initial?.id ??
        (crypto.randomUUID ? crypto.randomUUID() : `feat-${Date.now().toString(36)}`),
      title,
      webUrl,
      description,
      statsigFlags,
      dateCreated,
      dateReleased: dateReleased || undefined,
      owner,
      team,
      status,
      pillar,
    };
  };

  const addFlagRow = () => setFlags((prev) => [...prev, emptyFlag()]);
  const removeFlagRow = (id: string) => setFlags((prev) => prev.filter((flag) => flag.id !== id));
  const updateFlag = (id: string, next: Partial<FlagDraft>) =>
    setFlags((prev) => prev.map((f) => (f.id === id ? { ...f, ...next } : f)));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const feature = buildFeature();
    if (!feature) {
      alert("Please fill all required fields.");
      return;
    }
    onSubmit(feature);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-lg"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-stone-900">
          {mode === "create" ? "New Feature" : "Edit Feature"}
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-stone-300 hover:shadow"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-full px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
            style={{ backgroundColor: colors.primary }}
          >
            {mode === "create" ? "Create Feature" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-stone-700">
          Title*
          <input
            className="rounded-xl border border-stone-200 bg-white px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-stone-700">
          Web URL*
          <input
            className="rounded-xl border border-stone-200 bg-white px-3 py-2"
            value={webUrl}
            onChange={(e) => setWebUrl(e.target.value)}
            required
          />
        </label>
      </div>

      <label className="flex flex-col gap-2 text-sm text-stone-700">
        Description*
        <textarea
          className="rounded-xl border border-stone-200 bg-white px-3 py-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          required
        />
        </label>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="flex flex-col gap-2 text-sm text-stone-700">
          Pillar*
          <select
            className="rounded-xl border border-stone-200 bg-white px-3 py-2"
            value={pillar}
            onChange={(e) => setPillar(e.target.value as Pillar)}
            required
          >
            {PILLARS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm text-stone-700">
          Team*
          <select
            className="rounded-xl border border-stone-200 bg-white px-3 py-2"
            value={team}
            onChange={(e) => setTeam(e.target.value as Team)}
            required
          >
            {TEAMS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm text-stone-700">
          Status*
          <select
            className="rounded-xl border border-stone-200 bg-white px-3 py-2"
            value={status}
            onChange={(e) => {
              const next = e.target.value as FeatureStatus;
              setStatus(next);
              if (next === "released" && !dateReleased) {
                setDateReleased(dateCreated);
              }
            }}
            required
          >
            {FEATURE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="flex flex-col gap-2 text-sm text-stone-700">
          Owner
          <input
            className="rounded-xl border border-stone-200 bg-white px-3 py-2"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="Enter owner name"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-stone-700">
          Date Created
          <input
            type="date"
            className="rounded-xl border border-stone-200 bg-white px-3 py-2"
            value={dateCreated}
            onChange={(e) => setDateCreated(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-stone-700">
          Date Released
          <input
            type="date"
            className="rounded-xl border border-stone-200 bg-white px-3 py-2"
            value={dateReleased}
            onChange={(e) => setDateReleased(e.target.value)}
            disabled={status !== "released"}
          />
          {status !== "released" && (
            <span className="text-xs text-stone-500">Enable by setting status to released.</span>
          )}
        </label>
      </div>

      <div className="space-y-3 rounded-2xl border border-stone-200 bg-stone-50 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-stone-800">Statsig Flags</p>
          <button
            type="button"
            onClick={addFlagRow}
            className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold text-stone-800 shadow-sm transition hover:border-stone-300 hover:shadow"
          >
            Add Statsig Flag
          </button>
        </div>
        {flags.length === 0 && (
          <p className="text-xs text-stone-500">No flags added yet.</p>
        )}
        <div className="space-y-3">
          {flags.map((flag) => (
            <div
              key={flag.id}
              className="grid gap-3 rounded-xl border border-stone-200 bg-white p-3 md:grid-cols-3"
            >
              <label className="flex flex-col gap-1 text-sm text-stone-700">
                Name
                <input
                  className="rounded-lg border border-stone-200 bg-white px-3 py-2"
                  value={flag.name}
                  onChange={(e) => updateFlag(flag.id, { name: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm text-stone-700">
                Type
                <select
                  className="rounded-lg border border-stone-200 bg-white px-3 py-2"
                  value={flag.type}
                  onChange={(e) =>
                    updateFlag(flag.id, {
                      type: e.target.value as "gate" | "experiment",
                    })
                  }
                >
                  <option value="gate">Feature Gate</option>
                  <option value="experiment">Experiment</option>
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm text-stone-700">
                URL
                <input
                  className="rounded-lg border border-stone-200 bg-white px-3 py-2"
                  value={flag.url}
                  onChange={(e) => updateFlag(flag.id, { url: e.target.value })}
                  placeholder="Optional"
                />
              </label>
              <div className="md:col-span-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeFlagRow(flag.id)}
                  className="text-xs font-semibold text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
