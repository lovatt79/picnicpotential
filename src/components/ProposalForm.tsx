"use client";

import { useState, useRef, useEffect } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { createClient } from "@/lib/supabase/client";
import { validateStep, type ValidationErrors } from "@/lib/formValidation";
import { FieldError } from "@/components/form/FieldError";
import {
  PricedCheckboxOption,
  PricedRadioOption,
  RadioOption,
  inputClass,
  getInputClass,
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
    key: "proposal",
    label: "The Proposal",
    heading: "Tell us about the proposal",
    body: "Share the details of your proposal vision — who, when, and where — so we can create an unforgettable moment.",
    icon: "💍",
  },
  {
    key: "package",
    label: "Your Package",
    heading: "Choose your package",
    body: "Select the perfect proposal package. Each one is designed to create a stunning, memorable setup for your big question.",
    icon: "✨",
  },
  {
    key: "addons",
    label: "Add-ons",
    heading: "Customize your setup",
    body: "Enhance your proposal with extra decor and special touches to make it truly one-of-a-kind.",
    icon: "🎨",
  },
  {
    key: "food",
    label: "Food & Extras",
    heading: "Add food & flowers",
    body: "Complete your proposal experience with delicious food boxes and beautiful floral additions.",
    icon: "🥂",
  },
  {
    key: "final",
    label: "Final Details",
    heading: "Almost there!",
    body: "Just a couple more things so we can make your proposal absolutely perfect.",
    icon: "💌",
  },
];

// ─── Types ──────────────────────────────────────────────────

interface ProposalFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  proposeeName: string;
  proposalDate1: string;
  proposalDate2: string;
  proposalTime: string;
  location: string;
  locationDetails: string;
  colors: string;
  package: string;
  addonOptions: string[];
  foodOptions: string[];
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

