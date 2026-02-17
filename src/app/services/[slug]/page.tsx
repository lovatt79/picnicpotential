import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

function getIconEmoji(icon: string): string {
  const iconMap: Record<string, string> = {
    check: "✓",
    star: "⭐",
    sparkles: "✨",
    heart: "❤️",
    truck: "🚚",
    camera: "📷",
    cake: "🎂",
    gift: "🎁",
    music: "🎵",
    palette: "🎨",
  };
  return iconMap[icon] || "✓";
}

async function getService(slug: string) {
  const supabase = await createClient();

  // Fetch the service
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (serviceError || !service) {
    return null;
  }

  // Fetch the service page content
  const { data: servicePage } = await supabase
    .from("service_pages")
    .select("*")
    .eq("service_id", service.id)
    .single();

  // Fetch features for "What's Included" section
  const { data: features } = await supabase
    .from("service_features")
    .select("*")
    .eq("service_page_id", servicePage?.id)
    .order("sort_order", { ascending: true });

  // Fetch gallery images
  const { data: galleryImagesData } = await supabase
    .from("service_gallery_images")
    .select("*, image:media(url, alt_text)")
    .eq("service_page_id", servicePage?.id)
    .order("sort_order", { ascending: true });

  // Fetch the service card image
  let serviceImage = null;
  if (service.image_id) {
    const { data: imageData } = await supabase
      .from("media")
      .select("url")
      .eq("id", service.image_id)
      .single();
    serviceImage = imageData;
  }

  // Fetch hero image if different from service image
  let heroImage = null;
  if (servicePage?.hero_image_id) {
    const { data: imageData } = await supabase
      .from("media")
      .select("url")
      .eq("id", servicePage.hero_image_id)
      .single();
    heroImage = imageData;
  }

  return {
    service,
    servicePage,
    features: features || [],
    galleryImages: galleryImagesData || [],
    serviceImage,
    heroImage,
  };
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getService(slug);

  if (!data) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: data.service.title,
    description: data.service.description || `Learn more about our ${data.service.title} services`,
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const data = await getService(slug);

  if (!data) {
    notFound();
  }

  const { service, servicePage, features, galleryImages, serviceImage, heroImage } = data;

  const gradients = [
    "from-blush to-peach-light",
    "from-lavender-light to-sky-light",
    "from-peach-light to-blush-light",
    "from-sky-light to-sage-light",
  ];
  const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

  // Use hero image if available, otherwise fall back to service card image
  const displayImage = heroImage?.url || serviceImage?.url || service.image_url;

  return (
    <>
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
            {service.title}
          </h1>
          {(servicePage?.hero_subtitle || service.description) && (
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {servicePage?.hero_subtitle || service.description}
            </p>
          )}
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="bg-white py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-warm-gray">
            <Link href="/" className="hover:text-charcoal transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/services" className="hover:text-charcoal transition-colors">
              Services
            </Link>
            <span>/</span>
            <span className="text-charcoal">{service.title}</span>
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {(servicePage?.intro_text || service.long_description) && (
            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed text-warm-gray whitespace-pre-line">
                {servicePage?.intro_text || service.long_description}
              </p>
            </div>
          )}

          {!servicePage?.intro_text && !service.long_description && (
            <p className="text-lg leading-relaxed text-warm-gray">
              Transform your celebration into an unforgettable experience with our expertly crafted setups.
              We handle every detail so you can focus on making memories.
            </p>
          )}
        </div>
      </section>

      {/* Features Section */}
      {features.length > 0 && (
        <section className="py-20 bg-sage-light/30">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal text-center mb-12">
              {servicePage?.features_section_title || "What's Included"}
            </h2>
            {servicePage?.features_section_description && (
              <p className="text-lg text-warm-gray text-center max-w-2xl mx-auto mb-12">
                {servicePage.features_section_description}
              </p>
            )}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.id} className="bg-white rounded-xl p-6 shadow-sm">
                  {feature.icon && (
                    <div className="text-3xl mb-3">{getIconEmoji(feature.icon)}</div>
                  )}
                  <h3 className="font-serif text-xl text-charcoal mb-2">{feature.title}</h3>
                  <p className="text-warm-gray">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {galleryImages.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="font-serif text-3xl md:text-4xl text-charcoal text-center mb-12">
              {servicePage?.gallery_section_title || "Gallery"}
            </h2>
            {servicePage?.gallery_section_description && (
              <p className="text-lg text-warm-gray text-center max-w-2xl mx-auto mb-12">
                {servicePage.gallery_section_description}
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
      <section className="py-20 bg-sage-light/30">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-6">
            {servicePage?.cta_section_title || "Ready to Get Started?"}
          </h2>
          <p className="text-lg text-warm-gray mb-8">
            {servicePage?.cta_section_description ||
              "Fill out our services request form and we'll get back to you with pricing and details based on your selections."}
          </p>
          <Link
            href={servicePage?.cta_button_link || "/request"}
            className="inline-block rounded-full bg-gold px-10 py-4 text-lg font-medium text-charcoal transition-colors hover:bg-gold-light"
          >
            {servicePage?.cta_button_text || "Request This Service"}
          </Link>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-20 bg-sage-light/20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal text-center mb-12">
            Other Services
          </h2>
          <div className="text-center">
            <Link
              href="/services"
              className="inline-block text-gold font-medium hover:underline"
            >
              View All Services →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
