"use client";

import { useState, useRef } from "react";

const STEPS = [
  "Contact Info",
  "Event Details",
  "Setup & Color",
  "Food & Desserts",
  "Add-Ons & Notes",
];

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
  city: string;
  exactLocation: string;
  colorChoice1: string;
  colorChoice1Other: string;
  colorChoice2: string;
  colorChoice2Other: string;
  groupSize: string;
  guestNames: string;
  foodOptions: string[];
  dessertOptions: string[];
  dessertOther: string;
  howDidYouHear: string;
  howDidYouHearOther: string;
  referredBy: string;
  addOns: string[];
  occasion: string;
  notes: string;
}

const EVENT_TYPES = [
  "Picnic",
  "Tablescapes",
  "Event Decor",
  "Rentals",
];

const ADDITIONAL_TIME = [
  "1 Hour / $50",
  "2 Hours / $100",
  "3 Hours / $150",
  "4+ Hours (we will contact you to discuss pricing)",
];

const COLOR_OPTIONS = [
  "Pretty in Pink",
  "Citrus Party (Orange, White, Yellow and Green)",
  "Coral and Sage",
  "Pink Lemonade (Pink and Yellow)",
  "Boho (Neutrals)",
  "Boho Dusty Blue",
  "Baby Blue",
  "Sapphire Blue",
  "Pastel Rainbow",
  "Black and Hot Pink",
  "Black and White Farmhouse",
  "Red White and Blue",
  "Purple and Gray",
  "Bright Color Pop (Hot Pink, Yellow, Green, Orange and Turquoise)",
  "Sage, White and Gold",
  "Fall Set Up (Aug 15-Dec 1)",
  "Surprise Me!",
];

const FOOD_OPTIONS = [
  "Charcuterie $25/person (Min order of 2)",
  "Brunch Board/Box $25",
  "Individual Sandwich Box $20",
  "Individual Sandwich Wrap $20 (Turkey Bacon Ranch, Southwest Chicken or Chicken Caesar)",
  "Individual Salad $18 (10+ Varieties)",
  "Fruit Platter (Serves 4-6) $75",
  "Crudités Platter (Serves 4-6) $75",
  "Hummus Platter (Serves 4-6) $75",
  "Skewer Platter (Serves 6-8) $85",
];

const DESSERT_OPTIONS = [
  "Assorted Dessert Box $30",
  "Dozen Themed Cookies $50/dozen",
  "Personalized Place Card Cookies $6/each",
  "Mini Bundt Cakes - 6 Pack $20",
  "Mini Pies $3.50/each, min order of 6 (blueberry, apple, cherry)",
  "Cake Jars $3.50/each, min order of 6",
  "Cake Pops $3.50/each, min order of 6",
  "Cake Popsicles $3.50/each, min order of 6",
  "Cake (4\"=$38, 6\"=$60, 8\"=$80, 10\"=$100)",
  "Macaron Cookies - 1 Dozen $36",
  "Lg Homemade Cookies - 1 Dozen $33",
  "Brownie Bites - 1 Dozen $25",
  "Chocolate Dipped Dessert Box $25",
  "Cupcakes $3.50/each, min order of 6",
  "VEGAN: Sugar Cookie Bars - 1 Dozen $24",
  "VEGAN: Macaron Cookies - 1 Dozen $33",
  "VEGAN: Oreo Mousse Cup $3.50/each, min order of 6",
  "VEGAN: Fruit Tart - 1 Dozen $36",
  "VEGAN: Mini Cheesecake Cups $3.50/each, min order of 6",
  "VEGAN: Truffles - 1 Dozen $30",
  "VEGAN: Lemon Bar - 1 Dozen $24",
  "VEGAN: Biscoff Brownie - 1 Dozen $30",
];

const ADDON_OPTIONS = [
  "Adirondack Chair $40",
  "Juice Carafe $20/each",
  "Large Juice Dispenser $50",
  "Lawn Game: Connect Four $20",
  "Lawn Game: Large Connect Four $40",
  "Lawn Game: Jenga $15",
  "Corn Hole $50",
  "Igloo Bubble Tent $150 (Max Group Size: 6)",
  "Lace Tent $35",
  "Umbrella $50",
  "Cabana $150",
  "Small Flowers $55",
  "Medium Flowers $80",
  "Large Flowers $120",
  "Professional Photographer - Starting at $300 (1 hour, 30 edited photos)",
];

const OCCASION_OPTIONS = [
  "Friends Get Together",
  "Bachelor/Bachelorette",
  "Bridal Shower",
  "Baby Shower / Sip & See",
  "Birthday",
  "Birthday - Surprise Party",
  "Corporate Gathering",
  "Proposal with Picnic",
  "Proposal (Non Picnic)",
  "Community Event",
  "Private Event",
  "Kids Birthday",
  "Anniversary",
  "Graduation Party",
  "Date Night",
];

