"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface RentalImageGalleryProps {
  images: string[];
  title: string;
}

export default function RentalImageGallery({ images, title }: RentalImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const isOpen = lightboxIndex !== null;

  const open = (i: number) => setLightboxIndex(i);
  const close = () => setLightboxIndex(null);

  const prev = useCallback(() =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null)),
    [images.length]
  );
  const next = useCallback(() =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : null)),
    [images.length]
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, prev, next]);

  const extraCount = images.length - 3;

  return (
    <>
      {/* ── Grid (up to 3 images) ── */}
      {images.length === 1 && (
        <button
          onClick={() => open(0)}
          className="relative block w-full aspect-[16/9] overflow-hidden rounded-2xl cursor-zoom-in"
          aria-label={`View ${title} photo`}
        >
          <Image src={images[0]} alt={title} fill priority sizes="(max-width: 1152px) 100vw, 1152px" className="object-cover transition-transform duration-500 hover:scale-105" />
        </button>
      )}

      {images.length === 2 && (
        <div className="grid grid-cols-2 gap-2">
          {images.map((src, i) => (
            <button key={i} onClick={() => open(i)} className="relative aspect-[4/3] overflow-hidden rounded-2xl cursor-zoom-in" aria-label={`View photo ${i + 1}`}>
              <Image src={src} alt={`${title} ${i + 1}`} fill priority={i === 0} sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-500 hover:scale-105" />
            </button>
          ))}
        </div>
      )}

      {images.length >= 3 && (
        <div className="grid h-[380px] grid-cols-3 grid-rows-2 gap-2 sm:h-[460px]">
          {/* Large left image — spans both rows */}
          <button
            onClick={() => open(0)}
            className="relative col-span-2 row-span-2 overflow-hidden rounded-2xl cursor-zoom-in"
            aria-label={`View photo 1`}
          >
            <Image src={images[0]} alt={`${title} 1`} fill priority sizes="(max-width: 768px) 67vw, 50vw" className="object-cover transition-transform duration-500 hover:scale-105" />
          </button>

          {/* Top-right */}
          <button onClick={() => open(1)} className="relative overflow-hidden rounded-2xl cursor-zoom-in" aria-label="View photo 2">
            <Image src={images[1]} alt={`${title} 2`} fill sizes="(max-width: 768px) 33vw, 17vw" className="object-cover transition-transform duration-500 hover:scale-105" />
          </button>

          {/* Bottom-right — overlay if more than 3 */}
          <button onClick={() => open(2)} className="relative overflow-hidden rounded-2xl cursor-zoom-in" aria-label={extraCount > 0 ? `View all ${images.length} photos` : "View photo 3"}>
            <Image src={images[2]} alt={`${title} 3`} fill sizes="(max-width: 768px) 33vw, 17vw" className="object-cover transition-transform duration-500 hover:scale-105" />
            {extraCount > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[1px]">
                <span className="font-serif text-xl text-white">+{extraCount} more</span>
              </div>
            )}
          </button>
        </div>
      )}

      {/* ── Lightbox ── */}
      {isOpen && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photo gallery`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={close}
        >
          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1 text-sm text-white/80 backdrop-blur-sm">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Close */}
          <button
            onClick={close}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            aria-label="Close gallery"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              aria-label="Previous photo"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div
            className="relative mx-24 h-[85vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={lightboxIndex}
              src={images[lightboxIndex]}
              alt={`${title} ${lightboxIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              aria-label="Next photo"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  );
}
