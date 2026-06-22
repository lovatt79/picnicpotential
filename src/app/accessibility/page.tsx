import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Picnic Potential's commitment to web accessibility and our ongoing efforts to meet WCAG 2.1 AA standards.",
};

export default function AccessibilityPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-serif text-4xl text-charcoal">Accessibility Statement</h1>
      <p className="mt-2 text-sm text-warm-gray">Last updated: June 2026</p>

      <div className="mt-10 space-y-8 text-warm-gray leading-relaxed">

        <section aria-labelledby="commitment-heading">
          <h2 id="commitment-heading" className="font-serif text-2xl text-charcoal mb-3">
            Our Commitment
          </h2>
          <p>
            {SITE_NAME} is committed to ensuring digital accessibility for people with disabilities.
            We continually improve the user experience for everyone and apply relevant accessibility
            standards to achieve this goal.
          </p>
        </section>

        <section aria-labelledby="standards-heading">
          <h2 id="standards-heading" className="font-serif text-2xl text-charcoal mb-3">
            Standards We Target
          </h2>
          <p>
            We aim to conform to the{" "}
            <strong className="text-charcoal">Web Content Accessibility Guidelines (WCAG) 2.1</strong>{" "}
            at Level AA. These guidelines explain how to make web content more accessible to people
            with disabilities, including those with visual, auditory, physical, speech, cognitive, and
            neurological conditions.
          </p>
        </section>

        <section aria-labelledby="measures-heading">
          <h2 id="measures-heading" className="font-serif text-2xl text-charcoal mb-3">
            Measures We&apos;ve Taken
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Skip-to-content link available to keyboard users at the top of every page.
            </li>
            <li>
              All form fields have visible labels that are programmatically associated with their
              inputs.
            </li>
            <li>
              Our custom date picker supports full keyboard navigation — use arrow keys to move
              between dates, Page Up/Down to change months, Enter or Space to select, and Escape
              to close.
            </li>
            <li>
              Error messages are announced to assistive technology immediately when they appear.
            </li>
            <li>
              All images have descriptive alternative text.
            </li>
            <li>
              Icon-only buttons and links have accessible labels.
            </li>
            <li>
              The site uses semantic HTML landmarks (header, main, footer, nav) for consistent
              navigation.
            </li>
            <li>
              Text color and background combinations are reviewed for sufficient contrast.
            </li>
          </ul>
        </section>

        <section aria-labelledby="limitations-heading">
          <h2 id="limitations-heading" className="font-serif text-2xl text-charcoal mb-3">
            Known Limitations
          </h2>
          <p>
            While we strive for full accessibility, some areas are still being improved:
          </p>
          <ul className="mt-3 list-disc pl-5 space-y-2">
            <li>
              The CAPTCHA verification widget used during form submission (Cloudflare Turnstile)
              is provided by a third party. We have selected Turnstile specifically because it is
              designed to be accessible without requiring visual puzzle-solving. If you encounter
              any issues, please contact us directly.
            </li>
            <li>
              Some background images used on the site are decorative and served via CSS; these do
              not have alternative text by design.
            </li>
          </ul>
        </section>

        <section aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="font-serif text-2xl text-charcoal mb-3">
            Contact Us
          </h2>
          <p>
            If you experience any accessibility barriers on our site, or if you need content in an
            alternative format, please reach out. We take all feedback seriously and aim to respond
            within two business days.
          </p>
          <p className="mt-3">
            <strong className="text-charcoal">Email:</strong>{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-gold underline hover:text-charcoal transition-colors"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
          <p className="mt-2 text-sm">
            When contacting us about accessibility, please describe the page or feature you had
            difficulty with and the assistive technology you were using (if applicable).
          </p>
        </section>

        <section aria-labelledby="formal-heading">
          <h2 id="formal-heading" className="font-serif text-2xl text-charcoal mb-3">
            Formal Complaints
          </h2>
          <p>
            If you are not satisfied with our response, you may wish to contact the{" "}
            <strong className="text-charcoal">Web Accessibility Initiative (WAI)</strong> of the World
            Wide Web Consortium (W3C) for guidance at{" "}
            <a
              href="https://www.w3.org/WAI/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold underline hover:text-charcoal transition-colors"
            >
              w3.org/WAI
            </a>
            .
          </p>
        </section>

      </div>

      <div className="mt-12 border-t border-sage-light pt-8">
        <Link
          href="/"
          className="text-sm text-warm-gray hover:text-gold transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
