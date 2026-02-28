import type { BuilderPage } from "@/lib/builder-types";
import ContainerRenderer from "./ContainerRenderer";

export default function BuilderPageRenderer({
  page,
  heroImageUrl,
}: {
  page: BuilderPage;
  heroImageUrl?: string | null;
}) {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {heroImageUrl ? (
          <>
            <div className="absolute inset-0">
              <img src={heroImageUrl} alt={page.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-charcoal/50" />
            </div>
            <div className="relative mx-auto max-w-4xl px-4 py-24 text-center">
              <h1 className="font-serif text-4xl text-white md:text-5xl">{page.title}</h1>
              {page.hero_subtitle && (
                <p className="mx-auto mt-6 max-w-2xl text-lg text-white/85">{page.hero_subtitle}</p>
              )}
            </div>
          </>
        ) : (
          <div className="bg-sage py-16 md:py-20">
            <div className="max-w-6xl mx-auto px-4 text-center">
              <h1 className="font-serif text-4xl md:text-5xl text-charcoal">{page.title}</h1>
              {page.hero_subtitle ? (
                <p className="text-charcoal/70 text-lg max-w-2xl mx-auto mt-4">{page.hero_subtitle}</p>
              ) : page.meta_description ? (
                <p className="text-charcoal/70 text-lg max-w-2xl mx-auto mt-4">{page.meta_description}</p>
              ) : null}
            </div>
          </div>
        )}
      </section>

      {/* Content */}
      {(page.content || []).map((container) => (
        <ContainerRenderer key={container.id} container={container} />
      ))}
    </main>
  );
}
