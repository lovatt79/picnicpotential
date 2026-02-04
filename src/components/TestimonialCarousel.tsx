"use client";

import { useState, useEffect } from "react";
import { TESTIMONIALS } from "@/lib/constants";

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-gradient-to-r from-blush-light via-lavender-light to-peach-light py-20">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="font-serif text-3xl text-charcoal md:text-4xl">
          What Our Clients Say
        </h2>
        <div className="mt-12 relative min-h-[280px] md:min-h-[220px]">
          {TESTIMONIALS.map((testimonial, index) => (
            <div
              key={index}
              className={`absolute inset-0 flex items-start justify-center transition-opacity duration-700 ${
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
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <p className="mt-6 font-semibold text-charcoal">
                  &mdash; {testimonial.author}
                </p>
              </div>
            </div>
          ))}
        </div>
        {/* Dots */}
        <div className="mt-4 flex justify-center gap-2">
          {TESTIMONIALS.map((_, index) => (
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
