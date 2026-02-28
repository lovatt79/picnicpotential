import type { BuilderElement, GalleryColumns } from "@/lib/builder-types";
import GalleryCarousel from "./GalleryCarousel";

const galleryGridClass: Record<GalleryColumns, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

export default function ElementRenderer({
  element,
}: {
  element: BuilderElement;
}) {
  switch (element.type) {
    case "title": {
      const Tag = element.level;
      const sizeClasses: Record<string, string> = {
        h1: "text-4xl md:text-5xl",
        h2: "text-3xl md:text-4xl",
        h3: "text-2xl md:text-3xl",
        h4: "text-xl md:text-2xl",
      };
      return (
        <Tag className={`font-serif text-charcoal ${sizeClasses[element.level]} mb-4`}>
          {element.text}
        </Tag>
      );
    }

    case "text":
      return (
        <div className="text-warm-gray leading-relaxed whitespace-pre-line mb-4">
          {element.text}
        </div>
      );

    case "image":
      if (!element.image_url) return null;
      return (
        <div className="mb-4">
          <img
            src={element.image_url}
            alt={element.alt || ""}
            className="w-full h-auto rounded-lg"
            loading="lazy"
          />
        </div>
      );

    case "gallery": {
      if (element.images.length === 0) return null;

      if (element.layout === "carousel") {
        return <GalleryCarousel images={element.images} />;
      }

      // Grid layout
      return (
        <div className={`grid ${galleryGridClass[element.columns]} gap-3 mb-4`}>
          {element.images.map((img) => (
            <div key={img.id} className="aspect-square overflow-hidden rounded-lg">
              <img
                src={img.image_url}
                alt={img.alt || ""}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      );
    }

    case "code":
      return (
        <div className="mb-4">
          {element.language && (
            <div className="bg-charcoal/90 text-gray-400 text-xs px-4 py-1.5 rounded-t-lg font-mono">
              {element.language}
            </div>
          )}
          <pre
            className={`bg-charcoal text-white p-4 overflow-x-auto text-sm font-mono ${
              element.language ? "rounded-b-lg" : "rounded-lg"
            }`}
          >
            <code>{element.code}</code>
          </pre>
        </div>
      );

    default:
      return null;
  }
}
