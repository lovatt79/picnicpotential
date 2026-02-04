import type { Metadata } from "next";
import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import { SERVICES, WINERY_PARTNERS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Services",
  description: "Explore our luxury picnic services, corporate events, tablescapes, proposals, and more in Sonoma County wine country.",
};

export default function ServicesPage() {
  return (
    <>
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
            {SERVICES.map((service) => (
              <ServiceCard
                key={service.slug}
                title={service.title}
                description={service.description}
                image={service.image}
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
                description: "Birthdays, anniversaries, girls' days, date nights and more.",
              },
              {
                title: "Kids Parties",
                description: "Fun, colorful setups perfect for your little one's special day.",
              },
              {
                title: "Corporate & Community Events",
                description: "Team building, family days, festivals and community gatherings.",
              },
              {
                title: "Brand Trips",
                description: "Curated experiences for influencers and brand activations.",
              },
            ].map((item, index) => {
              const gradients = [
                "from-blush to-peach-light",
                "from-lavender-light to-sky-light",
                "from-peach-light to-blush-light",
                "from-sky-light to-sage-light",
              ];
              return (
              <div key={item.title} className="group overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="aspect-square overflow-hidden">
                  <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradients[index]}`}>
                    <span className="font-serif text-sm text-charcoal/50 text-center px-2">{item.title}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-lg text-charcoal">{item.title}</h3>
                  <p className="mt-1 text-sm text-warm-gray">{item.description}</p>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community Event Seating */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-serif text-3xl text-charcoal md:text-4xl">Community Event Seating</h2>
          <p className="mt-6 text-lg leading-relaxed text-warm-gray">
            If you are an event organizer seeking to enhance your space with additional seating
            or decor, we offer thoughtfully designed solutions to suit your needs. Select from
            a variety of seating styles or incorporate a curated mix, accommodating guests who
            desire a luxury picnic experience alongside those who prefer traditional chairs or
            table seating. Our chair vignettes also serve as refined additions to
            often-overlooked areas &mdash; such as lawns designated for games &mdash; encouraging all guests
            to engage in the experience, whether actively participating or simply enjoying the
            atmosphere as spectators.
          </p>
          <Link
            href="/seating"
            className="mt-6 inline-block text-gold font-medium hover:underline"
          >
            View All Seating Styles &rarr;
          </Link>
        </div>
      </section>

      {/* Corporate Events */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-serif text-3xl text-charcoal md:text-4xl">Corporate Events</h2>
          <p className="mt-6 text-lg leading-relaxed text-warm-gray">
            Our picnics, tablescapes, decor and rentals are all great for corporate groups.
            Whether you are doing a team building off site, a family picnic day or a breakout
            session for a corporate retreat, we have a setup for you. We will work with your
            venue and internal coordinator to create spaces that keep your team engaged,
            comfortable all while offering a unique wine country experience. One of our recent
            setups was a brand trip for influencers that included a kayak trip down the Russian
            River and ending with a beachside picnic at Monte Rio Beach!
          </p>
        </div>
      </section>

      {/* Tablescapes */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-serif text-3xl text-charcoal md:text-4xl">Tablescapes</h2>
          <p className="mt-6 text-lg leading-relaxed text-warm-gray">
            Each guest is welcomed with a thoughtfully curated place setting, including a
            personalized place card, plate, cutlery, napkin, and drink goblet. The tablescape
            is further enhanced with elegant runners, ambient LED lighting, curated decor, and
            statement centerpieces. While our standard setup features high-quality disposable
            plates and cutlery, clients may opt for premium, non-disposable tableware, available
            through our trusted local rental partner.
          </p>
        </div>
      </section>

      {/* Proposals */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-serif text-3xl text-charcoal md:text-4xl">Proposals</h2>
          <p className="mt-6 text-lg leading-relaxed text-warm-gray">
            Curate an exceptional proposal for you and your partner &mdash; one that beautifully
            captures the significance of &ldquo;I do&rdquo; and creates memories to cherish for
            a lifetime. Whether you choose from one of our thoughtfully designed proposal
            packages or craft a fully bespoke experience, our team is dedicated to bringing
            your vision to life with elegance and care.
          </p>
        </div>
      </section>

      {/* Wedding Suite */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-serif text-3xl text-charcoal md:text-4xl">
            Wedding Suite &amp; Hotel Suite Decor
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-warm-gray">
            Our wedding suite packages are thoughtfully designed for couples who want their
            getting-ready space to feel just as beautiful and intentional as the rest of their
            celebration &mdash; without the stress of coordinating every last detail. We take care of
            the essentials (and the indulgences), from curated food and drinks to elegant decor
            and playful, memorable add-ons that elevate the experience and set the tone for
            your day.
          </p>
          <Link
            href="/request"
            className="mt-6 inline-block rounded-full bg-charcoal px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-gold"
          >
            Wedding Suite Decor Request Form
          </Link>
        </div>
      </section>

      {/* Rentals */}
      <section className="bg-sage-light/50 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-serif text-3xl text-charcoal md:text-4xl">
            Rentals &amp; DIY Rental Kits
          </h2>
          <div className="mx-auto mt-4 inline-block rounded-full bg-gold/20 px-4 py-1 text-sm font-medium text-gold">
            Coming Spring 2026
          </div>
          <p className="mt-6 text-lg text-warm-gray">
            Stay tuned for our exciting new rental options and DIY kits, perfect for creating
            your own beautiful setup with our curated collection.
          </p>
        </div>
      </section>

      {/* Corporate & Winery Partners */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-serif text-3xl text-charcoal md:text-4xl">
            Our Corporate &amp; Winery Partners
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-warm-gray">
            We are proud to partner with some of Sonoma County&apos;s finest wineries and businesses.
          </p>

          {/* Corporate logos placeholder */}
          <div className="mt-12">
            <h3 className="text-center text-sm font-semibold uppercase tracking-wider text-warm-gray">
              Corporate Partners
            </h3>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="flex h-20 w-32 items-center justify-center rounded-lg bg-sage-light"
                >
                  <span className="text-xs text-sage-dark">Logo {i}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Winery Partners */}
          <div className="mt-16">
            <h3 className="text-center text-sm font-semibold uppercase tracking-wider text-warm-gray">
              Winery Partners
            </h3>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-8">
              {WINERY_PARTNERS.map((winery) => (
                <div
                  key={winery}
                  className="flex h-20 items-center justify-center rounded-lg bg-sage-light px-6"
                >
                  <span className="text-sm font-medium text-charcoal">{winery}</span>
                </div>
              ))}
            </div>
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
