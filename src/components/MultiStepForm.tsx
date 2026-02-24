"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  CheckboxOption,
  PricedCheckboxOption,
  RadioOption,
  formatPrice,
  inputClass,
  getQuantityUnit,
  type PricedOption,
} from "@/components/form/FormControls";

// ─── Step definitions with sidebar content ──────────────────

const STEPS = [
  {
    key: "contact",
    label: "About You",
    heading: "Let's start with you",
    body: "We just need a few basics so we can get back to you with a custom quote and all the details for your perfect event.",
    icon: "👋",
  },
  {
    key: "event",
    label: "Your Event",
    heading: "Tell us about your event",
    body: "Every celebration is unique! Share the details and we'll design something that fits your occasion, group, and venue perfectly.",
    icon: "🗓️",
  },
  {
    key: "location",
    label: "Location & Guests",
    heading: "Where's the party?",
    body: "We set up at parks, wineries, backyards, and private venues across Sonoma County. Let us know where you're thinking — or we can help you choose!",
    icon: "📍",
  },
  {
    key: "style",
    label: "Style & Color",
    heading: "What's your vibe?",
    body: "From boho neutrals to bright color pops, pick the color scheme that sets the mood. Don't worry — we'll make it look stunning no matter what you choose.",
    icon: "🎨",
  },
  {
    key: "food",
    label: "Food",
    heading: "Let's talk food",
    body: "Our food boards and bites are beautifully arranged and perfect for sharing. Select everything that sounds delicious — there are no wrong answers here!",
    icon: "🧀",
  },
  {
    key: "desserts",
    label: "Desserts",
    heading: "Save room for something sweet",
    body: "From themed cookies and cake pops to vegan truffles and macaron boxes, our dessert partners create treats that taste as good as they look.",
    icon: "🧁",
  },
  {
    key: "addons",
    label: "Extras",
    heading: "Make it extra special",
    body: "Level up your experience with lawn games, flowers, tents, a professional photographer, and more. These are the finishing touches that take it from great to unforgettable.",
    icon: "✨",
  },
  {
    key: "final",
    label: "Final Details",
    heading: "Almost there!",
    body: "Just a couple more things so we can personalize your experience. Let us know how you found us, and share any special requests or details we should know about.",
    icon: "💌",
  },
];

// ─── Types ──────────────────────────────────────────────────

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  eventDate: string;
  backupDate: string;
  eventType: string;
  eventTime: string;
  additionalTime: string;
  occasion: string;
  city: string;
  exactLocation: string;
  groupSize: string;
  guestNames: string;
  colorChoice1: string;
  colorChoice1Other: string;
  colorChoice2: string;
  colorChoice2Other: string;
  foodOptions: Record<string, number>;
  dessertOptions: Record<string, number>;
  dessertOther: string;
  addOns: string[];
  howDidYouHear: string;
  howDidYouHearOther: string;
  referredBy: string;
  notes: string;
}

// ─── Helpers ────────────────────────────────────────────────

const ADDITIONAL_TIME = [
  "1 Hour / $50",
  "2 Hours / $100",
  "3 Hours / $150",
  "4+ Hours (we will contact you to discuss pricing)",
];

// ─── Sub-components imported from @/components/form/FormControls ──

// ─── Main Component ─────────────────────────────────────────

