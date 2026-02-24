import type { Metadata } from "next";
import { SITE_NAME, CONTACT_EMAIL } from "@/lib/constants";
import { generateWebPageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: `Privacy Policy | ${SITE_NAME}`,
  description: `Privacy policy for ${SITE_NAME}. Learn how we handle your information.`,
};

export default function PrivacyPolicyPage() {
  const schema = generateWebPageSchema({
    title: "Privacy Policy",
    description: `Privacy policy for ${SITE_NAME}. Learn how we handle your information.`,
    path: "/privacy-policy",
  });

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="font-serif text-4xl text-charcoal mb-8">Privacy Policy</h1>

      <div className="prose prose-warm-gray max-w-none space-y-6 text-warm-gray leading-relaxed">
        <p>
          Picnic Potential collects client contact information such as name, email, phone and
          address as part of the reservation process. All payment information is entered by the
          client via invoice and Picnic Potential does not have access to the details of client
          payment information.
        </p>

        <p>
          In the event that marketing offers or new product emails are sent out, clients have the
          option to opt out by emailing Picnic Potential at{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-gold-dark hover:text-gold transition-colors underline"
          >
            {CONTACT_EMAIL}
          </a>{" "}
          and request to be removed from the client contact list.
        </p>

        <p>
          Picnic Potential will never sell client information to a third party.
        </p>
      </div>

      <h2 className="font-serif text-3xl text-charcoal mt-16 mb-8">Media Disclaimer</h2>

      <div className="prose prose-warm-gray max-w-none space-y-6 text-warm-gray leading-relaxed">
        <p>
          The Client grants the Provider permission to capture photographs, videos, and other
          media during the event for promotional and marketing use, including on social media,
          websites, and print materials.
        </p>

        <p>
          The Client may opt out of this media release by providing written notice prior to the
          event. If written non-consent is received, the Provider may still use images of the
          event setup only, provided no identifying details, names, or images of the Client or
          guests are included.
        </p>

        <p>
          The Client agrees to inform the Provider in advance if a professional photographer,
          videographer, or social media professional will be present at the event.
        </p>
      </div>
    </section>
    </>
  );
}
