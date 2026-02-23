import type { Metadata } from "next";
import Link from "next/link";
import SeatingCard from "@/components/SeatingCard";
import { createClient } from "@/lib/supabase/server";
import { generateItemListSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Seating Styles",
  description: "Explore our seating options including picnic, lounge, chair vignettes, cabanas, tablescapes, and igloo tents.",
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
const seatingCardWidth = {
  3: "w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)]",
  4: "w-full md:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]",
} as const;

async function getSeatingSections() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("seating_sections")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching seating sections:", error);
      return [];
    }
    return data || [];
  } catch {
    return [];
  }
}

async function getSeatingOptions() {
  try {
    const supabase = await createClient();
    const { data: seatingOptions, error } = await supabase
      .from("seating_options")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching seating options:", error);
      return [];
    }

    // Fetch images for seating options
    const seatingWithImages = await Promise.all(
      (seatingOptions || []).map(async (option) => {
        let imageUrl = option.image_url;

        if (option.image_id) {
          const { data: imageData } = await supabase
            .from("media")
            .select("url")
            .eq("id", option.image_id)
            .single();
          if (imageData) {
            imageUrl = imageData.url;
          }
        }

        return {
          ...option,
          image: imageUrl,
          slug: slugify(option.title),
        };
      })
    );

    return seatingWithImages;
  } catch (error) {
    console.error("Error in getSeatingOptions:", error);
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

export default async function SeatingPage() {
  const [seatingOptions, sections, hero] = await Promise.all([
    getSeatingOptions(),
    getSeatingSections(),
    getPageHero("seating"),
  ]);

  // Generate schema markup
  const seatingListSchema = seatingOptions.length > 0 ? generateItemListSchema(seatingOptions, "seating") : null;

  // Group seating options by section
  const uncategorizedOptions = seatingOptions.filter((s) => !s.section_id);
  const optionsBySection: Record<string, typeof seatingOptions> = {};
  for (const section of sections) {
    optionsBySection[section.id] = seatingOptions
      .filter((s) => s.section_id === section.id)
      .sort((a, b) => a.sort_order - b.sort_order);
  }

  return (
    <>
      {/* Schema.org structured data */}
      {seatingListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seatingListSchema) }}
        />
      )}

      {/* Hero */}
      <section className={`relative overflow-hidden ${hero?.image_url ? '' : 'bg-sage'}`}>
        {hero?.image_url && (
          <div className="absolute inset-0">
            <img
              src={hero.image_url}
              alt={hero.title || "Picnic Potential seating styles"}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-charcoal/50" />
          </div>
        )}
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center">
          <h1 className={`font-serif text-4xl md:text-5xl ${hero?.image_url ? 'text-white' : 'text-charcoal'}`}>
            {hero?.title || "Seating Styles"}
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

      {/* Uncategorized Seating Options (no section heading) */}
      {uncategorizedOptions.length > 0 && (() => {
        const cols = getCardCols(uncategorizedOptions.length);
        return (
          <section className="py-20">
            <div className="mx-auto max-w-7xl px-4">
              <div className="flex flex-wrap justify-center gap-8">
                {uncategorizedOptions.map((option) => (
                  <div key={option.id} className={seatingCardWidth[cols]}>
                    <SeatingCard
                      title={option.title}
                      description={option.description}
                      image={option.image}
                      href={`/seating/${option.slug}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })()}

      {/* Named Sections */}
      {sections.map((section, index) => {
        const sectionOptions = optionsBySection[section.id] || [];
        if (sectionOptions.length === 0) return null;

        const cols = getCardCols(sectionOptions.length);
        const hasBg = (uncategorizedOptions.length > 0 ? index % 2 === 0 : index % 2 === 1);

        return (
          <section key={section.id} id={slugify(section.title)} className={`py-20 ${hasBg ? 'bg-white' : ''}`}>
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
                {sectionOptions.map((option) => (
                  <div key={option.id} className={seatingCardWidth[cols]}>
                    <SeatingCard
                      title={option.title}
                      description={option.description}
                      image={option.image}
                      href={`/seating/${option.slug}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Combination Note */}
      <section className="bg-sage-light/50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-serif text-2xl text-charcoal md:text-3xl">
            Combination Setups
          </h2>
          <p className="mt-4 text-lg text-warm-gray">
            Can&apos;t decide on just one style? Many of our clients combine seating types to
            create a unique experience. Add cabana shade to your picnic, mix lounge areas with
            chair vignettes, or create distinct zones for different activities. Let us know
            your vision and we&apos;ll design the perfect combination for your event.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-serif text-3xl text-charcoal">
            Ready to Choose Your Style?
          </h2>
          <p className="mt-4 text-warm-gray">
            Select your preferred seating style when filling out our Service Request Form.
          </p>
          <Link
            href="/request"
            className="mt-8 inline-block rounded-full bg-gold px-10 py-4 text-lg font-medium text-charcoal transition-colors hover:bg-gold-light"
          >
            Book Your Picnic or Event
          </Link>
        </div>
      </section>
    </>
  );
}
