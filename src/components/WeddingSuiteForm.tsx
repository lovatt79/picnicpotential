"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  PricedCheckboxOption,
  PricedRadioOption,
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
    body: "We just need a few basics so we can get in touch about your special day.",
    icon: "👋",
  },
  {
    key: "couple",
    label: "The Couple",
    heading: "Tell us about the couple",
    body: "We love celebrating love! Let us know the names of the happy couple so we can personalize everything perfectly.",
    icon: "💍",
  },
  {
    key: "venue",
    label: "Venue Details",
    heading: "Where's the celebration?",
    body: "Share the venue details so we can coordinate setup and timing with your wedding day schedule.",
    icon: "🏛️",
  },
  {
    key: "package",
    label: "Your Package",
    heading: "Choose your suite",
    body: "Select the perfect package for your wedding party. Each suite is designed to create a relaxing, memorable getting-ready experience.",
    icon: "✨",
  },
  {
    key: "food",
    label: "Food & Drinks",
    heading: "Let's talk food & drinks",
    body: "From charcuterie boards to mimosa bars, choose the perfect spread for your wedding party to enjoy while getting ready.",
    icon: "🥂",
  },
  {
    key: "extras",
    label: "Extras & Gifts",
    heading: "Make it extra special",
    body: "Add the finishing touches — from decor and neon signs to matching robes and personalized gifts for the wedding party.",
    icon: "🎁",
  },
  {
    key: "final",
    label: "Final Details",
    heading: "Almost there!",
    body: "Just a couple more things so we can make your wedding suite experience absolutely perfect.",
    icon: "💌",
  },
];

// ─── Types ──────────────────────────────────────────────────

interface WsFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  coupleName1: string;
  coupleName2: string;
  venueName: string;
  venueAddress: string;
  venueContactName: string;
  venueContactEmail: string;
  venueContactPhone: string;
  eventDate: string;
  arrivalTime: string;
  suiteAccessTime: string;
  peopleCount: string;
  package: string;
  foodOptions: Record<string, number>;
  addonOptions: string[];
  giftOptions: string[];
  swapRequest: string;
  howDidYouHear: string;
  howDidYouHearOther: string;
  notes: string;
}

interface PackageOption {
  label: string;
  description: string | null;
  price: number | null;
}

// ─── Main Component ─────────────────────────────────────────

