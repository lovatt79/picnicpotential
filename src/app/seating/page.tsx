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

async function getSeatingOptions() {
  try {
    const supabase = await createClient();
    const { data: seatingOptions, error } = await supabase
      .from("seating_options")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: true });

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
  const seatingOptions = await getSeatingOptions();
  const hero = await getPageHero("seating");

  // Generate schema markup
  const seatingListSchema = seatingOptions.length > 0 ? generateItemListSchema(seatingOptions, "seating") : null;

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

      {/* Seating Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {seatingOptions.map((option) => (
              <SeatingCard
                key={option.id}
                title={option.title}
                description={option.description}
                image={option.image}
                href={`/seating/${option.slug}`}
              />
            ))}
          </div>
        </div>
      </section>

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
