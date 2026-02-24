import type { Metadata } from "next";
import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import { createClient } from "@/lib/supabase/server";
import { generateItemListSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Services",
  description: "Explore our luxury picnic services, corporate events, tablescapes, proposals, and more in Sonoma County wine country.",
};

// Force dynamic rendering to always fetch fresh content
export const dynamic = 'force-dynamic';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Card layout: 3 or 4 columns based on count, with incomplete rows centered.
 *  2→3col  3→3col  4→4col  5→3col  6→3col  7→4col  8→4col
 */
function getCardCols(count: number): 3 | 4 {
  if (count <= 3) return 3;
  if (count === 4) return 4;
  if (count <= 6) return 3;
  if (count <= 8) return 4;
  if (count === 9) return 3;
  if (count % 4 === 1) return 3;
  return 4;
}

/** Card width classes for gap-8 (2rem) */
const serviceCardWidth = {
  3: "w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)]",
  4: "w-full md:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]",
} as const;

async function getServiceSections() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("service_sections")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching service sections:", error);
      return [];
    }
    return data || [];
  } catch {
    return [];
  }
}

async function getServices() {
  try {
    const supabase = await createClient();
    const { data: services, error } = await supabase
      .from("services")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching services:", error);
      return [];
    }

    // Fetch images for services
    const servicesWithImages = await Promise.all(
      (services || []).map(async (service) => {
        let imageUrl = service.image_url; // Fallback to image_url if exists

        if (service.image_id) {
          const { data: imageData } = await supabase
            .from("media")
            .select("url")
            .eq("id", service.image_id)
            .single();
          if (imageData) {
            imageUrl = imageData.url;
          }
        }

        return {
          ...service,
          image: imageUrl,
        };
      })
    );

    return servicesWithImages;
  } catch (error) {
    console.error("Error in getServices:", error);
    return [];
  }
}

async function getPageHero(pageKey: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("page_heroes")
      .select("*")
      .eq("page_key", pageKey)
      .single();

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export default async function ServicesPage() {
  const [services, sections, hero] = await Promise.all([
    getServices(),
    getServiceSections(),
    getPageHero("services"),
  ]);

  // Generate schema markup (only for categorized services shown on this page)
  const categorizedServices = services.filter((s) => s.section_id);
  const serviceListSchema = categorizedServices.length > 0 ? generateItemListSchema(categorizedServices, "services") : null;

  // Group services by section
  const servicesBySection: Record<string, typeof services> = {};
  for (const section of sections) {
    servicesBySection[section.id] = services
      .filter((s) => s.section_id === section.id)
      .sort((a, b) => a.sort_order - b.sort_order);
  }

  return (
    <>
      {/* Schema.org structured data */}
      {serviceListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceListSchema) }}
        />
      )}

      {/* Hero */}
      <section className={`relative overflow-hidden ${hero?.image_url ? '' : 'bg-sage'}`}>
        {hero?.image_url && (
          <div className="absolute inset-0">
            <img
              src={hero.image_url}
              alt={hero.title || "Picnic Potential services"}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-charcoal/50" />
          </div>
        )}
        <div className={`relative mx-auto max-w-4xl px-4 py-24 text-center ${hero?.image_url ? '' : ''}`}>
          <h1 className={`font-serif text-4xl md:text-5xl ${hero?.image_url ? 'text-white' : 'text-charcoal'}`}>
            {hero?.title || "Our Services"}
          </h1>
          {hero?.description && (
            <p className={`mx-auto mt-6 max-w-2xl text-lg ${hero?.image_url ? 'text-white/85' : 'text-charcoal/70'}`}>
              {hero.description}
            </p>
          )}
          {hero?.show_cta && hero?.cta_text && hero?.cta_link && (
            <Link
              href={hero.cta_link}
              className="mt-8 inline-block rounded-full bg-gold px-8 py-3.5 text-base font-medium text-charcoal transition-colors hover:bg-gold-light"
            >
              {hero.cta_text}
            </Link>
          )}
        </div>
      </section>

      {/* Named Sections */}
      {sections.map((section, index) => {
        const sectionServices = servicesBySection[section.id] || [];
        if (sectionServices.length === 0) return null;

        const cols = getCardCols(sectionServices.length);
        // Alternate background for visual separation
        const hasBg = index % 2 === 1;

        return (
          <section key={section.id} id={slugify(section.title)} className={`py-20 scroll-mt-24 ${hasBg ? 'bg-white' : ''}`}>
            <div className="mx-auto max-w-6xl px-4">
              <div className="text-center">
                <h2 className="font-serif text-3xl text-charcoal md:text-4xl">
                  {section.title}
                </h2>
                {section.description && (
                  <p className="mx-auto mt-4 max-w-2xl text-lg text-warm-gray">
                    {section.description}
                  </p>
                )}
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-8">
                {sectionServices.map((service) => (
                  <div key={service.slug} className={serviceCardWidth[cols]}>
                    <ServiceCard
                      title={service.title}
                      description={service.description}
                      image={service.image}
                      href={service.external_url || `/services/${service.slug}`}
                      external={!!service.external_url}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Bottom CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Link
            href="/request"
            className="inline-block rounded-full bg-gold px-10 py-4 text-lg font-medium text-charcoal transition-colors hover:bg-gold-light"
          >
            Book Your Picnic or Event
          </Link>
        </div>
      </section>
    </>
  );
}
