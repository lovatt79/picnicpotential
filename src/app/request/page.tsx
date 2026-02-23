import type { Metadata } from "next";
import MultiStepForm from "@/components/MultiStepForm";

export const metadata: Metadata = {
  title: "Service Request Form",
  description: "Book your luxury picnic, event, or experience with Picnic Potential. Fill out our service request form.",
};

export default function RequestPage() {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="font-serif text-3xl text-charcoal md:text-4xl mb-8">
          Service Request Form
        </h1>
        <MultiStepForm />
      </div>
    </section>
  );
}