export default function ProposalForm() {
  const formRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  // Database-driven form options
  const [packageOptions, setPackageOptions] = useState<PackageOption[]>([]);
  const [addonOptions, setAddonOptions] = useState<PricedOption[]>([]);
  const [foodOptions, setFoodOptions] = useState<PricedOption[]>([]);
  const [attributionOptions, setAttributionOptions] = useState<string[]>([]);
  const [locationOptions, setLocationOptions] = useState<{ label: string; location_type: string | null; city: string | null }[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    async function loadFormOptions() {
      const supabase = createClient();
      const [packages, addons, food, attribution, locations] = await Promise.all([
        supabase.from("prop_package_options").select("label, description, price").eq("is_active", true).order("sort_order"),
        supabase.from("prop_addon_options").select("label, description, price, price_unit").eq("is_active", true).order("sort_order"),
        supabase.from("prop_food_options").select("label, description, price, price_unit, category").eq("is_active", true).order("sort_order"),
        supabase.from("form_attribution_options").select("label").eq("is_active", true).order("sort_order"),
        supabase.from("form_location_options").select("label, location_type, city").eq("is_active", true).order("sort_order"),
      ]);
      if (packages.data) setPackageOptions(packages.data);
      if (addons.data) setAddonOptions(addons.data.map((a) => ({ ...a, min_quantity: null })));
      if (food.data) setFoodOptions(food.data.map((f) => ({ ...f, min_quantity: null })));
      if (attribution.data) setAttributionOptions(attribution.data.map((a) => a.label));
      setLocationOptions((locations.data || []) as { label: string; location_type: string | null; city: string | null }[]);
      setLoadingOptions(false);
    }
    loadFormOptions();
  }, []);

  const scrollToTop = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const [formData, setFormData] = useState<ProposalFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    proposeeName: "",
    proposalDate1: "",
    proposalDate2: "",
    proposalTime: "",
    location: "",
    locationDetails: "",
    colors: "",
    package: "",
    addonOptions: [],
    foodOptions: [],
    howDidYouHear: "",
    howDidYouHearOther: "",
    notes: "",
  });

  const updateField = (field: keyof ProposalFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const toggleArray = (field: "addonOptions" | "foodOptions", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleNext = () => {
    const stepErrors = validateStep("proposal", step, formData as unknown as Record<string, unknown>);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep(step + 1);
    scrollToTop();
  };

  const handleSubmit = async () => {
    const stepErrors = validateStep("proposal", step, formData as unknown as Record<string, unknown>);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    if (!turnstileToken) {
      alert("Please complete the verification challenge.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, turnstileToken: turnstileToken || "disabled" }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const result = await res.json();
        alert(result.message || "Something went wrong.");
      }
    } catch {
      alert("Something went wrong. Please try again or email us directly at Info@picnicpotential.com");
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
          Thank you for submitting your proposal request! We&apos;re so excited to help make this
          moment unforgettable. We&apos;ll be in touch soon with all the details.
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

  const categoryLabels: Record<string, string> = {
    food: "Food",
    flowers: "Additional Flowers",
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
                    <input type="text" required value={formData.firstName} onChange={(e) => updateField("firstName", e.target.value)} className={getInputClass("firstName", errors)} />
                    <FieldError message={errors.firstName} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Last Name *</label>
                    <input type="text" required value={formData.lastName} onChange={(e) => updateField("lastName", e.target.value)} className={getInputClass("lastName", errors)} />
                    <FieldError message={errors.lastName} />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Phone Number *</label>
                    <input type="tel" required value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} className={getInputClass("phone", errors)} />
                    <FieldError message={errors.phone} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Email *</label>
                    <input type="email" required value={formData.email} onChange={(e) => updateField("email", e.target.value)} className={getInputClass("email", errors)} />
                    <FieldError message={errors.email} />
                  </div>
                </div>
              </div>
            )}

            {/* ─── Step 2: The Proposal ─────────────────── */}
            {step === 1 && (
              <div className="space-y-5">
                <h3 className="font-serif text-2xl text-charcoal">Proposal Details</h3>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Who are you proposing to? *</label>
                  <input type="text" required value={formData.proposeeName} onChange={(e) => updateField("proposeeName", e.target.value)} className={getInputClass("proposeeName", errors)} />
                  <FieldError message={errors.proposeeName} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Proposal Date (1st Choice) *</label>
                    <input type="date" required value={formData.proposalDate1} onChange={(e) => updateField("proposalDate1", e.target.value)} className={getInputClass("proposalDate1", errors)} />
                    <FieldError message={errors.proposalDate1} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Proposal Date (2nd Choice)</label>
                    <input type="date" value={formData.proposalDate2} onChange={(e) => updateField("proposalDate2", e.target.value)} className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Time of Proposal</label>
                  <input type="time" value={formData.proposalTime} onChange={(e) => updateField("proposalTime", e.target.value)} className={inputClass} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Location *</label>
                  <select
                    value={formData.location}
                    onChange={(e) => {
                      updateField("location", e.target.value);
                      if (formData.locationDetails) updateField("locationDetails", "");
                    }}
                    className={getInputClass("location", errors)}
                  >
                    <option value="">Select a location...</option>
                    {locationOptions.map((loc) => (
                      <option key={loc.label} value={loc.label}>
                        {loc.label}{loc.city ? ` — ${loc.city}` : ""}
                      </option>
                    ))}
                  </select>
                  <FieldError message={errors.location} />
                </div>
                {(() => {
                  const selected = locationOptions.find((l) => l.label === formData.location);
                  const needsDetails = selected?.location_type === "home" || selected?.location_type === "other";
                  return needsDetails ? (
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">Address and Details</label>
                      <textarea
                        rows={2}
                        value={formData.locationDetails}
                        onChange={(e) => updateField("locationDetails", e.target.value)}
                        className={`${inputClass} resize-none`}
                        placeholder="Please provide the address and any relevant details"
                      />
                    </div>
                  ) : null;
                })()}

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Colors (Build Out)</label>
                  <input type="text" value={formData.colors} onChange={(e) => updateField("colors", e.target.value)} className={inputClass} placeholder="What colors do you envision?" />
                </div>
              </div>
            )}

            {/* ─── Step 3: Your Package ───────────────── */}
            {step === 2 && (
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

            {/* ─── Step 4: Add-ons ──────────────────────── */}
            {step === 3 && (
              <div className="space-y-5">
                <h3 className="font-serif text-2xl text-charcoal">Add-on Options</h3>
                <p className="text-warm-gray text-sm">Enhance your proposal with these extras. Select as many as you&apos;d like.</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {addonOptions.map((item) => (
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
            )}

            {/* ─── Step 5: Food & Extras ────────────────── */}
            {step === 4 && (
              <div className="space-y-6">
                <h3 className="font-serif text-2xl text-charcoal">Food &amp; Extras</h3>
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
                          checked={formData.foodOptions.includes(item.label)}
                          onChange={() => toggleArray("foodOptions", item.label)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ─── Step 6: Final Details ──────────────── */}
            {step === 5 && (
              <div className="space-y-5">
                <h3 className="font-serif text-2xl text-charcoal">Final Details</h3>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">How did you hear about us? *</label>
                  <FieldError message={errors.howDidYouHear} />
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
                    Tell us anything else we should know — special themes, dietary needs, or any other details about your proposal.
                  </p>
                  <textarea
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    className={`${inputClass} resize-none`}
                    placeholder="If you wish to add any item, theme, etc. and you don't see it above, please add it here..."
                  />
                </div>

                <div className="mt-6">
                  <Turnstile
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                    onSuccess={(token) => setTurnstileToken(token)}
                    onError={() => setTurnstileToken(null)}
                    onExpire={() => setTurnstileToken(null)}
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
                  onClick={handleNext}
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
