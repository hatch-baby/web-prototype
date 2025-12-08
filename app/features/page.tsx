import { FeatureCard } from "@/components/FeatureCard";
import { features } from "@/lib/features/data";

export default function FeatureListPage() {
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-white to-[#385481]/10 p-8 shadow-sm ring-1 ring-black/5">
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
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} />
        ))}
      </section>
    </div>
  );
}
