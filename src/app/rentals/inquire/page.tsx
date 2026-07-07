import type { Metadata } from "next";
import Link from "next/link";
import RentalForm from "@/components/RentalForm";

export const metadata: Metadata = {
  title: "Rental Inquiry",
  description: "Inquire about renting photo backdrops, adirondack chairs, neon signs, marquee letters, and more for your Sonoma County event.",
};

interface RentalInquirePageProps {
  searchParams: Promise<{ item?: string }>;
}

export default async function RentalInquirePage({ searchParams }: RentalInquirePageProps) {
  const { item } = await searchParams;

  return (
    <>
      <section className="bg-sage py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <nav className="mb-6 flex justify-center gap-2 text-sm text-charcoal/60">
            <Link href="/rentals" className="hover:text-charcoal">Rentals</Link>
            <span>›</span>
            <span className="text-charcoal">Inquiry</span>
          </nav>
          <h1 className="font-serif text-4xl text-charcoal md:text-5xl">Rental Inquiry</h1>
          <p className="mx-auto mt-4 max-w-xl text-charcoal/70">
            Tell us what you need and when — we&apos;ll confirm availability and pricing within 1–2 business days.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4">
          <RentalForm preSelectedItem={item} />
        </div>
      </section>
    </>
  );
}
