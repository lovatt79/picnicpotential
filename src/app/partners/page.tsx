import type { Metadata } from "next";
import Link from "next/link";
import VendorCard from "@/components/VendorCard";
import { createClient } from "@/lib/supabase/server";

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

async function getPartners() {
  try {
    const supabase = await createClient();
    const { data: partners, error } = await supabase
      .from("vendor_partners")
      .select("*")
      .eq("is_published", true)
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching partners:", error);
      return { vipPartners: [], preferredPartners: [] };
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

    // Split into VIP, Preferred, and Winery
    const vipPartners = partnersWithLogos.filter(p => p.partner_type === "VIP");
    const preferredPartners = partnersWithLogos.filter(p => p.partner_type === "Preferred");
    const wineryPartners = partnersWithLogos.filter(p => p.partner_type === "Winery");

    return { vipPartners, preferredPartners, wineryPartners };
  } catch (error) {
    console.error("Error in getPartners:", error);
    return { vipPartners: [], preferredPartners: [], wineryPartners: [] };
  }
}

export default async function PartnersPage() {
  const { vipPartners, preferredPartners, wineryPartners } = await getPartners();

  return (
    <>
      {/* Hero */}
      <section className="bg-sage py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-serif text-4xl text-charcoal md:text-5xl">
            Preferred Vendor Partners
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-charcoal/70">
            We work with an incredible network of local vendors to bring you the best
            experience possible.
          </p>
        </div>
      </section>

      {/* VIP Partners */}
      {vipPartners.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-block rounded-full bg-gold/20 px-4 py-1 text-sm font-medium text-gold">
                VIP Partners
              </div>
              <h2 className="mt-4 font-serif text-3xl text-charcoal md:text-4xl">
                Our VIP Partners
              </h2>
              <p className="mt-4 text-warm-gray">
                These are the vendors that offer the charcuterie, flowers and baked goods you see
                on our order form. When you request these items on the Service Request Form you
                do not need to contact them &mdash; we handle all orders, coordination, set up and
                pick up.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {vipPartners.map((partner) => (
                <VendorCard
                  key={partner.id}
                  name={partner.name}
                  category={partner.category}
                  location={partner.location}
                  logo={partner.logo}
                  href={`/partners/${partner.slug}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Preferred Partners */}
      {preferredPartners.length > 0 && (
        <section className="bg-white py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-block rounded-full bg-sage px-4 py-1 text-sm font-medium text-charcoal">
                Preferred Partners
              </div>
              <h2 className="mt-4 font-serif text-3xl text-charcoal md:text-4xl">
                Our Preferred Partners
              </h2>
              <p className="mt-4 text-warm-gray">
                This is a curated list of local vendors who provide a superb level of service
                and we are happy to refer you to them. If you are interested in any of these
                services you can add it to the notes section of the Service Request Form and we
                will put you in touch with our contact at these businesses to arrange services.
                When needed, we are happy to jump in and communicate regarding the day of
                deliveries and pick ups.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {preferredPartners.map((partner) => (
                <VendorCard
                  key={partner.id}
                  name={partner.name}
                  category={partner.category}
                  location={partner.location}
                  logo={partner.logo}
                  href={`/partners/${partner.slug}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Winery Partners */}
      {wineryPartners.length > 0 && (
        <section className="bg-cream py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-block rounded-full bg-gold/20 px-4 py-1 text-sm font-medium text-gold">
                Winery Partners
              </div>
              <h2 className="mt-4 font-serif text-3xl text-charcoal md:text-4xl">
                Our Winery Partners
              </h2>
              <p className="mt-4 text-warm-gray">
                We partner with exceptional wineries throughout Sonoma County to create
                unforgettable experiences. Each location offers unique settings perfect for
                picnics, events, and celebrations.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wineryPartners.map((partner) => (
                <VendorCard
                  key={partner.id}
                  name={partner.name}
                  category={partner.category}
                  location={partner.location}
                  logo={partner.logo}
                  href={`/partners/${partner.slug}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

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
