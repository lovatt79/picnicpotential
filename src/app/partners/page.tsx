import type { Metadata } from "next";
import Link from "next/link";
import VendorCard from "@/components/VendorCard";
import { createClient } from "@/lib/supabase/server";
import { generateItemListSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Preferred Vendor Partners",
  description: "Our curated list of trusted local vendors for charcuterie, florals, desserts, balloons, photography and more.",
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
 * Determines whether a section should use 3 or 4 columns based on card count.
 * Rules:
 *  2 → 3-col (2 cards centered)
 *  3 → 3-col (1 full row)
 *  4 → 4-col (1 full row)
 *  5 → 3-col (3 + 2 centered)
 *  6 → 3-col (2 full rows)
 *  7 → 4-col (4 + 3 centered)
 *  8 → 4-col (2 full rows)
 *  9+ → generalized: prefer whichever avoids a single-card last row
 */
function getCardCols(count: number): 3 | 4 {
  if (count <= 3) return 3;
  if (count === 4) return 4;
  if (count <= 6) return 3;
  if (count <= 8) return 4;
  if (count === 9) return 3;
  // 10+: use 4-col unless remainder is 1 (single lonely card)
  if (count % 4 === 1) return 3;
  return 4;
}

/** Width class for each card wrapper based on columns (gap-6 = 24px) */
const cardWidth = {
  3: "w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]",
  4: "w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]",
} as const;

function addUTMTracking(url: string): string {
  if (!url) return url;
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set("utm_source", "picnicpotential");
    urlObj.searchParams.set("utm_medium", "partner_referral");
    return urlObj.toString();
  } catch {
    return url;
  }
}

async function getPartnerSections() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("partner_sections")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching partner sections:", error);
      return [];
    }
    return data || [];
  } catch {
    return [];
  }
}

async function getPartners() {
  try {
    const supabase = await createClient();
    const { data: partners, error } = await supabase
      .from("vendor_partners")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching partners:", error);
      return [];
    }

    // Fetch logos for partners
    const partnersWithLogos = await Promise.all(
      (partners || []).map(async (partner) => {
        let logoUrl = partner.logo_url;

        if (partner.logo_id) {
          const { data: imageData } = await supabase
            .from("media")
            .select("url")
            .eq("id", partner.logo_id)
            .single();
          if (imageData) {
            logoUrl = imageData.url;
          }
        }

        return {
          ...partner,
          logo: logoUrl,
          slug: slugify(partner.name),
        };
      })
    );

    return partnersWithLogos;
  } catch (error) {
    console.error("Error in getPartners:", error);
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

export default async function PartnersPage() {
  const [partners, sections, hero] = await Promise.all([
    getPartners(),
    getPartnerSections(),
    getPageHero("partners"),
  ]);

  // Generate schema markup
  const partnerListSchema = partners.length > 0 ? generateItemListSchema(partners, "partners") : null;

  // Group partners by section
  const uncategorizedPartners = partners.filter((p) => !p.section_id);
  const partnersBySection: Record<string, typeof partners> = {};
  for (const section of sections) {
    partnersBySection[section.id] = partners
      .filter((p) => p.section_id === section.id)
      .sort((a, b) => a.sort_order - b.sort_order);
  }

  // Background styles for sections
  const sectionBgStyles: Record<string, string> = {
    gold: "bg-white",
    sage: "bg-white",
    cream: "bg-cream",
  };

  const badgeBgStyles: Record<string, string> = {
    gold: "bg-gold/20 text-gold",
    sage: "bg-sage text-charcoal",
    cream: "bg-gold/20 text-gold",
  };

  return (
    <>
      {/* Schema.org structured data */}
      {partnerListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(partnerListSchema) }}
        />
      )}

      {/* Hero */}
      <section className={`relative overflow-hidden ${hero?.image_url ? '' : 'bg-sage'}`}>
        {hero?.image_url && (
          <div className="absolute inset-0">
            <img
              src={hero.image_url}
              alt={hero.title || "Picnic Potential partners"}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-charcoal/50" />
          </div>
        )}
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center">
          <h1 className={`font-serif text-4xl md:text-5xl ${hero?.image_url ? 'text-white' : 'text-charcoal'}`}>
            {hero?.title || "Preferred Vendor Partners"}
          </h1>
          {(hero?.description || !hero) && (
            <p className={`mx-auto mt-6 max-w-2xl text-lg ${hero?.image_url ? 'text-white/85' : 'text-charcoal/70'}`}>
              {hero?.description || "We work with an incredible network of local vendors to bring you the best experience possible."}
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

      {/* Uncategorized Partners (no section heading) */}
      {uncategorizedPartners.length > 0 && (() => {
        const cols = getCardCols(uncategorizedPartners.length);
        return (
          <section className="py-20">
            <div className="mx-auto max-w-6xl px-4">
              <div className="flex flex-wrap justify-center gap-6">
                {uncategorizedPartners.map((partner) => (
                  <div key={partner.id} className={cardWidth[cols]}>
                    <VendorCard
                      name={partner.name}
                      category={partner.category}
                      location={partner.location}
                      logo={partner.logo}
                      href={`/partners/${partner.slug}`}
                      url={partner.website || partner.url ? addUTMTracking(partner.website || partner.url || "") : undefined}
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
        const sectionPartners = partnersBySection[section.id] || [];
        if (sectionPartners.length === 0) return null;

        const cols = getCardCols(sectionPartners.length);
        const hasBg = (uncategorizedPartners.length > 0 ? index % 2 === 0 : index % 2 === 1);
        const bgClass = hasBg
          ? (sectionBgStyles[section.badge_style || "gold"] || "bg-white")
          : "";
        const badgeClass = badgeBgStyles[section.badge_style || "gold"] || "bg-gold/20 text-gold";

        return (
          <section key={section.id} className={`py-20 ${bgClass}`}>
            <div className="mx-auto max-w-6xl px-4">
              <div className="mx-auto max-w-3xl text-center">
                {section.badge_label && (
                  <div className={`inline-block rounded-full px-4 py-1 text-sm font-medium ${badgeClass}`}>
                    {section.badge_label}
                  </div>
                )}
                <h2 className="mt-4 font-serif text-3xl text-charcoal md:text-4xl">
                  {section.title}
                </h2>
                {section.description && (
                  <p className="mt-4 text-warm-gray">
                    {section.description}
                  </p>
                )}
              </div>
              <div className="mt-12 flex flex-wrap justify-center gap-6">
                {sectionPartners.map((partner) => (
                  <div key={partner.id} className={cardWidth[cols]}>
                    <VendorCard
                      name={partner.name}
                      category={partner.category}
                      location={partner.location}
                      logo={partner.logo}
                      href={`/partners/${partner.slug}`}
                      url={partner.website || partner.url ? addUTMTracking(partner.website || partner.url || "") : undefined}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Become a Partner Section */}
      <section className="bg-sage-light/50 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-serif text-2xl text-charcoal md:text-3xl">
            Interested in Partnering?
          </h2>
          <p className="mt-4 text-lg text-warm-gray">
            Are you a local business interested in partnering with Picnic Potential?
            We&apos;re always looking for exceptional vendors who share our commitment
            to quality and creating memorable experiences. Get in touch to learn more
            about our partnership opportunities.
          </p>
          <a
            href="mailto:info@picnicpotential.com?subject=Partnership%20Request"
            className="mt-8 inline-block rounded-full bg-charcoal px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-gold hover:text-charcoal"
          >
            Contact Us About Partnering
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-serif text-3xl text-charcoal">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-warm-gray">
            Mention any vendor preferences in your Service Request Form and we will coordinate everything.
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
