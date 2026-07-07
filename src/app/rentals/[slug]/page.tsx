import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { RENTAL_ITEMS } from "@/lib/rentals";
import { CONTACT_EMAIL } from "@/lib/constants";
import RentalImageGallery from "@/components/RentalImageGallery";

interface RentalDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return RENTAL_ITEMS.map((item) => ({ slug: item.id }));
}

export async function generateMetadata({ params }: RentalDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = RENTAL_ITEMS.find((i) => i.id === slug);
  if (!item) return { title: "Rental Item Not Found" };
  return {
    title: item.title,
    description: item.description,
  };
}

const PASTEL_GRADIENTS = [
  "from-blush to-peach-light",
  "from-sage-light to-sky-light",
  "from-lavender-light to-blush-light",
  "from-peach to-gold-light",
  "from-sky-light to-sage-light",
  "from-blush-light to-lavender-light",
];

export default async function RentalDetailPage({ params }: RentalDetailPageProps) {
  const { slug } = await params;
  const item = RENTAL_ITEMS.find((i) => i.id === slug);
  if (!item) notFound();

  const { title, description, specs, pricing, addOns, images } = item;
  const gradient = PASTEL_GRADIENTS[title.length % PASTEL_GRADIENTS.length];
  const hasImages = images && images.length > 0;

  return (
    <>
      {/* Breadcrumb */}
      <nav className="border-b border-gray-200 bg-white py-4">
        <div className="mx-auto max-w-6xl px-4">
          <ol className="flex items-center gap-2 text-sm">
            <li><Link href="/" className="text-warm-gray hover:text-charcoal">Home</Link></li>
            <li className="text-warm-gray">›</li>
            <li><Link href="/rentals" className="text-warm-gray hover:text-charcoal">Rentals</Link></li>
            <li className="text-warm-gray">›</li>
            <li className="text-charcoal">{title}</li>
          </ol>
        </div>
      </nav>

      {/* Hero / Image Gallery */}
      {hasImages ? (
        <section className="bg-white py-10">
          <div className="mx-auto max-w-6xl px-4">
            <RentalImageGallery images={images} title={title} />
          </div>
        </section>
      ) : (
        <div className={`h-48 bg-gradient-to-br ${gradient}`} />
      )}

      {/* Content */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="font-serif text-4xl text-charcoal md:text-5xl">{title}</h1>
          <p className="mt-6 text-lg leading-relaxed text-warm-gray">{description}</p>

          {/* Specs */}
          {specs && specs.length > 0 && (
            <div className="mt-10">
              <h2 className="font-serif text-2xl text-charcoal">Details</h2>
              <dl className="mt-4 divide-y divide-sage-light">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex justify-between py-3 text-sm">
                    <dt className="font-medium text-charcoal/70">{spec.label}</dt>
                    <dd className="text-warm-gray">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Pricing */}
          <div className="mt-10">
            <h2 className="font-serif text-2xl text-charcoal">Pricing</h2>
            <ul className="mt-4 divide-y divide-sage-light">
              {pricing.map((line, i) => (
                <li key={line.label} className="flex items-baseline justify-between py-3">
                  <span className="text-sm text-warm-gray">{line.label}</span>
                  <span className={`tabular-nums ${i === 0 ? "text-xl font-semibold text-charcoal" : "text-base text-charcoal"}`}>
                    ${line.price}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Add-ons */}
          {addOns && addOns.length > 0 && (
            <div className="mt-10">
              <h2 className="font-serif text-2xl text-charcoal">Add-ons</h2>
              <ul className="mt-4 divide-y divide-sage-light">
                {addOns.map((addon) => (
                  <li key={addon.label} className="flex items-baseline justify-between py-3">
                    <span className="text-sm text-warm-gray">{addon.label}</span>
                    <span className="tabular-nums text-base text-charcoal">+${addon.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA */}
          <div className="mt-14 rounded-2xl bg-sage/30 p-8 text-center">
            <h2 className="font-serif text-2xl text-charcoal">Interested in renting this?</h2>
            <p className="mt-3 text-warm-gray">
              Reach out with your event date and we&apos;ll confirm availability.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Rental%20Inquiry%20%E2%80%93%20${encodeURIComponent(title)}`}
                className="inline-block rounded-full bg-gold px-8 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-gold-light"
              >
                Email Us to Reserve
              </a>
              <Link
                href="/rentals"
                className="inline-block rounded-full border-2 border-charcoal px-8 py-3 text-sm font-medium text-charcoal transition-colors hover:border-gold hover:text-gold"
              >
                ← Back to All Rentals
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
