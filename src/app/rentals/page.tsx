import type { Metadata } from "next";
import Link from "next/link";
import RentalItemCard from "@/components/RentalItemCard";
import { RENTAL_ITEMS, PACKAGES } from "@/lib/rentals";

export const metadata: Metadata = {
  title: "Rentals & DIY Kits",
  description:
    "Rent photo backdrop frames, adirondack chairs, neon signs, marquee letters, table overhang décor, and more for your next event in Sonoma County.",
};

export const revalidate = 3600;

export default function RentalsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-sage py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-serif text-4xl text-charcoal md:text-5xl">
            DIY Event Essentials
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-charcoal/70">
            Everything you need to style your own event — photo backdrops, lighting, signage, and
            seating — delivered without the full-service price tag. Mix and match, or choose a
            combination package below.
          </p>
        </div>
      </section>

      {/* Rental Items */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-serif text-3xl text-charcoal text-center md:text-4xl">
            Individual Items
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-warm-gray">
            All items can be rented individually. Click any item to see full details and photos.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {RENTAL_ITEMS.map((item) => (
              <RentalItemCard key={item.id} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Combination Packages */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-serif text-3xl text-charcoal text-center md:text-4xl">
            Combination Packages
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-warm-gray">
            Pre-curated bundles that pair perfectly together — and save you money.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.title}
                className="flex flex-col justify-between rounded-2xl border border-sage bg-cream p-8"
              >
                <div>
                  <h3 className="font-serif text-xl text-charcoal">{pkg.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-warm-gray">{pkg.includes}</p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-sage-light pt-4">
                  <span className="text-sm text-warm-gray">Bundle price</span>
                  <span className="text-2xl font-semibold text-charcoal">${pkg.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-serif text-3xl text-charcoal">Ready to Rent?</h2>
          <p className="mx-auto mt-4 max-w-xl text-warm-gray">
            Reach out and let us know which items you&apos;re interested in, your event date, and any
            questions. We&apos;ll get back to you within two business days.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/rentals/inquire"
              className="inline-block rounded-full bg-gold px-10 py-4 text-base font-medium text-charcoal transition-colors hover:bg-gold-light"
            >
              Submit a Rental Inquiry
            </Link>
            <Link
              href="/request"
              className="inline-block rounded-full border-2 border-charcoal px-10 py-4 text-base font-medium text-charcoal transition-colors hover:border-gold hover:text-gold"
            >
              Or Book a Full Service
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
