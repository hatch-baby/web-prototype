import Link from "next/link";
import { notFound } from "next/navigation";
import { features } from "@/lib/features/data";
import type { Feature } from "@/lib/features/types";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const getFeatureById = (id: string): Feature | undefined =>
  features.find((feature) => feature.id === id);

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function FeatureDetailPage({ params }: PageProps) {
  const { id } = await params;
  const feature = getFeatureById(id);

  if (!feature) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
            Feature Detail
          </p>
          <h1 className="text-3xl font-semibold text-stone-900">
            {feature.title}
          </h1>
          <p className="mt-2 text-stone-700">{feature.description}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-stone-700">
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-stone-700">
              {feature.status}
            </span>
            <span className="text-stone-600">Owner: {feature.owner}</span>
            <span className="text-stone-600">Team: {feature.team}</span>
          </div>
        </div>
        <Link
          href="/features"
          className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-stone-300 hover:shadow"
        >
          ← Back to Features
        </Link>
      </div>

      <div className="rounded-3xl bg-white/80 p-6 shadow-md ring-1 ring-black/5">
        <h2 className="text-lg font-semibold text-stone-900">Statsig Flags</h2>
        <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
          E = Experiment · G = Feature Gate
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {feature.statsigFlags.map((flag) => {
            const content = (
              <span className="inline-flex items-center gap-2">
                <span className="rounded-full border border-[#385481]/40 bg-[#385481]/15 px-2 py-[2px] text-[10px] font-semibold uppercase text-[#1f2f4b]">
                  {flag.isExperiment ? "E" : "G"}
                </span>
                <span className="text-xs font-medium text-[#1f2f4b]">
                  {flag.name}
                </span>
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
          })}
        </div>

        <div className="mt-6 grid gap-4 text-sm text-stone-700 sm:grid-cols-2">
          <div className="rounded-2xl border border-stone-100 bg-gradient-to-b from-white to-stone-50 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
              Created
            </p>
            <p className="mt-2 text-base font-semibold text-stone-900">
              {formatDate(feature.dateCreated)}
            </p>
          </div>
          <div className="rounded-2xl border border-stone-100 bg-gradient-to-b from-white to-stone-50 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
              Released
            </p>
            <p className="mt-2 text-base font-semibold text-stone-900">
              {feature.dateReleased ? formatDate(feature.dateReleased) : "—"}
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
            href={feature.webUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-stone-300 hover:shadow"
          >
            Open in new tab
          </a>
        </div>
        <div className="h-[520px] bg-stone-50">
          <iframe
            src={feature.webUrl}
            title={feature.title}
            className="h-full w-full rounded-3xl border-0"
          />
        </div>
      </div>
    </div>
  );
}
