import Link from "next/link";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import { createClient } from "@/lib/supabase/server";
import { generateOrganizationSchema } from "@/lib/schema";

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
const sectionCardWidth = {
  3: "w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)]",
  4: "w-full md:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]",
} as const;

async function getServiceSections() {
  try {
    const supabase = await createClient();
    const { data: sections, error } = await supabase
      .from("service_sections")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching service sections:", error);
      return [];
    }

    // Resolve images from media table
    const sectionsWithImages = await Promise.all(
      (sections || []).map(async (section) => {
        let imageUrl = section.image_url;

        if (section.image_id) {
          const { data: imageData } = await supabase
            .from("media")
            .select("url")
            .eq("id", section.image_id)
            .single();
          if (imageData) {
            imageUrl = imageData.url;
          }
        }

        return {
          ...section,
          image: imageUrl,
          slug: slugify(section.title),
        };
      })
    );

    return sectionsWithImages;
  } catch (error) {
    console.error("Error in getServiceSections:", error);
    return [];
  }
}

async function getHomepageContent() {
  try {
    const supabase = await createClient();

    // First get the homepage content
    const { data: contentData, error: contentError } = await supabase
      .from("homepage_content")
      .select("*")
      .single();

    if (contentError) {
      console.error("Error fetching homepage content:", contentError);
      return null;
    }

    // Then fetch the related images if they exist
    let heroImage = null;
    let aboutImage = null;

    if (contentData.hero_image_id) {
      const { data: heroData } = await supabase
        .from("media")
        .select("url")
        .eq("id", contentData.hero_image_id)
        .single();
      heroImage = heroData;
    }

    if (contentData.about_preview_image_id) {
      const { data: aboutData } = await supabase
        .from("media")
        .select("url")
        .eq("id", contentData.about_preview_image_id)
        .single();
      aboutImage = aboutData;
    }

    return {
      ...contentData,
      hero_image: heroImage,
      about_image: aboutImage,
    };
  } catch (error) {
    console.error("Error in getHomepageContent:", error);
    return null;
  }
}

export default async function Home() {
  const [content, serviceSections] = await Promise.all([
    getHomepageContent(),
    getServiceSections(),
  ]);

  // Fallback to default values if database content not available
  const heroTitle = content?.hero_title || "Picnic Potential";
  const heroSubtitle = content?.hero_subtitle || "Luxury Picnics & Events in Sonoma County";
  const heroDescription = content?.hero_description || "A truly unique picnic and event experience that comes in a variety of styles that fit any occasion";
  const heroCTAText = content?.hero_cta_text || "Book Your Experience";
  const heroCTALink = content?.hero_cta_link || "/request";

  const featuredTitle = content?.featured_title || "Why Choose Picnic Potential";
  const featuredSubtitle = content?.featured_subtitle;

  const aboutPreviewTitle = content?.about_preview_title || "Sit Back, Relax & We'll Take Care of the Rest";
  const aboutPreviewText = content?.about_preview_text || "Enjoy every minute of your date night, birthday, anniversary or just an afternoon with friends. Don't waste another moment with the prep or clean up — leave that to us. From intimate gatherings to grand celebrations, we create experiences that are as unique as the moments they celebrate.";

  const ctaTitle = content?.cta_title || "Ready to Create Something Beautiful?";
  const ctaSubtitle = content?.cta_subtitle || "Fill out our Service Request Form and we'll respond with pricing and details based on your selections.";
  const ctaButtonText = content?.cta_button_text || "Book Your Picnic or Event";
  const ctaButtonLink = content?.cta_button_link || "/request";

  // Generate schema markup
  const organizationSchema = generateOrganizationSchema();

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {/* Service sections schema is on the /services page */}
      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
        {/* Background - uploaded image or gradient fallback */}
        {content?.hero_image?.url ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${content.hero_image.url})` }}
            />
            <div className="absolute inset-0 bg-black/40" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-sage via-blush-light to-peach-light" />
            <div className="absolute inset-0 bg-black/20" />
          </>
        )}
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
          <h1 className="font-serif text-5xl leading-tight md:text-7xl">
            {heroTitle}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed md:text-xl">
            {heroSubtitle}
          </p>
          {heroDescription && (
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed opacity-90">
              {heroDescription}
            </p>
          )}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href={heroCTALink}
              className="rounded-full bg-gold px-8 py-3.5 text-base font-medium text-charcoal transition-colors hover:bg-gold-light"
            >
              {heroCTAText}
            </Link>
            <Link
              href="/services"
              className="rounded-full border-2 border-white px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-white hover:text-charcoal"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview / Intro Section */}
      {aboutPreviewText && (
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="font-serif text-3xl text-charcoal md:text-4xl">
              {aboutPreviewTitle}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-warm-gray whitespace-pre-line">
              {aboutPreviewText}
            </p>
          </div>
        </section>
      )}

      {/* Services Sections */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="font-serif text-3xl text-charcoal md:text-4xl">Our Services</h2>
            <p className="mx-auto mt-4 max-w-2xl text-warm-gray">
              From luxury picnics to elegant tablescapes, we offer a full range of services
              to make your event unforgettable.
            </p>
          </div>
          {(() => {
            const cols = getCardCols(serviceSections.length);
            return (
              <div className="mt-12 flex flex-wrap justify-center gap-8">
                {serviceSections.map((section) => (
                  <Link
                    key={section.id}
                    href={`/services#${section.slug}`}
                    className={`group block ${sectionCardWidth[cols]}`}
                  >
                    <div className="h-full overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-lg">
                      <div className="aspect-[4/3] overflow-hidden">
                        {section.image ? (
                          <div
                            className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                            style={{ backgroundImage: `url(${section.image})` }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sage-light to-peach-light">
                            <span className="font-serif text-lg text-charcoal/50">{section.title}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="font-serif text-xl text-charcoal">{section.title}</h3>
                        {section.description && (
                          <p className="mt-2 text-sm leading-relaxed text-warm-gray">{section.description}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            );
          })()}
          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-block rounded-full bg-charcoal px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-gold"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section / How It Works */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl text-charcoal md:text-4xl">
              {featuredTitle}
            </h2>
            {featuredSubtitle && (
              <p className="mt-4 text-lg text-warm-gray">{featuredSubtitle}</p>
            )}
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Inquiry",
                description:
                  "Fill out our Service Request Form with your event details, preferences, and vision.",
              },
              {
                step: "02",
                title: "Design",
                description:
                  "We respond with pricing and a customized plan tailored to your selections and style.",
              },
              {
                step: "03",
                title: "Execute",
                description:
                  "We handle all setup and cleanup so you can enjoy every moment of your special event.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-peach-light to-blush">
                  <span className="font-serif text-xl text-charcoal">{item.step}</span>
                </div>
                <h3 className="mt-6 font-serif text-xl text-charcoal">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-warm-gray">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialCarousel />

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-serif text-3xl text-charcoal md:text-4xl">
            {ctaTitle}
          </h2>
          <p className="mt-6 text-lg text-warm-gray">
            {ctaSubtitle}
          </p>
          <Link
            href={ctaButtonLink}
            className="mt-8 inline-block rounded-full bg-gold px-10 py-4 text-lg font-medium text-charcoal transition-colors hover:bg-gold-light"
          >
            {ctaButtonText}
          </Link>
        </div>
      </section>
    </>
  );
}
