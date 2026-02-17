import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
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

  // Fetch the service image if it exists
  let serviceImage = null;
  if (service.image_id) {
    const { data: imageData } = await supabase
      .from("media")
      .select("url")
      .eq("id", service.image_id)
      .single();
    serviceImage = imageData;
  }

  return {
    ...service,
    image: serviceImage,
  };
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: service.title,
    description: service.description || `Learn more about our ${service.title} services`,
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    notFound();
  }

  const gradients = [
    "from-blush to-peach-light",
    "from-lavender-light to-sky-light",
    "from-peach-light to-blush-light",
    "from-sky-light to-sage-light",
  ];
  const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {service.image?.url || service.image_url ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${service.image?.url || service.image_url})` }}
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
          {service.description && (
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              {service.description}
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
          {service.long_description && (
            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed text-warm-gray whitespace-pre-line">
                {service.long_description}
              </p>
            </div>
          )}

          {!service.long_description && (
            <p className="text-lg leading-relaxed text-warm-gray">
              Transform your celebration into an unforgettable experience with our expertly crafted setups.
              We handle every detail so you can focus on making memories.
            </p>
          )}
        </div>
      </section>

      {/* Features Section - Placeholder for future expansion */}
      <section className="py-20 bg-sage-light/30">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal text-center mb-12">
            What's Included
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Full Setup & Breakdown",
                description: "We handle all the details from start to finish",
              },
              {
                title: "Curated Decor",
                description: "Thoughtfully designed elements to match your vision",
              },
              {
                title: "Premium Quality",
                description: "High-end materials and attention to detail",
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-serif text-xl text-charcoal mb-2">{feature.title}</h3>
                <p className="text-warm-gray">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-warm-gray mb-8">
            Fill out our services request form and we'll get back to you with pricing and details
            based on your selections.
          </p>
          <Link
            href="/request"
            className="inline-block rounded-full bg-gold px-10 py-4 text-lg font-medium text-charcoal transition-colors hover:bg-gold-light"
          >
            Request This Service
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
