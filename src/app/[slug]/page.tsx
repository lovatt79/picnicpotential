import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import VendorCard from "@/components/VendorCard";
import { createClient } from "@/lib/supabase/server";
import { generateItemListSchema } from "@/lib/schema";

export const dynamic = 'force-dynamic';

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

// Metadata generation
export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const supabase = await createClient();
    const { data: collection } = await supabase
      .from("collection_pages")
      .select("title, meta_description, description")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (!collection) return {};
    return {
      title: collection.title,
      description: collection.meta_description || collection.description || undefined,
    };
  } catch {
    return {};
  }
}

// Page component
export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;

  type CollectionItem = {
    id: string;
    item_type: string;
    custom_title: string | null;
    custom_description: string | null;
    is_coming_soon: boolean;
    sort_order: number;
    section_id: string | null;
    service: {
      id: string;
      title: string;
      slug: string;
      description: string | null;
      image_url: string | null;
      image_id: string | null;
      external_url: string | null;
      is_published: boolean;
    } | null;
    partner: {
      id: string;
      name: string;
      category: string;
      location: string | null;
      url: string | null;
      logo_url: string | null;
      logo_id: string | null;
      is_published: boolean;
    } | null;
  };

  let collection;
  let heroImage = null;
  let items: CollectionItem[] = [];
  let sections: Array<{ id: string; title: string; description: string | null; sort_order: number; is_published: boolean }> = [];
  let mediaMap: Record<string, string> = {};

  try {
    const supabase = await createClient();

    const { data: collectionData } = await supabase
      .from("collection_pages")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (!collectionData) {
      notFound();
    }

    collection = collectionData;

    // Fetch hero image if set
    if (collection.hero_image_id) {
      const { data } = await supabase
        .from("media")
        .select("url")
        .eq("id", collection.hero_image_id)
        .single();
      heroImage = data;
    }

    // Fetch sections for this collection
    const { data: sectionData } = await supabase
      .from("collection_sections")
      .select("id, title, description, sort_order, is_published")
      .eq("collection_page_id", collection.id)
      .order("sort_order");
    sections = sectionData || [];

    // Fetch items via junction table with both service and partner joins
    const { data: itemsData } = await supabase
      .from("collection_page_items")
      .select("*, service:services(id, title, slug, description, image_url, image_id, external_url, is_published), partner:vendor_partners(id, name, category, location, url, logo_url, logo_id, is_published)")
      .eq("collection_page_id", collection.id)
      .order("sort_order");

    // Filter: show services if published OR coming soon; show partners if published
    items = (itemsData ?? []).filter(
      (item: { item_type: string; is_coming_soon: boolean; section_id: string | null; service: { is_published: boolean } | null; partner: { is_published: boolean } | null }) => {
        if (item.item_type === "partner") {
          return item.partner?.is_published;
        }
        // Service: show if published, or if marked as coming soon (even if unpublished)
        return item.is_coming_soon || item.service?.is_published;
      }
    );

    // Fetch images from media for both service image_ids and partner logo_ids
    const allImageIds = items
      .flatMap((item) => [item.service?.image_id, item.partner?.logo_id])
      .filter(Boolean) as string[];

    if (allImageIds.length > 0) {
      const { data: mediaData } = await supabase
        .from("media")
        .select("id, url")
        .in("id", allImageIds);
      if (mediaData) {
        mediaMap = Object.fromEntries(mediaData.map((m) => [m.id, m.url]));
      }
    }
  } catch {
    notFound();
  }

  // Schema — only include services (not partners) for ItemList
  const schemaItems = items
    .filter((item) => item.item_type !== "partner" && item.service)
    .map((item) => ({
      title: item.custom_title || item.service!.title,
      slug: item.service!.slug,
    }));

  const schema = schemaItems.length > 0
    ? generateItemListSchema(schemaItems, "services")
    : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}

      {/* Hero */}
      <section className="relative overflow-hidden">
        {heroImage?.url ? (
          <>
            <div className="absolute inset-0">
              <img src={heroImage.url} alt={collection.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-charcoal/50" />
            </div>
            <div className="relative mx-auto max-w-4xl px-4 py-24 text-center">
              <h1 className="font-serif text-4xl text-white md:text-5xl">{collection.title}</h1>
              {collection.hero_subtitle && (
                <p className="mx-auto mt-6 max-w-2xl text-lg text-white/85">{collection.hero_subtitle}</p>
              )}
            </div>
          </>
        ) : (
          <div className="bg-sage-light/30 mx-auto max-w-4xl px-4 py-24 text-center">
            <h1 className="font-serif text-4xl text-charcoal md:text-5xl">{collection.title}</h1>
            {collection.hero_subtitle && (
              <p className="mx-auto mt-6 max-w-2xl text-lg text-warm-gray">{collection.hero_subtitle}</p>
            )}
          </div>
        )}
      </section>

      {/* Description */}
      {collection.description && (
        <section className="py-12 bg-white">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <p className="text-lg text-warm-gray leading-relaxed">{collection.description}</p>
          </div>
        </section>
      )}

      {/* Cards — grouped by sections */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 space-y-16">
          {(() => {
            // Group items by section
            const uncategorized = items.filter((i) => !i.section_id);
            const publishedSections = sections.filter((s) => s.is_published);

            const renderItemCard = (item: CollectionItem) => {
              if (item.item_type === "partner" && item.partner) {
                const partner = item.partner;
                const logoUrl = partner.logo_id
                  ? mediaMap[partner.logo_id]
                  : partner.logo_url;

                return (
                  <div
                    key={item.id}
                    className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)] relative"
                  >
                    {item.is_coming_soon && (
                      <div className="absolute top-4 right-4 z-10 bg-gold text-charcoal text-xs font-bold px-3 py-1 rounded-full">
                        Coming Soon
                      </div>
                    )}
                    <VendorCard
                      name={item.custom_title || partner.name}
                      category={partner.category}
                      location={partner.location || undefined}
                      logo={logoUrl || undefined}
                      url={item.is_coming_soon ? undefined : (partner.url || undefined)}
                    />
                  </div>
                );
              }

              const service = item.service!;
              const imageUrl = service.image_id
                ? mediaMap[service.image_id]
                : service.image_url;
              const cardTitle = item.custom_title || service.title;
              const cardDescription =
                item.custom_description || service.description || "";
              const href = item.is_coming_soon
                ? undefined
                : service.external_url || `/services/${service.slug}`;

              return (
                <div
                  key={item.id}
                  className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)] relative"
                >
                  {item.is_coming_soon && (
                    <div className="absolute top-4 right-4 z-10 bg-gold text-charcoal text-xs font-bold px-3 py-1 rounded-full">
                      Coming Soon
                    </div>
                  )}
                  <ServiceCard
                    title={cardTitle}
                    description={cardDescription}
                    image={imageUrl || ""}
                    href={href}
                    external={!!service.external_url}
                  />
                </div>
              );
            };

            return (
              <>
                {/* Uncategorized items (no heading) */}
                {uncategorized.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-8">
                    {uncategorized.map(renderItemCard)}
                  </div>
                )}

                {/* Section-grouped items */}
                {publishedSections.map((section) => {
                  const sectionItems = items.filter((i) => i.section_id === section.id);
                  if (sectionItems.length === 0) return null;

                  return (
                    <div key={section.id}>
                      <div className="text-center mb-10">
                        <h2 className="font-serif text-2xl text-charcoal md:text-3xl">
                          {section.title}
                        </h2>
                        {section.description && (
                          <p className="mt-3 text-warm-gray max-w-2xl mx-auto">
                            {section.description}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap justify-center gap-8">
                        {sectionItems.map(renderItemCard)}
                      </div>
                    </div>
                  );
                })}
              </>
            );
          })()}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-sage-light/30 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-serif text-3xl text-charcoal md:text-4xl">Ready to Start Planning?</h2>
          <p className="mt-4 text-warm-gray">Fill out our request form and we&apos;ll create the perfect experience for your occasion.</p>
          <Link
            href="/request"
            className="mt-8 inline-block rounded-full bg-gold px-10 py-4 text-lg font-medium text-charcoal transition-colors hover:bg-gold-light"
          >
            Book Your Experience
          </Link>
        </div>
      </section>
    </>
  );
}
