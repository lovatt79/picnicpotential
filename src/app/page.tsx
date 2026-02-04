import Link from "next/link";
import { SERVICES, SITE_TAGLINE } from "@/lib/constants";
import ServiceCard from "@/components/ServiceCard";
import TestimonialCarousel from "@/components/TestimonialCarousel";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
        {/* Background gradient placeholder - replace with hero image */}
        <div className="absolute inset-0 bg-gradient-to-br from-sage via-blush-light to-peach-light" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
          <h1 className="font-serif text-5xl leading-tight md:text-7xl">
            Picnic Potential
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed md:text-xl">
            {SITE_TAGLINE}
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/request"
              className="rounded-full bg-gold px-8 py-3.5 text-base font-medium text-charcoal transition-colors hover:bg-gold-light"
            >
              Book Your Experience
            </Link>
            <Link
              href="/services"
              className="rounded-full border-2 border-white px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-white hover:text-charcoal"
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-serif text-3xl text-charcoal md:text-4xl">
            Sit Back, Relax & We&apos;ll Take Care of the Rest
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-warm-gray">
            Enjoy every minute of your date night, birthday, anniversary or just an afternoon
            with friends. Don&apos;t waste another moment with the prep or clean up &mdash; leave
            that to us. From intimate gatherings to grand celebrations, we create experiences
            that are as unique as the moments they celebrate.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="font-serif text-3xl text-charcoal md:text-4xl">Our Services</h2>
            <p className="mx-auto mt-4 max-w-2xl text-warm-gray">
              From luxury picnics to elegant tablescapes, we offer a full range of services
              to make your event unforgettable.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <ServiceCard
                key={service.slug}
                title={service.title}
                description={service.description}
                image={service.image}
                href="/services"
              />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-block rounded-full bg-charcoal px-8 py-3.5 text-base font-medium text-white transition-colors hover:bg-gold"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center font-serif text-3xl text-charcoal md:text-4xl">
            How It Works
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "You Inquire",
                description:
                  "Fill out our Service Request Form with your event details, preferences, and vision.",
              },
              {
                step: "02",
                title: "We Design",
                description:
                  "We respond with pricing and a customized plan tailored to your selections and style.",
              },
              {
                step: "03",
                title: "We Execute",
                description:
                  "We handle all setup and cleanup so you can enjoy every moment of your special event.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-peach-light to-blush">
                  <span className="font-serif text-xl text-charcoal">{item.step}</span>
                </div>
                <h3 className="mt-6 font-serif text-xl text-charcoal">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-warm-gray">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialCarousel />

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-serif text-3xl text-charcoal md:text-4xl">
            Ready to Create Something Beautiful?
          </h2>
          <p className="mt-6 text-lg text-warm-gray">
            Fill out our Service Request Form and we&apos;ll respond with pricing and details
            based on your selections.
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
