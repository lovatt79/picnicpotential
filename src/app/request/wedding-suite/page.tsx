import type { Metadata } from "next";
import Link from "next/link";
import WeddingSuiteForm from "@/components/WeddingSuiteForm";

export const metadata: Metadata = {
  title: "Wedding Suite Request",
  description:
    "Book a luxury wedding suite experience for your special day with Picnic Potential. Getting-ready suites, charcuterie, drinks, and personalized touches for the wedding party.",
};

export default function WeddingSuiteRequestPage() {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4">
        <Link
          href="/request"
          className="inline-flex items-center gap-1 text-sm text-warm-gray hover:text-charcoal mb-6"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All Request Forms
        </Link>
        <h1 className="font-serif text-3xl text-charcoal md:text-4xl mb-8">
          Wedding Suite Request
        </h1>
        <WeddingSuiteForm />
      </div>
    </section>
  );
}
