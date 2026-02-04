import type { Metadata } from "next";
import Link from "next/link";
import FAQAccordion from "@/components/FAQAccordion";
import { FAQS, CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Frequently asked questions about Picnic Potential services, booking, and policies.",
};

export default function FAQsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-sage py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-serif text-4xl text-charcoal md:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-charcoal/70">
            Find answers to common questions about our services, booking process, and more.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4">
          <FAQAccordion items={FAQS} />
        </div>
      </section>

      {/* Privacy Policy */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-serif text-3xl text-charcoal md:text-4xl">Privacy Policy</h2>
          <div className="mt-8 rounded-2xl bg-cream p-8">
            <p className="text-sm leading-relaxed text-warm-gray">
              Picnic Potential collects client contact information such as name, email, phone
              and address as part of the reservation process. All payment information is
              entered by the client via invoice and Picnic Potential does not have access to
              the details of client payment information. In the event that marketing offers or
              new product emails are sent out, clients have the option to opt out by emailing
              Picnic Potential at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-gold hover:underline"
              >
                {CONTACT_EMAIL}
              </a>{" "}
              and request to be removed from the client contact list. Picnic Potential will
              never sell client information to a third party.
            </p>
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-serif text-3xl text-charcoal">Still Have Questions?</h2>
          <p className="mt-4 text-warm-gray">
            We&apos;d love to hear from you. Reach out via email or fill out our request form.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/request"
              className="rounded-full bg-gold px-8 py-3.5 text-base font-medium text-charcoal transition-colors hover:bg-gold-light"
            >
              Service Request Form
            </Link>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="rounded-full border-2 border-charcoal px-8 py-3.5 text-base font-medium text-charcoal transition-colors hover:bg-charcoal hover:text-white"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
