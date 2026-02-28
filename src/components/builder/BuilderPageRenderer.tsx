import type { BuilderPage } from "@/lib/builder-types";
import ContainerRenderer from "./ContainerRenderer";

export default function BuilderPageRenderer({
  page,
}: {
  page: BuilderPage;
}) {
  return (
    <main>
      {/* Hero */}
      <section className="bg-sage py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal">
            {page.title}
          </h1>
          {page.meta_description && (
            <p className="text-charcoal/70 text-lg max-w-2xl mx-auto mt-4">
              {page.meta_description}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      {(page.content || []).map((container) => (
        <ContainerRenderer key={container.id} container={container} />
      ))}
    </main>
  );
}
