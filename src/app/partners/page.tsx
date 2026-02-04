import type { Metadata } from "next";
import Link from "next/link";
import VendorCard from "@/components/VendorCard";
import { VIP_PARTNERS, PREFERRED_PARTNERS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Preferred Vendor Partners",
  description: "Our curated list of trusted local vendors for charcuterie, florals, desserts, balloons, photography and more.",
};

export default function PartnersPage() {
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
            {VIP_PARTNERS.map((partner) => (
              <VendorCard
                key={partner.name}
                name={partner.name}
                category={partner.category}
                location={partner.location}
                url={partner.url}
                logo={partner.logo}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Preferred Partners */}
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
            {PREFERRED_PARTNERS.map((partner) => (
              <VendorCard
                key={partner.name}
                name={partner.name}
                category={partner.category}
                location={partner.location}
                url={partner.url}
                logo={partner.logo}
              />
            ))}
          </div>
        </div>
      </section>

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
