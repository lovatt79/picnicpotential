import type { Metadata } from "next";
import Link from "next/link";
import SeatingCard from "@/components/SeatingCard";
import { createClient } from "@/lib/supabase/server";

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

export default async function SeatingPage() {
  const seatingOptions = await getSeatingOptions();
  return (
    <>
      {/* Hero */}
      <section className="bg-sage py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-serif text-4xl text-charcoal md:text-5xl">Seating Styles</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-charcoal/70">
            Choose from a variety of seating options to create the perfect atmosphere for your
            event. Mix and match styles or keep it consistent &mdash; we will help you design the
            ideal layout for your group.
          </p>
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
