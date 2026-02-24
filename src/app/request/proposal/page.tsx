import type { Metadata } from "next";
import Link from "next/link";
import ProposalForm from "@/components/ProposalForm";

export const metadata: Metadata = {
  title: "Proposal Request",
  description:
    "Plan the perfect proposal with Picnic Potential. Choose from our Intimate, Signature, or Luxe proposal packages with stunning setups in Sonoma County wine country.",
};

export default function ProposalRequestPage() {
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
          Proposal Request
        </h1>
        <ProposalForm />
      </div>
    </section>
  );
}
