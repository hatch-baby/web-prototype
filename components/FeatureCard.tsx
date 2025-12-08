import Link from "next/link";
import type { Feature } from "@/lib/features/types";

type Props = {
  feature: Feature;
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export function FeatureCard({ feature }: Props) {
  return (
    <Link
      href={`/features/${feature.id}`}
      className="group flex h-full flex-col rounded-3xl border border-white/60 bg-white/80 p-6 shadow-md ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-lg hover:ring-amber-200/70"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl font-semibold text-stone-900">
          {feature.title}
        </h3>
        <span className="rounded-full bg-[#385481]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#1f2f4b]">
          Feature
        </span>
      </div>
      <p className="mt-3 text-stone-700">{feature.description}</p>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-stone-700">
        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-stone-700">
          {feature.status}
        </span>
        <span className="text-stone-600">Owner: {feature.owner}</span>
        <span className="text-stone-600">Team: {feature.team}</span>
      </div>

      <div className="mt-5 space-y-2">
        <div className="flex items-baseline gap-2">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-500">
            Statsig Flags
          </p>
          <span className="text-[11px] text-stone-500">
            (E = Experiment, G = Gate)
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {feature.statsigFlags.map((flag) => (
            flag.url ? (
              <a
                key={flag.name}
                href={flag.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[#385481]/25 bg-[#385481]/10 px-3 py-1 text-xs font-semibold text-[#1f2f4b] shadow-sm transition hover:-translate-y-0.5 hover:border-[#385481]/40 hover:bg-white"
              >
                [{flag.isExperiment ? "E" : "G"}] {flag.name}
              </a>
            ) : (
              <span
                key={flag.name}
                className="rounded-full border border-[#385481]/20 bg-[#385481]/10 px-3 py-1 text-xs font-medium text-[#1f2f4b] shadow-sm"
              >
                [{flag.isExperiment ? "E" : "G"}] {flag.name}
              </span>
            )
          ))}
        </div>
      </div>

      <div className="mt-auto pt-5 text-sm text-stone-600">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-stone-700">Created:</span>
          <span>{formatDate(feature.dateCreated)}</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className="font-semibold text-stone-700">Released:</span>
          <span>
            {feature.dateReleased ? formatDate(feature.dateReleased) : "—"}
          </span>
        </div>
      </div>
    </Link>
  );
}
