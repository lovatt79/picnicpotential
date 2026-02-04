import type { Metadata } from "next";
import MultiStepForm from "@/components/MultiStepForm";

export const metadata: Metadata = {
  title: "Service Request Form",
  description: "Book your luxury picnic, event, or experience with Picnic Potential. Fill out our service request form.",
};

export default function RequestPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-sage py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-serif text-4xl text-charcoal md:text-5xl">
            Service Request Form
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-charcoal/70">
            To book any of our services please fill out the form below. Upon receipt we will
            respond with pricing and details based on your selections. If there is something
            you are looking for that you do not see on the form or information you want us to
            know, please add it to the notes section at the bottom of the form.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <MultiStepForm />
        </div>
      </section>
    </>
  );
}
