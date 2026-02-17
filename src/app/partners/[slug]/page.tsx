import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

interface PartnerPageProps {
  params: Promise<{ slug: string }>;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function addUTMTracking(url: string): string {
  if (!url) return url;

  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set("utm_source", "picnicpotential");
    urlObj.searchParams.set("utm_medium", "partner_referral");
    return urlObj.toString();
  } catch {
    // If URL is invalid, return as-is
    return url;
  }
}

async function getPartner(slug: string) {
  const supabase = await createClient();

  // Fetch all partners
  const { data: partners, error: partnersError } = await supabase
    .from("vendor_partners")
    .select("*")
    .eq("is_published", true);

  if (partnersError || !partners) {
    return null;
  }

  // Find by slug (generated from name)
  const partner = partners.find(
    (p) => slugify(p.name) === slug
  );

  if (!partner) {
    return null;
  }

  // Fetch the partner page content
  const { data: partnerPage } = await supabase
    .from("partner_pages")
    .select("*")
    .eq("partner_id", partner.id)
    .single();

  // Fetch gallery images
  const { data: galleryImagesData } = await supabase
    .from("partner_gallery_images")
    .select("*, image:media(url, alt_text)")
    .eq("partner_page_id", partnerPage?.id)
    .order("sort_order", { ascending: true });

  // Fetch the partner logo
  let partnerLogo = null;
  if (partner.logo_id) {
    const { data: imageData } = await supabase
      .from("media")
      .select("url")
      .eq("id", partner.logo_id)
      .single();
    partnerLogo = imageData;
  }

  // Fetch the hero image
  let heroImage = null;
  if (partnerPage?.hero_image_id) {
    const { data: heroImageData } = await supabase
      .from("media")
      .select("url")
      .eq("id", partnerPage.hero_image_id)
      .single();
    heroImage = heroImageData;
  }

  return {
    partner,
    partnerPage,
    galleryImages: galleryImagesData || [],
    partnerLogo,
    heroImage,
  };
}

export async function generateMetadata({ params }: PartnerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPartner(slug);

  if (!data) {
    return {
      title: "Partner Not Found",
    };
  }

  return {
    title: data.partner.name,
    description: `Learn more about ${data.partner.name}, one of our trusted ${data.partner.partner_type} partners.`,
  };
}

