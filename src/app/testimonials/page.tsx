import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <>
      {/* Hero */}
      <section className="bg-sage py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-serif text-4xl text-charcoal md:text-5xl">
            What Our Clients Say
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-charcoal/70">
            We're honored to create unforgettable experiences for our clients. Here's what they have to say.
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          {testimonials.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <svg
                    className="h-8 w-8 text-gold mb-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609L9.978 5.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H0z" />
                  </svg>
                  <p className="text-charcoal/80 leading-relaxed italic mb-6">
                    "{testimonial.text}"
                  </p>
                  <p className="font-semibold text-charcoal">
                    — {testimonial.author}
                  </p>
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
