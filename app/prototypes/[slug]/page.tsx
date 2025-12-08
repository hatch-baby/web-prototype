type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PrototypePreview({ params }: PageProps) {
  const { slug } = await params;
  const formattedTitle = slug
    ? slug
        .split("-")
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
        .join(" ")
    : "Prototype";

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <header className="rounded-3xl border border-stone-100 bg-gradient-to-r from-amber-50 via-white to-[#385481]/10 p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.25em] text-stone-500">
            Example Domain Prototype
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-stone-900">
            {formattedTitle}
          </h1>
          <p className="mt-3 max-w-2xl text-stone-700">
            This is a mock preview page for the {formattedTitle} experience. Use
            it to validate iframe rendering and navigation from the Feature
            Library.
          </p>
        </header>

        <main className="mt-8 grid gap-6 md:grid-cols-[2fr_1fr]">
          <section className="rounded-3xl border border-stone-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-stone-900">
              Flow Outline
            </h2>
            <ul className="mt-3 space-y-2 text-stone-700">
              <li>• Entry screen with contextual hero</li>
              <li>• Guided steps tailored to this prototype</li>
              <li>• CTA to complete the key action</li>
            </ul>
            <div className="mt-6 h-64 rounded-2xl bg-gradient-to-br from-stone-100 via-white to-[#385481]/10 p-4 text-stone-700">
              <p className="text-sm font-semibold">Preview area</p>
              <p className="text-sm">
                Use this scaffold to validate embeds; replace with a real
                prototype when available.
              </p>
            </div>
          </section>

          <aside className="rounded-3xl border border-stone-100 bg-stone-50 p-6 shadow-sm">
            <h3 className="text-sm uppercase tracking-[0.25em] text-stone-600">
              Quick facts
            </h3>
            <div className="mt-3 space-y-2 text-stone-700">
              <p>Slug: {slug}</p>
              <p>Status: Mock preview</p>
              <p>Owner: Prototype bot</p>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