export default async function PartnerDetailPage({ params }: PartnerPageProps) {
  const { slug } = await params;
  const data = await getPartner(slug);

  if (!data) {
    notFound();
  }

  const { partner, partnerPage, galleryImages, partnerLogo, heroImage } = data;

  const displayLogo = partnerLogo?.url || partner.logo_url;
  const displayHeroImage = heroImage?.url;

  return (
    <>
      {/* Hero Section */}
      {displayHeroImage ? (
        <section className="relative h-[400px] md:h-[500px]">
          <div className="absolute inset-0">
            <img
              src={displayHeroImage}
              alt={partner.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-charcoal/20 to-charcoal/60"></div>
          </div>
          <div className="relative mx-auto max-w-4xl px-4 h-full flex flex-col justify-center text-center">
            {displayLogo && (
              <div className="mb-8 flex justify-center">
                <div className="bg-white rounded-xl p-6 shadow-md max-w-xs">
                  <img
                    src={displayLogo}
                    alt={partner.name}
                    className="max-h-32 w-full object-contain"
                  />
                </div>
              </div>
            )}
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-4 drop-shadow-lg">
              {partner.name}
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm flex-wrap">
              <span className="px-4 py-2 rounded-full bg-gold/90 text-charcoal font-medium shadow-md">
                {partner.partner_type} Partner
              </span>
              {partner.category && (
                <span className="px-4 py-2 rounded-full bg-white/90 text-charcoal shadow-md">
                  {partner.category}
                </span>
              )}
              {partner.location && (
                <span className="text-white drop-shadow-md">📍 {partner.location}</span>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-sage py-20">
          <div className="mx-auto max-w-4xl px-4 text-center">
            {displayLogo && (
              <div className="mb-8 flex justify-center">
                <div className="bg-white rounded-xl p-6 shadow-md max-w-xs">
                  <img
                    src={displayLogo}
                    alt={partner.name}
                    className="max-h-32 w-full object-contain"
                  />
                </div>
              </div>
            )}
            <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">
              {partner.name}
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm">
              <span className="px-4 py-2 rounded-full bg-gold/20 text-gold font-medium">
                {partner.partner_type} Partner
              </span>
              {partner.category && (
                <span className="px-4 py-2 rounded-full bg-charcoal/10 text-charcoal">
                  {partner.category}
                </span>
              )}
              {partner.location && (
                <span className="text-warm-gray">📍 {partner.location}</span>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Breadcrumb */}
      <section className="bg-white py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-warm-gray hover:text-charcoal">
              Home
            </Link>
            <span className="text-warm-gray">›</span>
            <Link href="/partners" className="text-warm-gray hover:text-charcoal">
              Partners
            </Link>
            <span className="text-warm-gray">›</span>
            <span className="text-charcoal">{partner.name}</span>
          </nav>
        </div>
      </section>

      {/* About Section */}
      {partner.description && (
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-6">
              About {partner.name}
            </h2>
            <p className="text-lg leading-relaxed text-warm-gray whitespace-pre-line">
              {partner.description}
            </p>
          </div>
        </section>
      )}

      {/* Services Offered */}
      {partnerPage?.services_offered && (
        <section className="py-20 bg-sage-light/30">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-6">
              Services Offered
            </h2>
            <p className="text-lg leading-relaxed text-warm-gray whitespace-pre-line">
              {partnerPage.services_offered}
            </p>
          </div>
        </section>
      )}

      {/* Contact Information */}
      {(partnerPage?.contact_email || partnerPage?.contact_phone || partner.website || partner.instagram) && (
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-6">
              Contact Information
            </h2>
            <div className="space-y-4">
              {partnerPage?.contact_email && (
                <div className="flex items-center gap-3">
                  <span className="text-warm-gray">Email:</span>
                  <a
                    href={`mailto:${partnerPage.contact_email}`}
                    className="text-gold hover:underline"
                  >
                    {partnerPage.contact_email}
                  </a>
                </div>
              )}
              {partnerPage?.contact_phone && (
                <div className="flex items-center gap-3">
                  <span className="text-warm-gray">Phone:</span>
                  <a
                    href={`tel:${partnerPage.contact_phone}`}
                    className="text-gold hover:underline"
                  >
                    {partnerPage.contact_phone}
                  </a>
                </div>
              )}
              {partner.website && (
                <div className="flex items-center gap-3">
                  <span className="text-warm-gray">Website:</span>
                  <a
                    href={addUTMTracking(partner.website)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:underline"
                  >
                    {partner.website}
                  </a>
                </div>
              )}
              {partner.instagram && (
                <div className="flex items-center gap-3">
                  <span className="text-warm-gray">Instagram:</span>
                  <a
                    href={addUTMTracking(partner.instagram)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:underline"
                  >
                    {partner.instagram}
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {galleryImages.length > 0 && (
        <section className="py-20 bg-sage-light/30">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal text-center mb-12">
              {partnerPage?.gallery_section_title || "Gallery"}
            </h2>
            {partnerPage?.gallery_section_description && (
              <p className="text-lg text-warm-gray text-center max-w-2xl mx-auto mb-12">
                {partnerPage.gallery_section_description}
              </p>
            )}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {galleryImages.map((item: any) => (
                <div key={item.id} className="group overflow-hidden rounded-xl shadow-md">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image?.url}
                      alt={item.image?.alt_text || item.caption || "Gallery image"}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  {item.caption && (
                    <div className="bg-white p-4">
                      <p className="text-sm text-warm-gray">{item.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-6">
            Ready to Work Together?
          </h2>
          <p className="text-lg text-warm-gray mb-8">
            Fill out our request form and we'll coordinate with {partner.name} to create
            the perfect experience for your event.
          </p>
          <Link
            href="/request"
            className="inline-block rounded-full bg-gold px-10 py-4 text-lg font-medium text-charcoal transition-colors hover:bg-gold-light"
          >
            Request Services
          </Link>
        </div>
      </section>
    </>
  );
}
