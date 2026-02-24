import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Book your luxury picnic, event, wedding suite, or proposal experience with Picnic Potential. Choose the service that fits your occasion.",
};

const options = [
  {
    title: "Picnics, Tablescapes, Event Decor & Rentals",
    description:
      "Luxury picnic setups, tablescapes, event decor, and rental services for any occasion — birthdays, date nights, corporate events, and more.",
    href: "/request/service",
    enabled: true,
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
  },
  {
    title: "Proposals",
    description:
      "Plan the perfect proposal with a stunning, curated picnic setup. Choose from our Intimate, Signature, or Luxe packages.",
    href: "/request/proposal",
    enabled: true,
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  {
    title: "Wedding Suite Decor",
    description:
      "Elevated getting-ready suites for the wedding party — packages, charcuterie, drinks, personalized gifts, and more.",
    href: "/request/wedding-suite",
    enabled: true,
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
  },
];

export default function RequestPage() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-4">
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl text-charcoal md:text-4xl">
            Request a Quote
          </h1>
          <p className="mt-4 text-warm-gray max-w-2xl mx-auto">
            Choose the service that fits your occasion and we&apos;ll get back to you
            with pricing and all the details.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {options.map((option) => {
            const inner = (
              <div
                className={`relative h-full rounded-2xl border-2 p-6 transition-all ${
                  option.enabled
                    ? "border-sage/40 bg-white shadow-sm hover:border-gold hover:shadow-md cursor-pointer group"
                    : "border-gray-200 bg-gray-50/50 cursor-default"
                }`}
              >
                {!option.enabled && (
                  <span className="absolute top-3 right-3 rounded-full bg-warm-gray/10 px-3 py-1 text-xs font-medium text-warm-gray">
                    Coming Soon
                  </span>
                )}
                <div className="flex flex-col items-center text-center gap-4">
                  <div
                    className={`rounded-xl p-3 ${
                      option.enabled
                        ? "bg-sage-light/50 text-sage-dark group-hover:bg-gold/10 group-hover:text-gold"
                        : "bg-gray-100 text-gray-400"
                    } transition-colors`}
                  >
                    {option.icon}
                  </div>
                  <div>
                    <h2
                      className={`font-serif text-lg leading-snug ${
                        option.enabled ? "text-charcoal" : "text-warm-gray"
                      }`}
                    >
                      {option.title}
                    </h2>
                    <p
                      className={`mt-2 text-sm leading-relaxed ${
                        option.enabled ? "text-warm-gray" : "text-warm-gray/70"
                      }`}
                    >
                      {option.description}
                    </p>
                  </div>
                  {option.enabled && (
                    <svg
                      className="h-5 w-5 text-sage group-hover:text-gold transition-colors"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
            );

            return option.enabled ? (
              <Link key={option.title} href={option.href} className="flex">
                {inner}
              </Link>
            ) : (
              <div key={option.title} className="flex">{inner}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
