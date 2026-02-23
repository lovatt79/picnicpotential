"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Testimonial {
  id: string;
  text: string;
  author: string;
  rating: number | null;
}

const MAX_CHARS = 280;

function truncate(text: string): { display: string; wasTruncated: boolean } {
  if (text.length <= MAX_CHARS) return { display: text, wasTruncated: false };
  const cut = text.lastIndexOf(" ", MAX_CHARS);
  return { display: text.substring(0, cut > 0 ? cut : MAX_CHARS) + "…", wasTruncated: true };
}

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [containerHeight, setContainerHeight] = useState(220);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    async function loadTestimonials() {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("testimonials")
        .select("id, text, author, rating")
        .eq("is_published", true)
        .eq("show_on_homepage", true)
        .order("sort_order", { ascending: true });

      if (!error && data) {
        setTestimonials(data);
      }
      setLoading(false);
    }

    loadTestimonials();
  }, []);

  // Measure the current slide and set container height
  useEffect(() => {
    const measure = () => {
      const el = itemRefs.current[current];
      if (el) {
        setContainerHeight(el.scrollHeight);
      }
    };
    measure();
    // Re-measure on resize
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [current, testimonials]);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials]);

  if (loading || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="bg-gradient-to-r from-blush-light via-lavender-light to-peach-light py-20">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="font-serif text-3xl text-charcoal md:text-4xl">
          What Our Clients Say
        </h2>

        {/* Aggregate rating badge */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className="h-5 w-5 text-gold"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-charcoal/60 text-sm font-medium">
            5.0 &middot; 100+ Online Reviews
          </span>
        </div>

        <div
          className="mt-10 relative overflow-hidden transition-[height] duration-500 ease-in-out"
          style={{ height: containerHeight }}
        >
          {testimonials.map((testimonial, index) => {
            const { display, wasTruncated } = truncate(testimonial.text);
            return (
              <div
                key={testimonial.id}
                ref={(el) => { itemRefs.current[index] = el; }}
                className={`absolute inset-x-0 top-0 transition-opacity duration-700 ${
                  index === current ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <div className="mx-auto max-w-2xl">
                  <svg
                    className="mx-auto h-8 w-8 text-gold mb-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609L9.978 5.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H0z" />
                  </svg>
                  <p className="text-lg leading-relaxed text-charcoal/80 italic">
                    &ldquo;{display}&rdquo;
                    {wasTruncated && (
                      <Link
                        href="/testimonials"
                        className="not-italic text-gold hover:text-charcoal text-base ml-1"
                      >
                        Read more
                      </Link>
                    )}
                  </p>
                  <p className="mt-6 font-semibold text-charcoal">
                    &mdash; {testimonial.author}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dots */}
        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                index === current ? "bg-gold" : "bg-charcoal/20"
              }`}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
