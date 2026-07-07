"use client";

import { useState, useRef, useEffect } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { validateStep, type ValidationErrors } from "@/lib/formValidation";
import { FieldError } from "@/components/form/FieldError";
import { DatePicker } from "@/components/form/DatePicker";
import { RadioOption, inputClass, getInputClass } from "@/components/form/FormControls";
import { RENTAL_ITEMS } from "@/lib/rentals";

const STEPS = [
  {
    key: "contact",
    label: "About You",
    heading: "Let's start with you",
    body: "Just the basics so we can follow up about your event.",
    icon: "👋",
  },
  {
    key: "rentals",
    label: "Your Rental",
    heading: "What do you need?",
    body: "Choose the items you're interested in. We'll confirm pricing and availability when we reach out.",
    icon: "🎪",
  },
  {
    key: "final",
    label: "Final Details",
    heading: "Almost there!",
    body: "A few last things and you're all set.",
    icon: "💌",
  },
];

interface RentalFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  eventDate: string;
  location: string;
  selectedItems: string[];
  quantities: Record<string, number>;
  itemColors: Record<string, string[]>;
  selectedAddOns: string[];
  howDidYouHear: string;
  howDidYouHearOther: string;
  notes: string;
}

interface RentalFormProps {
  preSelectedItem?: string;
}

