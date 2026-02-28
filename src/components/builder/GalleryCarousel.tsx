"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import type { GalleryImage } from "@/lib/builder-types";

export default function GalleryCarousel({ images }: { images: GalleryImage[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  const updateCurrent = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setCurrent(idx);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateCurrent, { passive: true });
    return () => el.removeEventListener("scroll", updateCurrent);
  }, [updateCurrent]);

  const scrollTo = (idx: number) => {
    scrollRef.current?.scrollTo({ left: idx * (scrollRef.current?.clientWidth || 0), behavior: "smooth" });
  };

  return (
    <div className="relative mb-4 group">
      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded-lg"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {images.map((img) => (
          <div key={img.id} className="w-full shrink-0 snap-center aspect-[16/9]">
            <img
              src={img.image_url}
              alt={img.alt || ""}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Prev / Next buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => scrollTo(Math.max(0, current - 1))}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
            disabled={current === 0}
            aria-label="Previous"
          >
            <svg className="w-5 h-5 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scrollTo(Math.min(images.length - 1, current + 1))}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
            disabled={current === images.length - 1}
            aria-label="Next"
          >
            <svg className="w-5 h-5 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx === current ? "bg-charcoal" : "bg-gray-300"
              }`}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