export default function WeddingSuiteForm() {
  const formRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Database-driven form options
  const [packageOptions, setPackageOptions] = useState<PackageOption[]>([]);
  const [foodOptions, setFoodOptions] = useState<PricedOption[]>([]);
  const [addonOptions, setAddonOptions] = useState<PricedOption[]>([]);
  const [giftOptions, setGiftOptions] = useState<PricedOption[]>([]);
  const [attributionOptions, setAttributionOptions] = useState<string[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    async function loadFormOptions() {
      const supabase = createClient();
      const [packages, food, addons, gifts, attribution] = await Promise.all([
        supabase.from("ws_package_options").select("label, description, price").eq("is_active", true).order("sort_order"),
        supabase.from("ws_food_options").select("label, description, price, price_unit, category").eq("is_active", true).order("sort_order"),
        supabase.from("ws_addon_options").select("label, description, price, price_unit, category").eq("is_active", true).order("sort_order"),
        supabase.from("ws_gift_options").select("label, description, price, price_unit").eq("is_active", true).order("sort_order"),
        supabase.from("form_attribution_options").select("label").eq("is_active", true).order("sort_order"),
      ]);
      if (packages.data) setPackageOptions(packages.data);
      if (food.data) setFoodOptions(food.data.map((f) => ({ ...f, min_quantity: null })));
      if (addons.data) setAddonOptions(addons.data.map((a) => ({ ...a, min_quantity: null })));
      if (gifts.data) setGiftOptions(gifts.data.map((g) => ({ ...g, min_quantity: null, price_unit: g.price_unit ?? "per_set" })));
      if (attribution.data) setAttributionOptions(attribution.data.map((a) => a.label));
      setLoadingOptions(false);
    }
    loadFormOptions();
  }, []);

  const scrollToTop = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const [formData, setFormData] = useState<WsFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    coupleName1: "",
    coupleName2: "",
    venueName: "",
    venueAddress: "",
    venueContactName: "",
    venueContactEmail: "",
    venueContactPhone: "",
    eventDate: "",
    arrivalTime: "",
    suiteAccessTime: "",
    peopleCount: "",
    package: "",
    foodOptions: {},
    addonOptions: [],
    giftOptions: [],
    swapRequest: "",
    howDidYouHear: "",
    howDidYouHearOther: "",
    notes: "",
  });

  const updateField = (field: keyof WsFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArray = (field: "addonOptions" | "giftOptions", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const toggleFoodItem = (label: string, defaultQty: number) => {
    setFormData((prev) => {
      const current = { ...prev.foodOptions };
      if (label in current) {
        delete current[label];
      } else {
        current[label] = defaultQty;
      }
      return { ...prev, foodOptions: current };
    });
  };

  const updateFoodQuantity = (label: string, qty: number) => {
    setFormData((prev) => ({
      ...prev,
      foodOptions: { ...prev.foodOptions, [label]: qty },
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const foodPayload = Object.entries(formData.foodOptions).map(([label, qty]) => ({
        label,
        quantity: qty,
      }));
      const payload = {
        ...formData,
        foodOptions: foodPayload,
      };
      const res = await fetch("/api/wedding-suite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Loading state ────────────────────────────────────────

  if (loadingOptions) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-12 text-center shadow-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto" />
        <p className="mt-4 text-warm-gray">Loading form options...</p>
      </div>
    );
  }

  // ─── Success state ────────────────────────────────────────

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-12 text-center shadow-sm">
        <svg className="mx-auto h-16 w-16 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-6 font-serif text-2xl text-charcoal">Thank You!</h3>
        <p className="mt-4 text-warm-gray">
          Thank you for submitting your wedding suite request! We&apos;re so excited to help make your
          special day even more memorable. We&apos;ll be in touch soon with all the details.
        </p>
      </div>
    );
  }

  // ─── Grouped options helpers ──────────────────────────────

  const foodByCategory = foodOptions.reduce<Record<string, PricedOption[]>>((acc, opt) => {
    const cat = opt.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(opt);
    return acc;
  }, {});

  const addonsByCategory = addonOptions.reduce<Record<string, PricedOption[]>>((acc, opt) => {
    const cat = opt.category || "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(opt);
    return acc;
  }, {});

  const categoryLabels: Record<string, string> = {
    charcuterie: "Charcuterie",
    drinks: "Drinks",
    desserts: "Desserts",
    essentials: "Essentials",
    decor: "Decor",
    neon_signs: "Neon Signs",
    flowers: "Flowers",
    equipment: "Equipment",
  };

  // ─── Current step sidebar ─────────────────────────────────

  const currentStep = STEPS[step];

  // ─── Render ───────────────────────────────────────────────

  return (
    <div ref={formRef}>
      {/* Progress bar */}
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
        {/* Left sidebar */}
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

            {/* ─── Step 2: The Couple ─────────────────── */}
            {step === 1 && (
              <div className="space-y-5">
                <h3 className="font-serif text-2xl text-charcoal">The Happy Couple</h3>
                <p className="text-warm-gray text-sm">Who&apos;s getting married? We&apos;ll use these names for personalization.</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Partner 1 Name *</label>
                    <input type="text" required value={formData.coupleName1} onChange={(e) => updateField("coupleName1", e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Partner 2 Name *</label>
                    <input type="text" required value={formData.coupleName2} onChange={(e) => updateField("coupleName2", e.target.value)} className={inputClass} />
                  </div>
                </div>
              </div>
            )}

            {/* ─── Step 3: Venue Details ──────────────── */}
            {step === 2 && (
              <div className="space-y-5">
                <h3 className="font-serif text-2xl text-charcoal">Venue Details</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Venue Name *</label>
                    <input type="text" required value={formData.venueName} onChange={(e) => updateField("venueName", e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Venue Address</label>
                    <input type="text" value={formData.venueAddress} onChange={(e) => updateField("venueAddress", e.target.value)} className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-3">Venue Contact</label>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs text-warm-gray mb-1">Name</label>
                      <input type="text" value={formData.venueContactName} onChange={(e) => updateField("venueContactName", e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs text-warm-gray mb-1">Email</label>
                      <input type="email" value={formData.venueContactEmail} onChange={(e) => updateField("venueContactEmail", e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-xs text-warm-gray mb-1">Phone</label>
                      <input type="tel" value={formData.venueContactPhone} onChange={(e) => updateField("venueContactPhone", e.target.value)} className={inputClass} />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Wedding Date *</label>
                    <input type="date" required value={formData.eventDate} onChange={(e) => updateField("eventDate", e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Arrival Time</label>
                    <input type="time" value={formData.arrivalTime} onChange={(e) => updateField("arrivalTime", e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Suite Access Time</label>
                    <input type="time" value={formData.suiteAccessTime} onChange={(e) => updateField("suiteAccessTime", e.target.value)} className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">How many people in the wedding party?</label>
                  <input type="text" value={formData.peopleCount} onChange={(e) => updateField("peopleCount", e.target.value)} className={inputClass} placeholder="e.g., 8" />
                </div>
              </div>
            )}

            {/* ─── Step 4: Your Package ───────────────── */}
            {step === 3 && (
              <div className="space-y-5">
                <h3 className="font-serif text-2xl text-charcoal">Choose Your Package</h3>
                <div className="space-y-3">
                  {packageOptions.map((pkg) => (
                    <PricedRadioOption
                      key={pkg.label}
                      label={pkg.label}
                      price={pkg.price}
                      priceUnit="flat"
                      description={pkg.description || undefined}
                      checked={formData.package === pkg.label}
                      onChange={() => updateField("package", pkg.label)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ─── Step 5: Food & Drinks ──────────────── */}
            {step === 4 && (
              <div className="space-y-6">
                <h3 className="font-serif text-2xl text-charcoal">Food &amp; Drinks</h3>
                {Object.entries(foodByCategory).map(([cat, items]) => (
                  <div key={cat}>
                    <h4 className="text-sm font-semibold text-charcoal uppercase tracking-wide mb-3">
                      {categoryLabels[cat] || cat}
                    </h4>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {items.map((item) => (
                        <PricedCheckboxOption
                          key={item.label}
                          label={item.label}
                          price={item.price}
                          priceUnit={item.price_unit}
                          description={item.description || undefined}
                          checked={item.label in formData.foodOptions}
                          onChange={() => toggleFoodItem(item.label, 1)}
                          showQuantity
                          quantity={formData.foodOptions[item.label]}
                          onQuantityChange={(qty) => updateFoodQuantity(item.label, qty)}
                          quantityUnit={getQuantityUnit(item.price_unit)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ─── Step 6: Extras & Gifts ─────────────── */}
            {step === 5 && (
              <div className="space-y-6">
                <h3 className="font-serif text-2xl text-charcoal">Extras &amp; Gifts</h3>

                {/* Add-ons by category */}
                {Object.entries(addonsByCategory).map(([cat, items]) => (
                  <div key={cat}>
                    <h4 className="text-sm font-semibold text-charcoal uppercase tracking-wide mb-3">
                      {categoryLabels[cat] || cat}
                    </h4>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {items.map((item) => (
                        <PricedCheckboxOption
                          key={item.label}
                          label={item.label}
                          price={item.price}
                          priceUnit={item.price_unit}
                          description={item.description || undefined}
                          checked={formData.addonOptions.includes(item.label)}
                          onChange={() => toggleArray("addonOptions", item.label)}
                        />
                      ))}
                    </div>
                  </div>
                ))}

                {/* Wedding party gifts */}
                {giftOptions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-charcoal uppercase tracking-wide mb-1">
                      Wedding Party Gifts
                    </h4>
                    <p className="text-xs text-warm-gray mb-3">Pricing is per set of 6</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {giftOptions.map((item) => (
                        <PricedCheckboxOption
                          key={item.label}
                          label={item.label}
                          price={item.price}
                          priceUnit={item.price_unit}
                          description={item.description || undefined}
                          checked={formData.giftOptions.includes(item.label)}
                          onChange={() => toggleArray("giftOptions", item.label)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── Step 7: Final Details ──────────────── */}
            {step === 6 && (
              <div className="space-y-5">
                <h3 className="font-serif text-2xl text-charcoal">Final Details</h3>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Swap Requests</label>
                  <p className="text-xs text-warm-gray mb-2">
                    Want to swap out any items in your package for something else? Let us know!
                  </p>
                  <textarea
                    rows={3}
                    value={formData.swapRequest}
                    onChange={(e) => updateField("swapRequest", e.target.value)}
                    className={`${inputClass} resize-none`}
                    placeholder="e.g., Swap slippers for custom socks..."
                  />
                </div>

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

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Notes</label>
                  <p className="text-xs text-warm-gray mb-2">
                    Tell us anything else we should know — special themes, dietary needs, or any other details about your wedding day.
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
