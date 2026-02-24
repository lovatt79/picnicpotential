import type { Metadata } from "next";
import Link from "next/link";
import FAQAccordion from "@/components/FAQAccordion";
import { CONTACT_EMAIL } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { generateFAQSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Frequently asked questions about Picnic Potential services, booking, and policies.",
};

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getPageHero() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("page_heroes")
      .select("*")
      .eq("page_key", "faqs")
      .single();

    if (error) {
      console.error("Error fetching FAQs hero:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getPageHero:", error);
    return null;
  }
}

async function getFAQs() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching FAQs:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getFAQs:", error);
    return [];
  }
}

export default async function FAQsPage() {
  const [faqs, hero] = await Promise.all([getFAQs(), getPageHero()]);

  const heroTitle = hero?.title || "Frequently Asked Questions";
  const heroDescription = hero?.description || "Find answers to common questions about our services, booking process, and more.";
  const heroImageUrl = hero?.image_url || "https://lh3.googleusercontent.com/pw/AP1GczP5aPO_J65w7tCQhS_dvxiXPygo2J_mlf15Tap0mZXx0RbWHndP6y4tYv8gH_SM9jE8AKFGCpQshRx8aPjHmVkk7E-5zTEIA-jibuT0GMbdTV-7rwfkbzR7bOeti1VH-sTcEIEPsl7q73K-5daGkP05Mg=w1024-h683-s-no-gm?authuser=0";

  // Generate FAQ schema
  const faqSchema = faqs.length > 0 ? generateFAQSchema(faqs) : null;

  return (
    <>
      {/* Schema.org structured data */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImageUrl}
            alt="Picnic Potential FAQ"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/50" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center">
          <h1 className="font-serif text-4xl text-white md:text-5xl">
            {heroTitle}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/85">
            {heroDescription}
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4">
          {faqs.length > 0 ? (
            <FAQAccordion items={faqs} />
          ) : (
            <div className="text-center py-12 text-warm-gray">
              <p>No FAQs available at this time.</p>
            </div>
          )}
        </div>
      </section>

      {/* Privacy Policy & Media Disclaimer */}
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

          <h2 className="font-serif text-3xl text-charcoal md:text-4xl mt-16">Media Disclaimer</h2>
          <div className="mt-8 rounded-2xl bg-cream p-8 space-y-4">
            <p className="text-sm leading-relaxed text-warm-gray">
              The Client grants the Provider permission to capture photographs, videos, and
              other media during the event for promotional and marketing use, including on
              social media, websites, and print materials.
            </p>
            <p className="text-sm leading-relaxed text-warm-gray">
              The Client may opt out of this media release by providing written notice prior
              to the event. If written non-consent is received, the Provider may still use
              images of the event setup only, provided no identifying details, names, or
              images of the Client or guests are included.
            </p>
            <p className="text-sm leading-relaxed text-warm-gray">
              The Client agrees to inform the Provider in advance if a professional
              photographer, videographer, or social media professional will be present at the
              event.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/privacy-policy"
              className="text-sm text-gold-dark hover:text-gold transition-colors underline"
            >
              View Full Privacy Policy &amp; Media Disclaimer
            </Link>
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
