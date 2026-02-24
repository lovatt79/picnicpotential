import type { Metadata } from "next";
import Link from "next/link";
import MultiStepForm from "@/components/MultiStepForm";

export const metadata: Metadata = {
  title: "Service Request Form",
  description:
    "Book your luxury picnic, event, or experience with Picnic Potential. Fill out our service request form.",
};

export default function ServiceRequestPage() {
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
          Service Request Form
        </h1>
        <MultiStepForm />
      </div>
    </section>
  );
}
