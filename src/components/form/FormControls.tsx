// Shared form control components used by MultiStepForm and WeddingSuiteForm

export interface PricedOption {
  label: string;
  price: number | null;
  price_unit: string | null;
  min_quantity: number | null;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  category?: string;
  description?: string;
}

export function formatPrice(price: number | null, priceUnit: string | null): string {
  if (!price) return "";
  const unit =
    priceUnit === "per_person" ? "/person"
    : priceUnit === "per_dozen" ? "/dozen"
    : priceUnit === "per_hour" ? "/hour"
    : priceUnit === "per_set" ? "/set of 6"
    : priceUnit === "flat" ? ""
    : "";
  return `$${price % 1 === 0 ? price.toFixed(0) : price.toFixed(2)}${unit}`;
}

export function getQuantityUnit(priceUnit: string | null): string {
  switch (priceUnit) {
    case "per_dozen": return "dozen";
    case "per_person": return "people";
    case "per_hour": return "hours";
    case "per_set": return "sets of 6";
    case "flat":
    default: return "";
  }
}

export const inputClass =
  "w-full rounded-lg border border-sage px-4 py-2.5 text-sm focus:border-gold focus:outline-none";

export const inputErrorClass =
  "w-full rounded-lg border border-red-400 px-4 py-2.5 text-sm focus:border-red-500 focus:outline-none";

export function getInputClass(fieldName: string, errors: Record<string, string>): string {
  return fieldName in errors ? inputErrorClass : inputClass;
}

export function CheckboxOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 transition-colors ${
        checked ? "border-gold bg-gold/5" : "border-sage/50 hover:border-sage-dark"
      }`}
    >
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <div
        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 ${
          checked ? "border-gold bg-gold text-white" : "border-sage"
        }`}
      >
        {checked && (
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-sm text-charcoal leading-snug">{label}</span>
    </label>
  );
}

export function PricedCheckboxOption({
  label,
  price,
  priceUnit,
  minQuantity,
  isVegan,
  isGlutenFree,
  checked,
  onChange,
  description,
  showQuantity,
  quantity,
  onQuantityChange,
  quantityUnit,
}: {
  label: string;
  price: number | null;
  priceUnit: string | null;
  minQuantity?: number | null;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  checked: boolean;
  onChange: () => void;
  description?: string;
  showQuantity?: boolean;
  quantity?: number;
  onQuantityChange?: (qty: number) => void;
  quantityUnit?: string;
}) {
  const priceText = formatPrice(price, priceUnit);
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 transition-colors ${
        checked ? "border-gold bg-gold/5" : "border-sage/50 hover:border-sage-dark"
      }`}
    >
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <div
        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 ${
          checked ? "border-gold bg-gold text-white" : "border-sage"
        }`}
      >
        {checked && (
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm text-charcoal leading-snug">
            {label}
            {isVegan && (
              <span className="ml-1.5 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                Vegan
              </span>
            )}
            {isGlutenFree && (
              <span className="ml-1.5 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                GF
              </span>
            )}
          </span>
          {priceText && (
            <span className="flex-shrink-0 rounded-full bg-gold/10 px-2.5 py-0.5 text-xs font-semibold text-gold-dark whitespace-nowrap">
              {priceText}
            </span>
          )}
        </div>
        {description && <p className="mt-0.5 text-xs text-warm-gray">{description}</p>}
        {minQuantity && minQuantity > 1 && !showQuantity && (
          <p className="mt-0.5 text-xs text-warm-gray">Min order: {minQuantity}</p>
        )}
        {checked && showQuantity && (
          <div className="mt-2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <span className="text-xs text-warm-gray">Qty:</span>
            <input
              type="number"
              min={minQuantity && minQuantity > 1 ? minQuantity : 1}
              value={quantity || 1}
              onChange={(e) => {
                e.stopPropagation();
                onQuantityChange?.(Math.max(1, parseInt(e.target.value) || 1));
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-16 rounded-lg border border-sage px-2 py-1 text-sm text-center focus:border-gold focus:outline-none"
            />
            {quantityUnit && <span className="text-xs text-warm-gray">{quantityUnit}</span>}
          </div>
        )}
      </div>
    </label>
  );
}

export function RadioOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition-colors ${
        checked ? "border-gold bg-gold/5" : "border-sage/50 hover:border-sage-dark"
      }`}
    >
      <input type="radio" checked={checked} onChange={onChange} className="sr-only" />
      <div
        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
          checked ? "border-gold" : "border-sage"
        }`}
      >
        {checked && <div className="h-2.5 w-2.5 rounded-full bg-gold" />}
      </div>
      <span className="text-sm text-charcoal">{label}</span>
    </label>
  );
}

export function PricedRadioOption({
  label,
  price,
  priceUnit,
  description,
  checked,
  onChange,
}: {
  label: string;
  price: number | null;
  priceUnit: string | null;
  description?: string;
  checked: boolean;
  onChange: () => void;
}) {
  const priceText = formatPrice(price, priceUnit);
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 transition-colors ${
        checked ? "border-gold bg-gold/5" : "border-sage/50 hover:border-sage-dark"
      }`}
    >
      <input type="radio" checked={checked} onChange={onChange} className="sr-only" />
      <div
        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
          checked ? "border-gold" : "border-sage"
        }`}
      >
        {checked && <div className="h-2.5 w-2.5 rounded-full bg-gold" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-sm text-charcoal leading-snug">{label}</span>
            {description && <p className="mt-0.5 text-xs text-warm-gray">{description}</p>}
          </div>
          {priceText && (
            <span className="flex-shrink-0 rounded-full bg-gold/10 px-2.5 py-0.5 text-xs font-semibold text-gold-dark whitespace-nowrap">
              {priceText}
            </span>
          )}
        </div>
      </div>
    </label>
  );
}
