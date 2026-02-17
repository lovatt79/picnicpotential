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

  return {
    partner,
    partnerPage,
    galleryImages: galleryImagesData || [],
    partnerLogo,
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

  const { partner, partnerPage, galleryImages, partnerLogo } = data;

  const displayLogo = partnerLogo?.url || partner.logo_url;

  return (
    <>
      {/* Hero Section */}
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
      {partnerPage?.about_text && (
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-6">
              About {partner.name}
            </h2>
            <p className="text-lg leading-relaxed text-warm-gray whitespace-pre-line">
              {partnerPage.about_text}
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
      {(partnerPage?.contact_email || partnerPage?.contact_phone || partner.url) && (
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
              {partner.url && (
                <div className="flex items-center gap-3">
                  <span className="text-warm-gray">Website:</span>
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:underline"
                  >
                    {partner.url}
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

      {/* Related Partners */}
      <section className="py-20 bg-sage-light/20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal text-center mb-12">
            Explore Other Partners
          </h2>
          <div className="text-center">
            <Link
              href="/partners"
              className="inline-block rounded-full bg-charcoal px-8 py-3 text-base font-medium text-white transition-colors hover:bg-gold hover:text-charcoal"
            >
              View All Partners →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
