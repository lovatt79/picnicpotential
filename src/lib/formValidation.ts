export type ValidationErrors = Record<string, string>;

/* ── Required fields per step for each multi-step form ─────────── */

const multiStepRules: Record<number, string[]> = {
  0: ["firstName", "lastName", "phone", "email"],
  1: ["eventDate", "eventType"],
  7: ["howDidYouHear"],
};

const proposalRules: Record<number, string[]> = {
  0: ["firstName", "lastName", "phone", "email"],
  1: ["proposeeName", "proposalDate1", "location"],
  5: ["howDidYouHear"],
};

const weddingSuiteRules: Record<number, string[]> = {
  0: ["firstName", "lastName", "phone", "email"],
  1: ["coupleName1", "coupleName2"],
  2: ["venueName", "eventDate"],
  6: ["howDidYouHear"],
};

const RULES_MAP = {
  multiStep: multiStepRules,
  proposal: proposalRules,
  weddingSuite: weddingSuiteRules,
} as const;

export type FormType = keyof typeof RULES_MAP;

/* ── Human-readable labels for error messages ──────────────────── */

const FIELD_LABELS: Record<string, string> = {
  firstName: "First name",
  lastName: "Last name",
  phone: "Phone number",
  email: "Email",
  eventDate: "Event date",
  eventType: "Event type",
  howDidYouHear: "How did you hear about us",
  proposeeName: "Proposee name",
  proposalDate1: "Proposal date",
  location: "Location",
  coupleName1: "Partner 1 name",
  coupleName2: "Partner 2 name",
  venueName: "Venue name",
};

/**
 * Validates the required fields for a given form type and step.
 * Returns an object mapping field names to error messages.
 * Empty object = no errors.
 */
export function validateStep(
  formType: FormType,
  step: number,
  formData: Record<string, unknown>,
): ValidationErrors {
  const rules = RULES_MAP[formType];
  const requiredFields = rules[step];
  if (!requiredFields) return {};

  const errors: ValidationErrors = {};
  for (const field of requiredFields) {
    const value = formData[field];
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      (typeof value === "string" && value.trim() === "")
    ) {
      const label = FIELD_LABELS[field] || field;
      errors[field] = `${label} is required`;
    }
  }
  return errors;
}

/**
 * Returns the list of required field names for a given step.
 */
export function getRequiredFields(formType: FormType, step: number): string[] {
  return RULES_MAP[formType][step] || [];
}
