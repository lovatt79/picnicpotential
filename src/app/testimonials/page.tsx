import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { generateReviewsSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Read what our clients have to say about their Picnic Potential experience.",
};

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getTestimonials() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching testimonials:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getTestimonials:", error);
    return [];
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-4 w-4 ${star <= rating ? "text-gold" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function formatReviewDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  // Generate review schema
  const reviewsSchema = testimonials.length > 0 ? generateReviewsSchema(testimonials) : null;

  return (
    <>
      {/* Schema.org structured data */}
      {reviewsSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
        />
      )}

      {/* Hero */}
      <section className="bg-sage py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-serif text-4xl text-charcoal md:text-5xl">
            What Our Clients Say
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-charcoal/70">
            We&apos;re honored to create unforgettable experiences for our clients.
            Here&apos;s what they have to say.
          </p>
          {testimonials.length > 0 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="h-6 w-6 text-gold"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-charcoal/70 text-lg font-medium">
                5.0 &middot; 100+ Online Reviews
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          {testimonials.length > 0 ? (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="break-inside-avoid bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <StarRating rating={testimonial.rating || 5} />
                    {/* Google icon */}
                    <svg className="h-5 w-5 text-charcoal/30" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  </div>
                  <p className="text-charcoal/80 leading-relaxed mb-6">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-charcoal">
                      &mdash; {testimonial.author}
                    </p>
                    {testimonial.review_date && (
                      <p className="text-sm text-warm-gray">
                        {formatReviewDate(testimonial.review_date)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-warm-gray">
              <p>No testimonials available at this time.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-sage-light/30 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-serif text-3xl text-charcoal">
            Ready to Create Your Own Memorable Experience?
          </h2>
          <p className="mt-4 text-warm-gray">
            Let us help you create moments that you and your guests will cherish forever.
          </p>
          <Link
            href="/request"
            className="mt-8 inline-block rounded-full bg-gold px-10 py-4 text-lg font-medium text-charcoal transition-colors hover:bg-gold-light"
          >
            Book Your Event
          </Link>
        </div>
      </section>
    </>
  );
}