export default function MultiStepForm() {
  const formRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Database-driven form options
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [colorOptions, setColorOptions] = useState<string[]>([]);
  const [foodOptions, setFoodOptions] = useState<PricedOption[]>([]);
  const [dessertOptions, setDessertOptions] = useState<PricedOption[]>([]);
  const [addonOptions, setAddonOptions] = useState<PricedOption[]>([]);
  const [occasionOptions, setOccasionOptions] = useState<string[]>([]);
  const [attributionOptions, setAttributionOptions] = useState<string[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    async function loadFormOptions() {
      const supabase = createClient();
      const [events, colors, food, desserts, addons, occasions, attribution] = await Promise.all([
        supabase.from("form_event_types").select("label").eq("is_active", true).order("sort_order"),
        supabase.from("form_color_options").select("label").eq("is_active", true).order("sort_order"),
        supabase.from("form_food_options").select("label, price, price_unit, min_quantity").eq("is_active", true).order("sort_order"),
        supabase.from("form_dessert_options").select("label, price, price_unit, min_quantity, is_vegan").eq("is_active", true).order("sort_order"),
        supabase.from("form_addon_options").select("label, price, price_unit, category").eq("is_active", true).order("sort_order"),
        supabase.from("form_occasion_options").select("label").eq("is_active", true).order("sort_order"),
        supabase.from("form_attribution_options").select("label").eq("is_active", true).order("sort_order"),
      ]);
      setEventTypes((events.data || []).map((e: any) => e.label));
      setColorOptions((colors.data || []).map((c: any) => c.label));
      setFoodOptions((food.data || []) as PricedOption[]);
      setDessertOptions((desserts.data || []) as PricedOption[]);
      setAddonOptions((addons.data || []) as PricedOption[]);
      setOccasionOptions((occasions.data || []).map((o: any) => o.label));
      setAttributionOptions((attribution.data || []).map((a: any) => a.label));
      setLoadingOptions(false);
    }
    loadFormOptions();
  }, []);

  const scrollToTop = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    eventDate: "",
    backupDate: "",
    eventType: "",
    eventTime: "",
    additionalTime: "",
    occasion: "",
    city: "",
    exactLocation: "",
    groupSize: "",
    guestNames: "",
    colorChoice1: "",
    colorChoice1Other: "",
    colorChoice2: "",
    colorChoice2Other: "",
    foodOptions: {},
    dessertOptions: {},
    dessertOther: "",
    addOns: [],
    howDidYouHear: "",
    howDidYouHearOther: "",
    referredBy: "",
    notes: "",
  });

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAddOn = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      addOns: prev.addOns.includes(value)
        ? prev.addOns.filter((v) => v !== value)
        : [...prev.addOns, value],
    }));
  };

  const toggleQuantityItem = (field: "foodOptions" | "dessertOptions", label: string, defaultQty: number) => {
    setFormData((prev) => {
      const current = { ...prev[field] };
      if (label in current) {
        delete current[label];
      } else {
        current[label] = defaultQty;
      }
      return { ...prev, [field]: current };
    });
  };

  const updateQuantity = (field: "foodOptions" | "dessertOptions", label: string, qty: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [label]: qty },
    }));
  };

  const formatSelections = (items: Record<string, number>, optionsList: PricedOption[]): string[] => {
    return Object.entries(items).map(([label, qty]) => {
      const option = optionsList.find((o) => o.label === label);
      const unit = getQuantityUnit(option?.price_unit ?? null);
      return unit ? `${label} (${qty} ${unit})` : `${label} (x${qty})`;
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        foodOptions: formatSelections(formData.foodOptions, foodOptions),
        dessertOptions: formatSelections(formData.dessertOptions, dessertOptions),
      };
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      alert("Something went wrong. Please try again or email us directly at Info@picnicpotential.com");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Loading state ──────────────────────────────────────

  if (loadingOptions) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-12 text-center shadow-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto" />
        <p className="mt-4 text-warm-gray">Loading form options...</p>
      </div>
    );
  }

  // ─── Success state ──────────────────────────────────────

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-12 text-center shadow-sm">
        <svg className="mx-auto h-16 w-16 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-6 font-serif text-2xl text-charcoal">Thank You!</h3>
        <p className="mt-4 text-warm-gray">
          Thank you for submitting the picnic request form. We look forward to setting up your
          picnic or event very soon! Please note that picnic reservations are not secured until
          the deposit has been received.
        </p>
      </div>
    );
  }

  // ─── Current step sidebar ───────────────────────────────

  const currentStep = STEPS[step];

  // ─── Render ─────────────────────────────────────────────

  return (
    <div ref={formRef}>
      {/* Progress bar - full width above both columns */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-warm-gray mb-2">
          <span className="text-gold font-semibold">
            Step {step + 1} of {STEPS.length}: {currentStep.label}
          </span>
          <span className="text-warm-gray hidden sm:inline">
            {STEPS.map((s, i) => (
              <span key={s.key} className={`${i === step ? "text-gold font-semibold" : i < step ? "text-sage-dark" : ""}`}>
                {i > 0 && " · "}{s.label}
              </span>
            ))}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-sage-light overflow-hidden">
          <div
            className="h-full rounded-full bg-gold transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left sidebar - contextual content */}
        <div className="lg:w-[340px] lg:flex-shrink-0">
          <div className="lg:sticky lg:top-8">
            <div className="rounded-2xl bg-sage-light/50 p-8">
              <div className="text-4xl mb-4">{currentStep.icon}</div>
              <h2 className="font-serif text-2xl text-charcoal leading-snug">
                {currentStep.heading}
              </h2>
              <p className="mt-3 text-warm-gray leading-relaxed">
                {currentStep.body}
              </p>
            </div>

            {/* Step indicators on desktop */}
            <div className="mt-6 hidden lg:block space-y-1">
              {STEPS.map((s, i) => (
                <div
                  key={s.key}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    i === step
                      ? "bg-gold/10 text-charcoal font-medium"
                      : i < step
                      ? "text-sage-dark"
                      : "text-warm-gray/60"
                  }`}
                >
                  <div
                    className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      i === step
                        ? "bg-gold text-white"
                        : i < step
                        ? "bg-sage-dark text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {i < step ? (
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column - form */}
        <div className="flex-1 min-w-0">
          <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm">
            {/* ─── Step 1: About You ──────────────────── */}
            {step === 0 && (
              <div className="space-y-5">
                <h3 className="font-serif text-2xl text-charcoal">Contact Information</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">First Name *</label>
                    <input type="text" required value={formData.firstName} onChange={(e) => updateField("firstName", e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Last Name *</label>
                    <input type="text" required value={formData.lastName} onChange={(e) => updateField("lastName", e.target.value)} className={inputClass} />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Phone Number *</label>
                    <input type="tel" required value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Email *</label>
                    <input type="email" required value={formData.email} onChange={(e) => updateField("email", e.target.value)} className={inputClass} />
                  </div>
                </div>
              </div>
            )}

            {/* ─── Step 2: Your Event ─────────────────── */}
            {step === 1 && (
              <div className="space-y-5">
                <h3 className="font-serif text-2xl text-charcoal">Event Details</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Event Date *</label>
                    <input type="date" required value={formData.eventDate} onChange={(e) => updateField("eventDate", e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Backup Date</label>
                    <input type="date" value={formData.backupDate} onChange={(e) => updateField("backupDate", e.target.value)} className={inputClass} />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Event Time</label>
                    <input type="time" value={formData.eventTime} onChange={(e) => updateField("eventTime", e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Occasion</label>
                    <select value={formData.occasion} onChange={(e) => updateField("occasion", e.target.value)} className={inputClass}>
                      <option value="">Select an occasion</option>
                      {occasionOptions.map((o) => (<option key={o} value={o}>{o}</option>))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Type of event *</label>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {eventTypes.map((type) => (
                      <RadioOption key={type} label={type} checked={formData.eventType === type} onChange={() => updateField("eventType", type)} />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Additional time needed?</label>
                  <p className="text-xs text-warm-gray mb-2">Standard picnic includes 2 hours</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {ADDITIONAL_TIME.map((time) => (
                      <RadioOption key={time} label={time} checked={formData.additionalTime === time} onChange={() => updateField("additionalTime", time)} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── Step 3: Location & Guests ──────────── */}
            {step === 2 && (
              <div className="space-y-5">
                <h3 className="font-serif text-2xl text-charcoal">Location &amp; Guests</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">City</label>
                    <input type="text" value={formData.city} onChange={(e) => updateField("city", e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">How many guests?</label>
                    <input type="text" value={formData.groupSize} onChange={(e) => updateField("groupSize", e.target.value)} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Exact Location</label>
                  <p className="text-xs text-warm-gray mb-2">
                    Either &quot;Home&quot; or name of park/place. Winery partners: Kendall Jackson, Mascarin Family Winery, Rodney Strong, Paradise Ridge, Kohmsa Luxury Vacation Rentals, Matanzas Creek Winery. If your preferred winery is not listed we can still set up there if you secure permission.
                  </p>
                  <input
                    type="text"
                    value={formData.exactLocation}
                    onChange={(e) => updateField("exactLocation", e.target.value)}
                    className={inputClass}
                    placeholder="Home, park name, or winery"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Guest Names</label>
                  <p className="text-xs text-warm-gray mb-2">For personalized place cards</p>
                  <textarea
                    rows={3}
                    value={formData.guestNames}
                    onChange={(e) => updateField("guestNames", e.target.value)}
                    className={`${inputClass} resize-none`}
                    placeholder="List the names of each guest"
                  />
                </div>
              </div>
            )}

            {/* ─── Step 4: Style & Color ──────────────── */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl text-charcoal">1st Choice</h3>
                  <p className="text-sm text-warm-gray mt-1">Pick your favorite color scheme</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {colorOptions.map((color) => (
                      <RadioOption key={color} label={color} checked={formData.colorChoice1 === color} onChange={() => updateField("colorChoice1", color)} />
                    ))}
                    <RadioOption label="Other" checked={formData.colorChoice1 === "Other"} onChange={() => updateField("colorChoice1", "Other")} />
                  </div>
                  {formData.colorChoice1 === "Other" && (
                    <input type="text" placeholder="Describe your preferred setup" value={formData.colorChoice1Other} onChange={(e) => updateField("colorChoice1Other", e.target.value)} className={`mt-2 ${inputClass}`} />
                  )}
                </div>
                <div>
                  <h3 className="font-serif text-xl text-charcoal">2nd Choice</h3>
                  <p className="text-sm text-warm-gray mt-1">In case your first pick isn&apos;t available</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {colorOptions.map((color) => (
                      <RadioOption key={`2-${color}`} label={color} checked={formData.colorChoice2 === color} onChange={() => updateField("colorChoice2", color)} />
                    ))}
                    <RadioOption label="Other" checked={formData.colorChoice2 === "Other"} onChange={() => updateField("colorChoice2", "Other")} />
                  </div>
                  {formData.colorChoice2 === "Other" && (
                    <input type="text" placeholder="Describe your preferred setup" value={formData.colorChoice2Other} onChange={(e) => updateField("colorChoice2Other", e.target.value)} className={`mt-2 ${inputClass}`} />
                  )}
                </div>
              </div>
            )}

            {/* ─── Step 5: Food ───────────────────────── */}
            {step === 4 && (
              <div className="space-y-5">
                <h3 className="font-serif text-2xl text-charcoal">Food Options</h3>
                <p className="text-sm text-warm-gray">Select all that sound good</p>
                <div className="grid gap-2">
                  {foodOptions.map((item) => (
                    <PricedCheckboxOption
                      key={item.label}
                      label={item.label}
                      price={item.price}
                      priceUnit={item.price_unit}
                      minQuantity={item.min_quantity}
                      checked={item.label in formData.foodOptions}
                      onChange={() => toggleQuantityItem("foodOptions", item.label, item.min_quantity || 1)}
                      showQuantity
                      quantity={formData.foodOptions[item.label]}
                      onQuantityChange={(qty) => updateQuantity("foodOptions", item.label, qty)}
                      quantityUnit={getQuantityUnit(item.price_unit)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ─── Step 6: Desserts ───────────────────── */}
            {step === 5 && (
              <div className="space-y-5">
                <h3 className="font-serif text-2xl text-charcoal">Dessert Options</h3>
                <p className="text-sm text-warm-gray">Select all that apply</p>
                <div className="grid gap-2">
                  {dessertOptions.map((item) => (
                    <PricedCheckboxOption
                      key={item.label}
                      label={item.label}
                      price={item.price}
                      priceUnit={item.price_unit}
                      minQuantity={item.min_quantity}
                      isVegan={item.is_vegan}
                      checked={item.label in formData.dessertOptions}
                      onChange={() => toggleQuantityItem("dessertOptions", item.label, item.min_quantity || 1)}
                      showQuantity
                      quantity={formData.dessertOptions[item.label]}
                      onQuantityChange={(qty) => updateQuantity("dessertOptions", item.label, qty)}
                      quantityUnit={getQuantityUnit(item.price_unit)}
                    />
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Other dessert request</label>
                  <input type="text" value={formData.dessertOther} onChange={(e) => updateField("dessertOther", e.target.value)} className={inputClass} placeholder="Any other dessert you'd like?" />
                </div>
              </div>
            )}

            {/* ─── Step 7: Extras ─────────────────────── */}
            {step === 6 && (
              <div className="space-y-5">
                <h3 className="font-serif text-2xl text-charcoal">Add-Ons</h3>
                <p className="text-sm text-warm-gray">Select all that interest you</p>
                <div className="grid gap-2">
                  {addonOptions.map((item) => (
                    <PricedCheckboxOption
                      key={item.label}
                      label={item.label}
                      price={item.price}
                      priceUnit={item.price_unit}
                      minQuantity={null}
                      checked={formData.addOns.includes(item.label)}
                      onChange={() => toggleAddOn(item.label)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ─── Step 8: Final Details ──────────────── */}
            {step === 7 && (
              <div className="space-y-5">
                <h3 className="font-serif text-2xl text-charcoal">Final Details</h3>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">How did you hear about us? *</label>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {attributionOptions.map((option) => (
                      <RadioOption key={option} label={option} checked={formData.howDidYouHear === option} onChange={() => updateField("howDidYouHear", option)} />
                    ))}
                    <RadioOption label="Other" checked={formData.howDidYouHear === "Other"} onChange={() => updateField("howDidYouHear", "Other")} />
                  </div>
                  {formData.howDidYouHear === "Other" && (
                    <input type="text" placeholder="Please specify" value={formData.howDidYouHearOther} onChange={(e) => updateField("howDidYouHearOther", e.target.value)} className={`mt-2 ${inputClass}`} />
                  )}
                </div>

                {formData.howDidYouHear === "Referral" && (
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Who referred you? (so we can thank them!)</label>
                    <input type="text" value={formData.referredBy} onChange={(e) => updateField("referredBy", e.target.value)} className={inputClass} />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Notes</label>
                  <p className="text-xs text-warm-gray mb-2">
                    Tell us anything we should know — what you&apos;re celebrating, special themes, dietary needs, or any other details.
                  </p>
                  <textarea
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    className={`${inputClass} resize-none`}
                    placeholder="Tell us more about your vision..."
                  />
                </div>
              </div>
            )}

            {/* ─── Navigation ─────────────────────────── */}
            <div className="mt-8 flex justify-between">
              {step > 0 ? (
                <button
                  onClick={() => { setStep(step - 1); scrollToTop(); }}
                  className="rounded-full border-2 border-sage px-6 py-2.5 text-sm font-medium text-charcoal transition-colors hover:border-gold"
                >
                  Previous
                </button>
              ) : (
                <div />
              )}
              {step < STEPS.length - 1 ? (
                <button
                  onClick={() => { setStep(step + 1); scrollToTop(); }}
                  className="rounded-full bg-charcoal px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gold"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="rounded-full bg-gold px-8 py-2.5 text-sm font-medium text-charcoal transition-colors hover:bg-gold-light disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Request"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