export default function RentalForm({ preSelectedItem }: RentalFormProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [attributionOptions, setAttributionOptions] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/form-options/rentals")
      .then((r) => r.json())
      .then((d) => setAttributionOptions(d.attribution ?? []))
      .catch(() => {});
  }, []);

  // Resolve preSelectedItem (a slug) to the item title
  const preSelectedTitle = preSelectedItem
    ? (RENTAL_ITEMS.find((i) => i.id === preSelectedItem)?.title ?? "")
    : "";

  const [formData, setFormData] = useState<RentalFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    eventDate: "",
    location: "",
    selectedItems: preSelectedTitle ? [preSelectedTitle] : [],
    quantities: preSelectedTitle ? { [preSelectedTitle]: 1 } : {},
    itemColors: {},
    selectedAddOns: [],
    howDidYouHear: "",
    howDidYouHearOther: "",
    notes: "",
  });

  const scrollToTop = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const updateField = (field: keyof RentalFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const toggleItem = (title: string) => {
    setFormData((prev) => {
      const isRemoving = prev.selectedItems.includes(title);
      const selected = isRemoving
        ? prev.selectedItems.filter((t) => t !== title)
        : [...prev.selectedItems, title];
      const addOns = isRemoving
        ? prev.selectedAddOns.filter((a) => !a.startsWith(`${title}: `))
        : prev.selectedAddOns;
      const quantities = { ...prev.quantities };
      const itemColors = { ...prev.itemColors };
      if (isRemoving) { delete quantities[title]; delete itemColors[title]; }
      else quantities[title] = 1;
      return { ...prev, selectedItems: selected, quantities, itemColors, selectedAddOns: addOns };
    });
  };

  const toggleColor = (itemTitle: string, color: string) => {
    setFormData((prev) => {
      const current = prev.itemColors[itemTitle] ?? [];
      const next = current.includes(color)
        ? current.filter((c) => c !== color)
        : [...current, color];
      return { ...prev, itemColors: { ...prev.itemColors, [itemTitle]: next } };
    });
  };

  const setQuantity = (title: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      quantities: { ...prev.quantities, [title]: Math.max(1, value) },
    }));
  };

  const toggleAddOn = (key: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedAddOns: prev.selectedAddOns.includes(key)
        ? prev.selectedAddOns.filter((a) => a !== key)
        : [...prev.selectedAddOns, key],
    }));
  };

  const handleNext = () => {
    const stepErrors = validateStep("rental", step, formData as unknown as Record<string, unknown>);
    if (Object.keys(stepErrors).length > 0) { setErrors(stepErrors); return; }
    setErrors({});
    setStep(step + 1);
    scrollToTop();
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    const stepErrors = validateStep("rental", step, formData as unknown as Record<string, unknown>);
    if (Object.keys(stepErrors).length > 0) { setErrors(stepErrors); return; }
    if (!turnstileToken) { setSubmitError("Please complete the verification challenge."); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/rentals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, turnstileToken }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const result = await res.json();
        setSubmitError(result.message || "Something went wrong.");
      }
    } catch {
      setSubmitError("Something went wrong. Please try again or email us at Info@picnicpotential.com");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-12 text-center shadow-sm">
        <svg className="mx-auto h-16 w-16 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-6 font-serif text-2xl text-charcoal">Inquiry Received!</h3>
        <p className="mt-4 text-warm-gray">
          Thank you for reaching out! We&apos;ll review your rental request and follow up within
          1–2 business days to confirm availability and next steps.
        </p>
      </div>
    );
  }

  const currentStep = STEPS[step];

  return (
    <div ref={formRef}>
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-warm-gray mb-2">
          <span className="text-gold font-semibold">
            Step {step + 1} of {STEPS.length}: {currentStep.label}
          </span>
          <span className="hidden sm:inline">
            {STEPS.map((s, i) => (
              <span key={s.key} className={i === step ? "text-gold font-semibold" : i < step ? "text-sage-dark" : "text-warm-gray/60"}>
                {i > 0 && " · "}{s.label}
              </span>
            ))}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-sage-light overflow-hidden">
          <div className="h-full rounded-full bg-gold transition-all duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-[300px] lg:flex-shrink-0">
          <div className="lg:sticky lg:top-8">
            <div className="rounded-2xl bg-sage-light/50 p-8">
              <div className="text-4xl mb-4">{currentStep.icon}</div>
              <h2 className="font-serif text-2xl text-charcoal leading-snug">{currentStep.heading}</h2>
              <p className="mt-3 text-warm-gray leading-relaxed">{currentStep.body}</p>
            </div>
            <div className="mt-6 hidden lg:block space-y-1">
              {STEPS.map((s, i) => (
                <div key={s.key} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${i === step ? "bg-gold/10 text-charcoal font-medium" : i < step ? "text-sage-dark" : "text-warm-gray/60"}`}>
                  <div className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold ${i === step ? "bg-gold text-white" : i < step ? "bg-sage-dark text-white" : "bg-gray-200 text-gray-400"}`}>
                    {i < step ? (
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : i + 1}
                  </div>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 min-w-0">
          <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm">

            {/* ── Step 1: Contact ── */}
            {step === 0 && (
              <div className="space-y-5">
                <h3 className="font-serif text-2xl text-charcoal">Contact Information</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="ri-firstName" className="block text-sm font-medium text-charcoal mb-1">First Name *</label>
                    <input id="ri-firstName" type="text" required aria-required="true" aria-describedby={errors.firstName ? "ri-firstName-error" : undefined} value={formData.firstName} onChange={(e) => updateField("firstName", e.target.value)} className={getInputClass("firstName", errors)} />
                    <FieldError id="ri-firstName-error" message={errors.firstName} />
                  </div>
                  <div>
                    <label htmlFor="ri-lastName" className="block text-sm font-medium text-charcoal mb-1">Last Name *</label>
                    <input id="ri-lastName" type="text" required aria-required="true" aria-describedby={errors.lastName ? "ri-lastName-error" : undefined} value={formData.lastName} onChange={(e) => updateField("lastName", e.target.value)} className={getInputClass("lastName", errors)} />
                    <FieldError id="ri-lastName-error" message={errors.lastName} />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="ri-phone" className="block text-sm font-medium text-charcoal mb-1">Phone *</label>
                    <input id="ri-phone" type="tel" required aria-required="true" aria-describedby={errors.phone ? "ri-phone-error" : undefined} value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} className={getInputClass("phone", errors)} />
                    <FieldError id="ri-phone-error" message={errors.phone} />
                  </div>
                  <div>
                    <label htmlFor="ri-email" className="block text-sm font-medium text-charcoal mb-1">Email *</label>
                    <input id="ri-email" type="email" required aria-required="true" aria-describedby={errors.email ? "ri-email-error" : undefined} value={formData.email} onChange={(e) => updateField("email", e.target.value)} className={getInputClass("email", errors)} />
                    <FieldError id="ri-email-error" message={errors.email} />
                  </div>
                </div>
                {/* Honeypot */}
                <input type="text" name="website" className="hidden" tabIndex={-1} aria-hidden="true" />
              </div>
            )}

            {/* ── Step 2: Rentals ── */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="font-serif text-2xl text-charcoal">Event &amp; Items</h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label id="ri-eventDate-label" className="block text-sm font-medium text-charcoal mb-1">Event Date *</label>
                    <DatePicker
                      id="ri-eventDate"
                      aria-labelledby="ri-eventDate-label"
                      aria-required={true}
                      value={formData.eventDate}
                      onChange={(v) => updateField("eventDate", v)}
                      hasError={!!errors.eventDate}
                      formType="proposal"
                      placeholder="Select your event date"
                    />
                    <FieldError id="ri-eventDate-error" message={errors.eventDate} />
                  </div>
                  <div>
                    <label htmlFor="ri-location" className="block text-sm font-medium text-charcoal mb-1">Location</label>
                    <input id="ri-location" type="text" value={formData.location} onChange={(e) => updateField("location", e.target.value)} className={inputClass} placeholder="City or venue name" />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-charcoal mb-1">Items You&apos;re Interested In</p>
                  <p className="text-xs text-warm-gray mb-3">Select everything you might want — we&apos;ll go over details when we connect.</p>
                  <div className="space-y-3">
                    {RENTAL_ITEMS.map((item) => {
                      const isSelected = formData.selectedItems.includes(item.title);
                      return (
                        <div key={item.id} className={`rounded-xl border transition-colors ${isSelected ? "border-gold bg-gold/5" : "border-sage bg-white"}`}>
                          <label className="flex cursor-pointer items-start gap-3 p-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleItem(item.title)}
                              className="mt-0.5 h-4 w-4 flex-shrink-0 accent-gold"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-medium text-charcoal">{item.title}</span>
                              <span className="ml-2 text-xs text-warm-gray">
                                from ${item.pricing[0].price}
                              </span>
                            </div>
                            {isSelected && (
                              <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.preventDefault()}>
                                <label htmlFor={`qty-${item.id}`} className="text-xs text-warm-gray whitespace-nowrap">Qty</label>
                                <input
                                  id={`qty-${item.id}`}
                                  type="number"
                                  min={1}
                                  value={formData.quantities[item.title] ?? 1}
                                  onChange={(e) => setQuantity(item.title, parseInt(e.target.value) || 1)}
                                  className="w-14 rounded-lg border border-sage px-2 py-1 text-sm text-center focus:border-gold focus:outline-none"
                                />
                              </div>
                            )}
                          </label>

                          {/* Colors (when item is selected and has color options) */}
                          {isSelected && item.colors && item.colors.length > 0 && (
                            <div className="border-t border-gold/20 px-4 pb-4 pt-3">
                              <p className="text-xs font-medium text-charcoal/60 uppercase tracking-wide mb-2">Color Preference</p>
                              <div className="flex flex-wrap gap-2">
                                {item.colors.map((color) => {
                                  const isChecked = (formData.itemColors[item.title] ?? []).includes(color);
                                  return (
                                    <label key={color} className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors ${isChecked ? "border-gold bg-gold/10 text-charcoal font-medium" : "border-sage text-warm-gray hover:border-gold/50"}`}>
                                      <input type="checkbox" checked={isChecked} onChange={() => toggleColor(item.title, color)} className="sr-only" />
                                      {color}
                                    </label>
                                  );
                                })}
                              </div>
                              <p className="mt-2 text-xs text-warm-gray/70">Select all that apply — we'll confirm what's available</p>
                            </div>
                          )}

                          {/* Add-ons (only when item is selected and has add-ons) */}
                          {isSelected && item.addOns && item.addOns.length > 0 && (
                            <div className="border-t border-gold/20 px-4 pb-4 pt-3">
                              <p className="text-xs font-medium text-charcoal/60 uppercase tracking-wide mb-2">Add-ons</p>
                              <div className="space-y-2">
                                {item.addOns.map((addon) => {
                                  const key = `${item.title}: ${addon.label}`;
                                  return (
                                    <label key={addon.label} className="flex cursor-pointer items-center gap-2.5">
                                      <input
                                        type="checkbox"
                                        checked={formData.selectedAddOns.includes(key)}
                                        onChange={() => toggleAddOn(key)}
                                        className="h-4 w-4 flex-shrink-0 accent-gold"
                                      />
                                      <span className="text-sm text-warm-gray">
                                        {addon.label} <span className="text-charcoal">+${addon.price}</span>
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Neon signs: prompt to specify in notes */}
                          {isSelected && item.id === "neon-signs" && (
                            <div className="border-t border-gold/20 px-4 pb-4 pt-3">
                              <p className="text-xs text-warm-gray">
                                We carry: Happy Birthday ($40), Sweet 16 ($25), I Love You More ($40), You&apos;re Like Really Pretty ($25), Let&apos;s Party ($50), Neon Hearts ($20). Please mention which ones you want in the Notes field below.
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 3: Final ── */}
            {step === 2 && (
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
                  <label htmlFor="ri-notes" className="block text-sm font-medium text-charcoal mb-1">Notes</label>
                  <p className="text-xs text-warm-gray mb-2">
                    Anything else we should know — specific neon signs, number of marquee letters, colour preferences, etc.
                  </p>
                  <textarea
                    id="ri-notes"
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    className={`${inputClass} resize-none`}
                    placeholder="Any additional details..."
                  />
                </div>

                <div className="mt-4">
                  <Turnstile
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                    onSuccess={(token) => setTurnstileToken(token)}
                    onError={() => setTurnstileToken(null)}
                    onExpire={() => setTurnstileToken(null)}
                  />
                </div>
              </div>
            )}

            {/* Submit error */}
            {submitError && (
              <div role="alert" aria-live="assertive" className="mt-6 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {submitError}
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex justify-between">
              {step > 0 ? (
                <button onClick={() => { setStep(step - 1); scrollToTop(); }} className="rounded-full border-2 border-sage px-6 py-2.5 text-sm font-medium text-charcoal transition-colors hover:border-gold">
                  Previous
                </button>
              ) : <div />}
              {step < STEPS.length - 1 ? (
                <button onClick={handleNext} className="rounded-full bg-charcoal px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gold">
                  Next
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={submitting} className="rounded-full bg-gold px-8 py-2.5 text-sm font-medium text-charcoal transition-colors hover:bg-gold-light disabled:opacity-50">
                  {submitting ? "Submitting..." : "Submit Inquiry"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