const HEAR_ABOUT_OPTIONS = [
  "I am a past client",
  "Facebook",
  "Instagram (@Picnic.Potential)",
  "TikTok",
  "Referral",
  "Kendall Jackson Website",
  "Matanzas Creek Website",
  "Rodney Strong Website",
  "Paradise Ridge Winery Website",
  "Kohmsa Luxury Vacation Rentals Website/Email",
  "Mascarin Winery Website",
];

// Reusable checkbox component
function CheckboxOption({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
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

// Reusable radio component
function RadioOption({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
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

export default function MultiStepForm() {
  const formRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
    city: "",
    exactLocation: "",
    colorChoice1: "",
    colorChoice1Other: "",
    colorChoice2: "",
    colorChoice2Other: "",
    groupSize: "",
    guestNames: "",
    foodOptions: [],
    dessertOptions: [],
    dessertOther: "",
    howDidYouHear: "",
    howDidYouHearOther: "",
    referredBy: "",
    addOns: [],
    occasion: "",
    notes: "",
  });

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArray = (field: "foodOptions" | "dessertOptions" | "addOns", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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

  return (
    <div ref={formRef} className="mx-auto max-w-2xl">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-warm-gray mb-2">
          {STEPS.map((s, i) => (
            <span key={i} className={`${i === step ? "text-gold font-semibold" : ""} ${i < step ? "text-sage-dark" : ""} hidden sm:inline`}>
              {s}
            </span>
          ))}
          <span className="sm:hidden text-gold font-semibold">Step {step + 1} of {STEPS.length}: {STEPS[step]}</span>
        </div>
        <div className="h-1.5 rounded-full bg-sage-light overflow-hidden">
          <div
            className="h-full rounded-full bg-gold transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm">
        {/* Step 1: Contact Info */}
        {step === 0 && (
          <div className="space-y-5">
            <h3 className="font-serif text-2xl text-charcoal">Contact Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  className="w-full rounded-lg border border-sage px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  className="w-full rounded-lg border border-sage px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="w-full rounded-lg border border-sage px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="w-full rounded-lg border border-sage px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Step 2: Event Details */}
        {step === 1 && (
          <div className="space-y-5">
            <h3 className="font-serif text-2xl text-charcoal">Event Details</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Date of Your Picnic *</label>
                <input
                  type="date"
                  required
                  value={formData.eventDate}
                  onChange={(e) => updateField("eventDate", e.target.value)}
                  className="w-full rounded-lg border border-sage px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Backup Date</label>
                <input
                  type="date"
                  value={formData.backupDate}
                  onChange={(e) => updateField("backupDate", e.target.value)}
                  className="w-full rounded-lg border border-sage px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">What type of event are you interested in? *</label>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {EVENT_TYPES.map((type) => (
                  <RadioOption
                    key={type}
                    label={type}
                    checked={formData.eventType === type}
                    onChange={() => updateField("eventType", type)}
                  />
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Time of Your Picnic/Event</label>
                <input
                  type="time"
                  value={formData.eventTime}
                  onChange={(e) => updateField("eventTime", e.target.value)}
                  className="w-full rounded-lg border border-sage px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Occasion</label>
                <select
                  value={formData.occasion}
                  onChange={(e) => updateField("occasion", e.target.value)}
                  className="w-full rounded-lg border border-sage px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
                >
                  <option value="">Select an occasion</option>
                  {OCCASION_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Additional time needed?</label>
              <p className="text-xs text-warm-gray mb-2">Standard picnic includes 2 hours</p>
              <div className="grid gap-2">
                {ADDITIONAL_TIME.map((time) => (
                  <RadioOption
                    key={time}
                    label={time}
                    checked={formData.additionalTime === time}
                    onChange={() => updateField("additionalTime", time)}
                  />
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className="w-full rounded-lg border border-sage px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">How many guests?</label>
                <input
                  type="text"
                  value={formData.groupSize}
                  onChange={(e) => updateField("groupSize", e.target.value)}
                  className="w-full rounded-lg border border-sage px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Exact Location</label>
              <p className="text-xs text-warm-gray mb-2">
                Either &quot;Home&quot; or name of park/place. Winery partners: Kendall Jackson (Santa Rosa),
                Mascarin Family Winery (Healdsburg), Rodney Strong (Healdsburg), Paradise Ridge Winery (Santa Rosa),
                Kohmsa Luxury Vacation Rentals, Matanzas Creek Winery (Bennett Valley).
                If your preferred winery is not listed we can still set up there if you secure permission.
              </p>
              <input
                type="text"
                value={formData.exactLocation}
                onChange={(e) => updateField("exactLocation", e.target.value)}
                className="w-full rounded-lg border border-sage px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
                placeholder="Home, park name, or winery"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Guest Names</label>
              <textarea
                rows={3}
                value={formData.guestNames}
                onChange={(e) => updateField("guestNames", e.target.value)}
                className="w-full rounded-lg border border-sage px-4 py-2.5 text-sm focus:border-gold focus:outline-none resize-none"
                placeholder="Please provide the names of each guest (for personalized place cards)"
              />
            </div>
          </div>
        )}

        {/* Step 3: Setup & Color */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-2xl text-charcoal">Preferred Picnic Set Up</h3>
              <p className="text-sm text-warm-gray mt-1">1st Choice</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {COLOR_OPTIONS.map((color) => (
                  <RadioOption
                    key={color}
                    label={color}
                    checked={formData.colorChoice1 === color}
                    onChange={() => updateField("colorChoice1", color)}
                  />
                ))}
                <RadioOption
                  label="Other"
                  checked={formData.colorChoice1 === "Other"}
                  onChange={() => updateField("colorChoice1", "Other")}
                />
              </div>
              {formData.colorChoice1 === "Other" && (
                <input
                  type="text"
                  placeholder="Describe your preferred setup"
                  value={formData.colorChoice1Other}
                  onChange={(e) => updateField("colorChoice1Other", e.target.value)}
                  className="mt-2 w-full rounded-lg border border-sage px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
                />
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-charcoal">2nd Choice</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {COLOR_OPTIONS.map((color) => (
                  <RadioOption
                    key={`2-${color}`}
                    label={color}
                    checked={formData.colorChoice2 === color}
                    onChange={() => updateField("colorChoice2", color)}
                  />
                ))}
                <RadioOption
                  label="Other"
                  checked={formData.colorChoice2 === "Other"}
                  onChange={() => updateField("colorChoice2", "Other")}
                />
              </div>
              {formData.colorChoice2 === "Other" && (
                <input
                  type="text"
                  placeholder="Describe your preferred setup"
                  value={formData.colorChoice2Other}
                  onChange={(e) => updateField("colorChoice2Other", e.target.value)}
                  className="mt-2 w-full rounded-lg border border-sage px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
                />
              )}
            </div>
          </div>
        )}

        {/* Step 4: Food & Desserts */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-2xl text-charcoal">Food Options</h3>
              <p className="text-sm text-warm-gray mt-1">Select all that apply</p>
              <div className="mt-3 grid gap-2">
                {FOOD_OPTIONS.map((food) => (
                  <CheckboxOption
                    key={food}
                    label={food}
                    checked={formData.foodOptions.includes(food)}
                    onChange={() => toggleArray("foodOptions", food)}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-serif text-2xl text-charcoal">Dessert Options</h3>
              <p className="text-sm text-warm-gray mt-1">Select all that apply</p>
              <div className="mt-3 grid gap-2">
                {DESSERT_OPTIONS.map((dessert) => (
                  <CheckboxOption
                    key={dessert}
                    label={dessert}
                    checked={formData.dessertOptions.includes(dessert)}
                    onChange={() => toggleArray("dessertOptions", dessert)}
                  />
                ))}
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium text-charcoal mb-1">Other dessert request</label>
                <input
                  type="text"
                  value={formData.dessertOther}
                  onChange={(e) => updateField("dessertOther", e.target.value)}
                  className="w-full rounded-lg border border-sage px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
                  placeholder="Any other dessert you'd like?"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Add-Ons & Notes */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-2xl text-charcoal">Add-Ons</h3>
              <p className="text-sm text-warm-gray mt-1">Select all that apply</p>
              <div className="mt-3 grid gap-2">
                {ADDON_OPTIONS.map((addon) => (
                  <CheckboxOption
                    key={addon}
                    label={addon}
                    checked={formData.addOns.includes(addon)}
                    onChange={() => toggleArray("addOns", addon)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">How did you hear about us? *</label>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {HEAR_ABOUT_OPTIONS.map((option) => (
                  <RadioOption
                    key={option}
                    label={option}
                    checked={formData.howDidYouHear === option}
                    onChange={() => updateField("howDidYouHear", option)}
                  />
                ))}
                <RadioOption
                  label="Other"
                  checked={formData.howDidYouHear === "Other"}
                  onChange={() => updateField("howDidYouHear", "Other")}
                />
              </div>
              {formData.howDidYouHear === "Other" && (
                <input
                  type="text"
                  placeholder="Please specify"
                  value={formData.howDidYouHearOther}
                  onChange={(e) => updateField("howDidYouHearOther", e.target.value)}
                  className="mt-2 w-full rounded-lg border border-sage px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
                />
              )}
            </div>

            {formData.howDidYouHear === "Referral" && (
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Who referred you? (so we can thank them!)
                </label>
                <input
                  type="text"
                  value={formData.referredBy}
                  onChange={(e) => updateField("referredBy", e.target.value)}
                  className="w-full rounded-lg border border-sage px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Notes</label>
              <p className="text-xs text-warm-gray mb-2">
                Tell us anything we should know about you or your guests, what you&apos;re
                celebrating, any items or themes not listed above, etc.
              </p>
              <textarea
                rows={5}
                value={formData.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                className="w-full rounded-lg border border-sage px-4 py-2.5 text-sm focus:border-gold focus:outline-none resize-none"
                placeholder="Tell us more about your vision..."
              />
            </div>
          </div>
        )}

        {/* Navigation buttons */}
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
  );
}
