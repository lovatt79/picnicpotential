import type { Metadata } from "next";
import Link from "next/link";
import RentalItemCard from "@/components/RentalItemCard";
import { CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Rentals & DIY Kits",
  description:
    "Rent photo backdrop frames, adirondack chairs, neon signs, marquee letters, table overhang décor, and more for your next event in Sonoma County.",
};

export const revalidate = 3600;

const RENTAL_ITEMS = [
  {
    id: "adirondack-chair",
    title: "Adirondack Chair",
    description:
      "Classic resin adirondack chairs in three colours — perfect for outdoor events, chair vignettes, or adding extra seating to any setup.",
    specs: [
      { label: "Colors", value: "White, Slate Blue, Gray" },
      { label: "Material", value: "Resin" },
      { label: "Weight Capacity", value: "350 lbs" },
    ],
    pricing: [
      { label: "Per chair", price: 18 },
      { label: "5 or more (each)", price: 15 },
    ],
  },
  {
    id: "backdrop-arch",
    title: "Photo Backdrop Arch Frame (Set of 2)",
    description:
      "Two elegant gold arch frames — 7.2 ft and 6 ft — for stunning photo backdrops. Add optional fabric draping for a finished look.",
    specs: [
      { label: "Sizes", value: "7.2 ft and 6 ft" },
      { label: "Frame Color", value: "Gold" },
      { label: "Drapery Colors", value: "Pink, Tan, Navy Blue, Yellow" },
    ],
    pricing: [
      { label: "Set of 2", price: 30 },
    ],
    addOns: [
      { label: "Fabric Covers", price: 20 },
    ],
    images: [
      // TODO: add Vercel Blob URLs — e.g. "https://xxxx.public.blob.vercel-storage.com/Photo-Arch-1.jpg"
    ],
  },
  {
    id: "backdrop-square",
    title: "Photo Backdrop Square Frame",
    description:
      "A large 8 × 10 ft gold square backdrop frame with your choice of curtains and a wide range of drape colours.",
    specs: [
      { label: "Size", value: "8 ft × 10 ft" },
      { label: "Weight", value: "12 lbs" },
      { label: "Frame Color", value: "Gold" },
      { label: "Drape Colors", value: "Yellow, Pink, Lavender, Black, Sheer, Red Gingham, Pink Ribbon Wall" },
    ],
    pricing: [
      { label: "Frame", price: 30 },
    ],
    addOns: [
      { label: "2-Panel Curtains", price: 20 },
    ],
  },
  {
    id: "table-overhang",
    title: "Table Overhang for Décor",
    description:
      "An adjustable gold rod with clamps that arches over your table — perfect for adding balloons, fairy lights, banners, and garland to any celebration.",
    specs: [],
    pricing: [
      { label: "Rod, Clamps & Hardware", price: 20 },
    ],
    addOns: [
      { label: "2-Panel Drapes", price: 20 },
      { label: "Fairy Lights", price: 10 },
      { label: "Bistro Lights", price: 15 },
      { label: "Greenery Garland", price: 10 },
    ],
  },
  {
    id: "neon-signs",
    title: "Neon Signs",
    description:
      "Eye-catching LED neon signs for birthdays, celebrations, and special occasions. Choose the message that fits your event.",
    specs: [],
    pricing: [
      { label: '"Happy Birthday"', price: 40 },
      { label: '"Sweet 16"', price: 25 },
      { label: '"I Love You More"', price: 40 },
      { label: '"You\'re Like Really Pretty"', price: 25 },
      { label: '"Let\'s Party"', price: 50 },
      { label: "Assortment of Neon Hearts", price: 20 },
    ],
  },
  {
    id: "marquee-letters",
    title: "4 ft Marquee Letters",
    description:
      "Bold 4-foot marquee letters made from cardboard with plastic bulbs. Make a statement at any birthday, shower, or wedding.",
    specs: [
      { label: "Material", value: "Cardboard with Plastic Bulbs" },
    ],
    pricing: [
      { label: "Per letter", price: 50 },
      { label: "3 or more (each)", price: 35 },
      { label: '"Mr & Mrs" set', price: 150 },
    ],
  },
];

const PACKAGES = [
  {
    title: "Photo Backdrop Bundle",
    includes: "Square Photo Backdrop · 2-Panel Curtains · One Marquee Letter",
    price: 100,
  },
  {
    title: "Decorated Table Setup",
    includes: "Table Overhang · Fairy Lights · Greenery Garland",
    price: 30,
  },
  {
    title: "Birthday Party Bundle",
    includes: 'Table Overhang · 2-Panel Curtains · "Happy Birthday" Neon Sign',
    price: 70,
  },
  {
    title: "Romantic Arch Package",
    includes: '2 Arch Backdrops · 2 Fabric Covers · "I Love You More" or "Happy Birthday" Neon Sign',
    price: 80,
  },
];

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
            All items can be rented individually. Prices listed are per rental period.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {RENTAL_ITEMS.map((item) => (
              <RentalItemCard
                key={item.id}
                title={item.title}
                description={item.description}
                specs={item.specs}
                pricing={item.pricing}
                addOns={"addOns" in item ? item.addOns : undefined}
                images={"images" in item ? (item.images ?? []).filter(Boolean) : undefined}
              />
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
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Rental%20Inquiry`}
              className="inline-block rounded-full bg-gold px-10 py-4 text-base font-medium text-charcoal transition-colors hover:bg-gold-light"
            >
              Email Us to Reserve
            </a>
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
