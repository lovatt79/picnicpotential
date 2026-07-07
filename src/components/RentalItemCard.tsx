interface PricingLine {
  label: string;
  price: number;
}

interface Spec {
  label: string;
  value: string;
}

interface RentalItemCardProps {
  title: string;
  description: string;
  specs?: Spec[];
  pricing: PricingLine[];
  addOns?: PricingLine[];
}

const PASTEL_GRADIENTS = [
  "from-blush to-peach-light",
  "from-sage-light to-sky-light",
  "from-lavender-light to-blush-light",
  "from-peach to-gold-light",
  "from-sky-light to-sage-light",
  "from-blush-light to-lavender-light",
];

export default function RentalItemCard({
  title,
  description,
  specs,
  pricing,
  addOns,
}: RentalItemCardProps) {
  const gradient = PASTEL_GRADIENTS[title.length % PASTEL_GRADIENTS.length];

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
      {/* Gradient header */}
      <div className={`flex h-24 items-center justify-center bg-gradient-to-br ${gradient} px-6`}>
        <span className="font-serif text-lg text-charcoal/70 text-center">{title}</span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm leading-relaxed text-warm-gray">{description}</p>

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
      </div>
    </div>
  );
}
