import Link from "next/link";
import Image from "next/image";
import type { RentalItem } from "@/lib/rentals";

const PASTEL_GRADIENTS = [
  "from-blush to-peach-light",
  "from-sage-light to-sky-light",
  "from-lavender-light to-blush-light",
  "from-peach to-gold-light",
  "from-sky-light to-sage-light",
  "from-blush-light to-lavender-light",
];

export default function RentalItemCard({ id, title, description, specs, pricing, addOns, images }: RentalItem) {
  const gradient = PASTEL_GRADIENTS[title.length % PASTEL_GRADIENTS.length];
  const coverImage = images?.[0];

  return (
    <Link href={`/rentals/${id}`} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Header: photo or gradient */}
      {coverImage ? (
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className={`flex h-36 items-center justify-center bg-gradient-to-br ${gradient} px-6`}>
          <span className="font-serif text-lg text-charcoal/70 text-center">{title}</span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-serif text-lg text-charcoal">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-warm-gray">{description}</p>

        {/* Specs */}
        {specs && specs.length > 0 && (
          <ul className="mt-4 space-y-1">
            {specs.map((spec) => (
              <li key={spec.label} className="flex gap-1 text-xs text-warm-gray">
                <span className="font-medium text-charcoal/70 shrink-0">{spec.label}:</span>
                <span>{spec.value}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Pricing */}
        <div className="mt-4 border-t border-sage-light pt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/50 mb-2">Pricing</p>
          <ul className="space-y-1">
            {pricing.map((line, i) => (
              <li key={line.label} className="flex items-baseline justify-between gap-2">
                <span className="text-sm text-warm-gray">{line.label}</span>
                <span className={`shrink-0 tabular-nums ${i === 0 ? "text-base font-semibold text-charcoal" : "text-sm text-charcoal"}`}>
                  ${line.price}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Add-ons */}
        {addOns && addOns.length > 0 && (
          <div className="mt-4 border-t border-sage-light pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/50 mb-2">Add-ons</p>
            <ul className="space-y-1">
              {addOns.map((addon) => (
                <li key={addon.label} className="flex items-baseline justify-between gap-2">
                  <span className="text-sm text-warm-gray">{addon.label}</span>
                  <span className="shrink-0 text-sm tabular-nums text-charcoal">+${addon.price}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {images && images.length > 1 && (
          <p className="mt-4 text-xs text-warm-gray/70">{images.length} photos →</p>
        )}
      </div>
    </Link>
  );
}
