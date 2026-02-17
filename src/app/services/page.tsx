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

async function getLuxuryPicnicCategories() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("luxury_picnic_categories")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching luxury picnic categories:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getLuxuryPicnicCategories:", error);
    return [];
  }
}

async function getServicesPageSections() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("services_page_sections")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching services page sections:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getServicesPageSections:", error);
    return [];
  }
}

async function getCorporatePartners() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("corporate_partners")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching corporate partners:", error);
      return [];
    }

    // Fetch logo URLs
    const partnersWithLogos = await Promise.all(
      (data || []).map(async (partner) => {
        let logoUrl = partner.logo_url;
        if (partner.logo_id) {
          const { data: imageData } = await supabase
            .from("media")
            .select("url")
            .eq("id", partner.logo_id)
            .single();
          if (imageData) logoUrl = imageData.url;
        }
        return { ...partner, logo_url: logoUrl };
      })
    );

    return partnersWithLogos;
  } catch (error) {
    console.error("Error in getCorporatePartners:", error);
    return [];
  }
}

async function getWineryPartners() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("vendor_partners")
      .select("*")
      .eq("is_published", true)
      .eq("partner_type", "Winery")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching winery partners:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getWineryPartners:", error);
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getServices();
  const luxuryCategories = await getLuxuryPicnicCategories();
  const sections = await getServicesPageSections();
  const corporatePartners = await getCorporatePartners();
  const wineryPartners = await getWineryPartners();

  // Organize sections by key for easy access
  const sectionsByKey = sections.reduce((acc: any, section) => {
    acc[section.section_key] = section;
    return acc;
  }, {});

  // Generate schema markup
  const serviceListSchema = services.length > 0 ? generateItemListSchema(services, "services") : null;

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
      <section className="bg-sage py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-serif text-4xl text-charcoal md:text-5xl">Our Services</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-charcoal/70">
            To book any of our services please fill out the Services Request Form. Upon receipt
            we will respond with pricing and details based on your selections. If there is
            something you are looking for that you do not see on the form or information you
            want us to know, please add it to the notes section at the bottom of the form.
          </p>
          <Link
            href="/request"
            className="mt-8 inline-block rounded-full bg-gold px-8 py-3.5 text-base font-medium text-charcoal transition-colors hover:bg-gold-light"
          >
            Fill Out Our Services Request Form
          </Link>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service.slug}
                title={service.title}
                description={service.description}
                image={service.image}
                href={`/services/${service.slug}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Picnics Detail */}
      {luxuryCategories.length > 0 && (
        <section className="bg-white py-20">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="font-serif text-3xl text-charcoal md:text-4xl">Luxury Picnics</h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {luxuryCategories.map((category) => (
                <div key={category.id} className="group overflow-hidden rounded-2xl bg-white shadow-sm">
                  <div className="aspect-square overflow-hidden">
                    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${category.gradient_class}`}>
                      <span className="font-serif text-sm text-charcoal/50 text-center px-2">{category.title}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-lg text-charcoal">{category.title}</h3>
                    <p className="mt-1 text-sm text-warm-gray">{category.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Community Event Seating */}
      {sectionsByKey.community_seating && (
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="font-serif text-3xl text-charcoal md:text-4xl">{sectionsByKey.community_seating.title}</h2>
            <p className="mt-6 text-lg leading-relaxed text-warm-gray whitespace-pre-line">
              {sectionsByKey.community_seating.content}
            </p>
            {sectionsByKey.community_seating.link_text && sectionsByKey.community_seating.link_url && (
              <Link
                href={sectionsByKey.community_seating.link_url}
                className="mt-6 inline-block text-gold font-medium hover:underline"
              >
                {sectionsByKey.community_seating.link_text}
              </Link>
            )}
          </div>
        </section>
      )}

      {/* Corporate Events */}
      {sectionsByKey.corporate_events && (
        <section className="bg-white py-20">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="font-serif text-3xl text-charcoal md:text-4xl">{sectionsByKey.corporate_events.title}</h2>
            <p className="mt-6 text-lg leading-relaxed text-warm-gray whitespace-pre-line">
              {sectionsByKey.corporate_events.content}
            </p>
            {sectionsByKey.corporate_events.link_text && sectionsByKey.corporate_events.link_url && (
              <Link
                href={sectionsByKey.corporate_events.link_url}
                className="mt-6 inline-block text-gold font-medium hover:underline"
              >
                {sectionsByKey.corporate_events.link_text}
              </Link>
            )}
          </div>
        </section>
      )}

      {/* Tablescapes */}
      {sectionsByKey.tablescapes && (
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="font-serif text-3xl text-charcoal md:text-4xl">{sectionsByKey.tablescapes.title}</h2>
            <p className="mt-6 text-lg leading-relaxed text-warm-gray whitespace-pre-line">
              {sectionsByKey.tablescapes.content}
            </p>
            {sectionsByKey.tablescapes.link_text && sectionsByKey.tablescapes.link_url && (
              <Link
                href={sectionsByKey.tablescapes.link_url}
                className="mt-6 inline-block text-gold font-medium hover:underline"
              >
                {sectionsByKey.tablescapes.link_text}
              </Link>
            )}
          </div>
        </section>
      )}

      {/* Proposals */}
      {sectionsByKey.proposals && (
        <section className="bg-white py-20">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="font-serif text-3xl text-charcoal md:text-4xl">{sectionsByKey.proposals.title}</h2>
            <p className="mt-6 text-lg leading-relaxed text-warm-gray whitespace-pre-line">
              {sectionsByKey.proposals.content}
            </p>
            {sectionsByKey.proposals.link_text && sectionsByKey.proposals.link_url && (
              <Link
                href={sectionsByKey.proposals.link_url}
                className="mt-6 inline-block text-gold font-medium hover:underline"
              >
                {sectionsByKey.proposals.link_text}
              </Link>
            )}
          </div>
        </section>
      )}

      {/* Wedding Suite */}
      {sectionsByKey.wedding_suite && (
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4">
            <h2 className="font-serif text-3xl text-charcoal md:text-4xl">
              {sectionsByKey.wedding_suite.title}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-warm-gray whitespace-pre-line">
              {sectionsByKey.wedding_suite.content}
            </p>
            {sectionsByKey.wedding_suite.link_text && sectionsByKey.wedding_suite.link_url && (
              <Link
                href={sectionsByKey.wedding_suite.link_url}
                className="mt-6 inline-block rounded-full bg-charcoal px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-gold"
              >
                {sectionsByKey.wedding_suite.link_text}
              </Link>
            )}
          </div>
        </section>
      )}

      {/* Rentals */}
      {sectionsByKey.rentals && (
        <section className="bg-sage-light/50 py-20">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="font-serif text-3xl text-charcoal md:text-4xl">
              {sectionsByKey.rentals.title}
            </h2>
            <div className="mx-auto mt-4 inline-block rounded-full bg-gold/20 px-4 py-1 text-sm font-medium text-gold">
              Coming Spring 2026
            </div>
            <p className="mt-6 text-lg text-warm-gray whitespace-pre-line">
              {sectionsByKey.rentals.content}
            </p>
            {sectionsByKey.rentals.link_text && sectionsByKey.rentals.link_url && (
              <Link
                href={sectionsByKey.rentals.link_url}
                className="mt-6 inline-block text-gold font-medium hover:underline"
              >
                {sectionsByKey.rentals.link_text}
              </Link>
            )}
          </div>
        </section>
      )}

      {/* Corporate & Winery Partners */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-serif text-3xl text-charcoal md:text-4xl">
            Our Corporate &amp; Winery Partners
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-warm-gray">
            We are proud to partner with some of Sonoma County&apos;s finest wineries and businesses.
          </p>

          {/* Corporate Partners */}
          {corporatePartners.length > 0 && (
            <div className="mt-12">
              <h3 className="text-center text-sm font-semibold uppercase tracking-wider text-warm-gray">
                Corporate Partners
              </h3>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-8">
                {corporatePartners.map((partner) => (
                  <div
                    key={partner.id}
                    className="flex h-20 w-32 items-center justify-center rounded-lg bg-sage-light p-2"
                  >
                    {partner.logo_url ? (
                      <img
                        src={partner.logo_url}
                        alt={partner.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-xs text-sage-dark text-center">{partner.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Winery Partners */}
          {wineryPartners.length > 0 && (
            <div className="mt-16">
              <h3 className="text-center text-sm font-semibold uppercase tracking-wider text-warm-gray">
                Winery Partners
              </h3>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-8">
                {wineryPartners.map((winery) => (
                  <div
                    key={winery.id}
                    className="flex h-20 items-center justify-center rounded-lg bg-sage-light px-6"
                  >
                    <span className="text-sm font-medium text-charcoal">{winery.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

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
