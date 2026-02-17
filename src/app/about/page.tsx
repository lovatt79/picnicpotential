import type { Metadata } from "next";
import Link from "next/link";
import { generateOrganizationSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Picnic Potential and our passion for creating unique picnic and event experiences in Sonoma County.",
};

export default function AboutPage() {
  const organizationSchema = generateOrganizationSchema();

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Hero */}
      <section className="bg-sage py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-serif text-4xl text-charcoal md:text-5xl">About Us</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-charcoal/70">
            Creating memorable experiences in Sonoma County wine country.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Image placeholder */}
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-sage to-sage-dark/50">
              <div className="flex h-full w-full items-center justify-center">
                <span className="font-serif text-lg text-white/80">Photo of Alison</span>
              </div>
            </div>
            <div>
              <h2 className="font-serif text-3xl text-charcoal md:text-4xl">Our Story</h2>
              <p className="mt-6 text-lg leading-relaxed text-warm-gray">
                Picnic Potential was born from a love of bringing people together in beautiful
                settings. Based in Sonoma County, we specialize in creating unforgettable
                outdoor experiences that combine the natural beauty of wine country with
                thoughtful, elegant design.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-warm-gray">
                Whether it&apos;s an intimate date night, a milestone birthday, a corporate
                retreat, or a dreamy proposal, we pour attention and care into every detail.
                From the ground cover to the centerpieces, every element is curated to create
                the atmosphere you envision.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-warm-gray">
                We believe that life&apos;s special moments deserve special settings. That&apos;s
                why we handle everything from setup to cleanup, so you can be fully present
                and enjoy every minute.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center font-serif text-3xl text-charcoal md:text-4xl">
            What Sets Us Apart
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                ),
                title: "Attention to Detail",
                description:
                  "Every element is thoughtfully curated, from personalized place cards to statement centerpieces.",
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                ),
                title: "Full Service",
                description:
                  "We handle everything from design and setup to vendor coordination and cleanup.",
              },
              {
                icon: (
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                  </svg>
                ),
                title: "Local Expertise",
                description:
                  "Deep roots in Sonoma County with trusted vendor partnerships and venue knowledge.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage text-gold">
                  {item.icon}
                </div>
                <h3 className="mt-6 font-serif text-xl text-charcoal">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-warm-gray">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-serif text-3xl text-charcoal md:text-4xl">Service Area</h2>
          <p className="mt-6 text-lg leading-relaxed text-warm-gray">
            We primarily serve Sonoma County and the surrounding wine country areas, including
            Petaluma, Santa Rosa, Healdsburg, Windsor, Sebastopol, and beyond. For events
            outside our standard service area, please reach out — we are happy to discuss
            options.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-sage py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-serif text-3xl text-charcoal">
            Let&apos;s Create Something Beautiful Together
          </h2>
          <p className="mt-4 text-charcoal/70">
            We would love to hear about your upcoming event or celebration.
          </p>
          <Link
            href="/request"
            className="mt-8 inline-block rounded-full bg-gold px-10 py-4 text-lg font-medium text-charcoal transition-colors hover:bg-gold-light"
          >
            Book Your Experience
          </Link>
        </div>
      </section>
    </>
  );
}
