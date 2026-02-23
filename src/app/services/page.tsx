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
  const services = await getServices();
  const hero = await getPageHero("services");
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
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-serif text-3xl text-charcoal md:text-4xl">Luxury Picnics</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Private Celebrations",
                description: "Birthdays, anniversaries, and special moments",
                href: "https://photos.app.goo.gl/ckg8ty5i3wTcK1yn6",
                image: "https://lh3.googleusercontent.com/pw/AP1GczPuXdFbKwYzagu-IKeAIeEsanOwQkNvLSwinT2L-6mh9eI6zkHXIig_uCwo0JAYtierc_czBxFsTdA5ibP6y3NQxuurn-uu4V4ziU4_BCvlx9HIwzXfV9oX5W84K0BDAo3d0z1L2RyiwKNGns5FSb69iA=w1881-h1148-s-no-gm?authuser=0",
              },
              {
                title: "Kids Parties",
                description: "Fun and memorable celebrations for little ones",
                href: "https://photos.app.goo.gl/zsd37wuZoJiV8HQV8",
                image: "https://lh3.googleusercontent.com/pw/AP1GczOXfylvUluOyDLhhDAUsOWf-Mp8sJH-mzYCXlw9Ckgzu8j-Qm8Dps6Tirhzfeopk837-Mx69cvq6XEH3WoAj-wB_qB5IQcs31ajQsTQaq53yrZHTh-Dt5VcCA4xjX0niidSSUKC3Ov2bpPO5ECaOcst1g=w765-h1148-s-no-gm?authuser=0",
              },
              {
                title: "Corporate & Community Events",
                description: "Team building and community gatherings",
                href: "https://photos.app.goo.gl/zK1ZD3MfkkGAVt6K6",
                image: "https://lh3.googleusercontent.com/pw/AP1GczOgsRfZKy8oSfSGTqa0zgAI-664oWPmigXvt3Ij4kuIsDU7X69WeIKsUK6Le1NJIXAzglEK5yJGuuO6zAfHgiKF6cJJrqR444fvTYaOXWi9DVtHD0G4_1BEhom7SzYCs2PB_Yqb_nTJvCd6PIqISphoOg=w1722-h1148-s-no-gm?authuser=0",
              },
              {
                title: "Wedding Related Celebrations",
                description: "Let\u2019s Create Something Beautiful Together",
                href: "https://photos.app.goo.gl/TpqVG2rkcuFigHBd9",
                image: "https://lh3.googleusercontent.com/pw/AP1GczPYHxsBNZW5cPhavmFmIpqryvf7zSeVPpwT2ReHUINXB9qQt7woQB3PTzeKpBZahWfaLmHGCmBMO5Vn8-qEbMZMELQujg1XeNIo1sCFc8h43e32HhOiMaIzkC-y3gcJeVFev1t1PhXjuLaODHehvXJcFQ=w1560-h1148-s-no-gm?authuser=0",
              },
            ].map((category) => (
              <a
                key={category.title}
                href={category.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-lg text-charcoal">{category.title}</h3>
                  <p className="mt-1 text-sm text-warm-gray">{category.description}</p>
                </div>
              </a>
            ))}
          </div>
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
