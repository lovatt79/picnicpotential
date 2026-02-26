"use client";

import { useState } from "react";
import Lightbox from "@/components/Lightbox";

interface ColorPaletteGridProps {
  images: Array<{ url: string; alt: string }>;
}

export default function ColorPaletteGrid({ images }: ColorPaletteGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setLightboxIndex(index)}
            className="group rounded-lg overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      <Lightbox
        images={images}
        currentIndex={lightboxIndex}
        isOpen={lightboxIndex >= 0}
        onClose={() => setLightboxIndex(-1)}
        onNext={() => setLightboxIndex((i) => Math.min(i + 1, images.length - 1))}
        onPrev={() => setLightboxIndex((i) => Math.max(i - 1, 0))}
      />
    </>
  );
}
