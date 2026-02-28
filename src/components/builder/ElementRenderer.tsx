import type { BuilderElement } from "@/lib/builder-types";

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
