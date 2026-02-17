import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { generateProductSchema, generateBreadcrumbSchema } from "@/lib/schema";

interface SeatingPageProps {
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

async function getSeatingOption(slug: string) {
  const supabase = await createClient();

  // Fetch the seating option
  const { data: seatingOptions, error: seatingError } = await supabase
    .from("seating_options")
    .select("*")
    .eq("is_published", true);

  if (seatingError || !seatingOptions) {
    return null;
  }

  // Find by slug (generated from title)
  const seatingOption = seatingOptions.find(
    (option) => slugify(option.title) === slug
  );

  if (!seatingOption) {
    return null;
  }

  // Fetch the seating page content
  const { data: seatingPage } = await supabase
    .from("seating_pages")
    .select("*")
    .eq("seating_option_id", seatingOption.id)
    .single();

  // Fetch gallery images
  const { data: galleryImagesData } = await supabase
    .from("seating_gallery_images")
    .select("*, image:media(url, alt_text)")
    .eq("seating_page_id", seatingPage?.id)
    .order("sort_order", { ascending: true });

  // Fetch the main seating image
  let seatingImage = null;
  if (seatingOption.image_id) {
    const { data: imageData } = await supabase
      .from("media")
      .select("url")
      .eq("id", seatingOption.image_id)
      .single();
    seatingImage = imageData;
  }

  return {
    seatingOption,
    seatingPage,
    galleryImages: galleryImagesData || [],
    seatingImage,
  };
}

export async function generateMetadata({ params }: SeatingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getSeatingOption(slug);

  if (!data) {
    return {
      title: "Seating Option Not Found",
    };
  }

  return {
    title: data.seatingOption.title,
    description: data.seatingOption.description || `Learn more about our ${data.seatingOption.title} seating option`,
  };
}

export default async function SeatingDetailPage({ params }: SeatingPageProps) {
  const { slug } = await params;
  const data = await getSeatingOption(slug);

  if (!data) {
    notFound();
  }

  const { seatingOption, seatingPage, galleryImages, seatingImage } = data;

  const gradients = [
    "from-blush to-peach-light",
    "from-lavender-light to-sky-light",
    "from-peach-light to-blush-light",
    "from-sky-light to-sage-light",
  ];
  const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

  const displayImage = seatingImage?.url || seatingOption.image_url;

  // Generate schema markup
  const productSchema = generateProductSchema({
    title: seatingOption.title,
    description: seatingOption.description,
    slug,
    image: displayImage
  });
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Seating Styles", url: "/seating" },
    { name: seatingOption.title }
  ]);

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {displayImage ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${displayImage})` }}
            />
            <div className="absolute inset-0 bg-black/40" />
          </>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${randomGradient}`} />
        )}

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            {seatingOption.title}
          </h1>
          {(seatingPage?.hero_subtitle || seatingOption.description) && (
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {seatingPage?.hero_subtitle || seatingOption.description}
            </p>
          )}
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
            <Link href="/seating" className="text-warm-gray hover:text-charcoal">
              Seating Options
            </Link>
            <span className="text-warm-gray">›</span>
            <span className="text-charcoal">{seatingOption.title}</span>
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {seatingOption.description && (
            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed text-warm-gray whitespace-pre-line">
                {seatingOption.description}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features/Details Section */}
      {seatingPage?.features_text && (
        <section className="py-20 bg-sage-light/30">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-6">
              Details
            </h2>
            <p className="text-lg leading-relaxed text-warm-gray whitespace-pre-line">
              {seatingPage.features_text}
            </p>
          </div>
        </section>
      )}

      {/* Pricing Info */}
      {seatingPage?.pricing_info && (
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-6">
              Pricing
            </h2>
            <p className="text-lg leading-relaxed text-warm-gray whitespace-pre-line">
              {seatingPage.pricing_info}
            </p>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {galleryImages.length > 0 && (
        <section className="py-20 bg-sage-light/30">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal text-center mb-12">
              {seatingPage?.gallery_section_title || "Gallery"}
            </h2>
            {seatingPage?.gallery_section_description && (
              <p className="text-lg text-warm-gray text-center max-w-2xl mx-auto mb-12">
                {seatingPage.gallery_section_description}
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
            {seatingPage?.cta_title || "Interested in This Seating Style?"}
          </h2>
          <p className="text-lg text-warm-gray mb-8">
            {seatingPage?.cta_description ||
              "Fill out our request form and we'll get back to you with pricing and availability."}
          </p>
          <Link
            href={seatingPage?.cta_button_link || "/request"}
            className="inline-block rounded-full bg-gold px-10 py-4 text-lg font-medium text-charcoal transition-colors hover:bg-gold-light"
          >
            {seatingPage?.cta_button_text || "Get a Quote"}
          </Link>
        </div>
      </section>

      {/* Related Seating Options */}
      <section className="py-20 bg-sage-light/20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal text-center mb-12">
            Explore Other Seating Options
          </h2>
          <div className="text-center">
            <Link
              href="/seating"
              className="inline-block rounded-full bg-charcoal px-8 py-3 text-base font-medium text-white transition-colors hover:bg-gold hover:text-charcoal"
            >
              View All Seating Styles →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
