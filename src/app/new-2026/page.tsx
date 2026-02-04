import type { Metadata } from "next";
import Link from "next/link";
import { WINERY_PARTNERS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "New in 2026",
  description: "Exciting new services, winery partners, and offerings coming to Picnic Potential in 2026.",
};

export default function New2026Page() {
  return (
    <>
      {/* Hero */}
      <section className="bg-sage py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-serif text-4xl text-charcoal md:text-5xl">New in 2026</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-charcoal/70">
            We are thrilled to announce exciting new partnerships and services for 2026.
            Stay tuned as we continue to expand our offerings.
          </p>
        </div>
      </section>

      {/* New Winery Partners */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-serif text-3xl text-charcoal md:text-4xl">New Winery Partners</h2>
          <p className="mt-4 text-warm-gray">
            We are excited to welcome these incredible wineries to our partner family.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {WINERY_PARTNERS.map((winery) => (
              <div
                key={winery}
                className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-light">
                  <svg className="h-6 w-6 text-sage-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <span className="font-serif text-lg text-charcoal">{winery}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Services */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-serif text-3xl text-charcoal md:text-4xl">New Services</h2>
          <p className="mt-4 text-warm-gray">
            Expanding our offerings to bring you even more ways to celebrate.
          </p>
          <div className="mt-8 space-y-6">
            {[
              {
                title: "Bridal & Groom Suite Decor",
                description: "Elevated getting-ready spaces for the wedding party. Details coming soon.",
                status: "Coming Soon",
              },
              {
                title: "Hotel Room Decor",
                description: "Transform your hotel room into a beautifully decorated retreat. Details coming soon.",
                status: "Coming Soon",
              },
              {
                title: "DIY Rental Kits",
                description: "Create your own beautiful setup with our curated collection of decor and supplies.",
                status: "Coming Spring 2026",
              },
              {
                title: "Rentals",
                description: "Individual rental items available for your events and celebrations.",
                status: "Coming Spring 2026",
              },
            ].map((service) => (
              <div
                key={service.title}
                className="flex flex-col gap-4 rounded-xl bg-cream p-6 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-serif text-xl text-charcoal">{service.title}</h3>
                  <p className="mt-1 text-sm text-warm-gray">{service.description}</p>
                </div>
                <span className="inline-block whitespace-nowrap rounded-full bg-gold/20 px-4 py-1 text-sm font-medium text-gold">
                  {service.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-serif text-3xl text-charcoal">
            Want to Be the First to Know?
          </h2>
          <p className="mt-4 text-warm-gray">
            Follow us on social media for the latest updates on new services and partnerships.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/request"
              className="rounded-full bg-gold px-8 py-3.5 text-base font-medium text-charcoal transition-colors hover:bg-gold-light"
            >
              Book Your Picnic or Event
            </Link>
            <a
              href="https://www.instagram.com/picnic.potential/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-2 border-charcoal px-8 py-3.5 text-base font-medium text-charcoal transition-colors hover:bg-charcoal hover:text-white"
            >
              Follow on Instagram
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
