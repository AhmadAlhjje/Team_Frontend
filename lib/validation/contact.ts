/**
 * Contact form validation. Mirrors backend CreateContactMessageDto so visitors
 * get instant feedback; the backend validates again.
 */

export const CONTACT_LIMITS = {
  name: { min: 2, max: 120 },
  email: { max: 191 },
  phone: { max: 40 },
  company: { max: 150 },
  projectType: { max: 120 },
  budget: { max: 80 },
  message: { min: 20, max: 5000 },
} as const;

export type ContactField = 'name' | 'email' | 'phone' | 'company' | 'projectType' | 'budget' | 'message';

export type ContactValues = Record<ContactField, string>;

export interface ContactErrorMessages {
  required: string;
  email: string;
  phone: string;
  messageTooShort: string;
  tooLong: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[\d\s()-]{6,40}$/;

export function validateContact(
  values: ContactValues,
  messages: ContactErrorMessages,
): Partial<Record<ContactField, string>> {
  const errors: Partial<Record<ContactField, string>> = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();
  const message = values.message.trim();

  if (!name) errors.name = messages.required;
  else if (name.length < CONTACT_LIMITS.name.min) errors.name = messages.required;
  else if (name.length > CONTACT_LIMITS.name.max) errors.name = messages.tooLong;

  if (!email) errors.email = messages.required;
  else if (!EMAIL_PATTERN.test(email) || email.length > CONTACT_LIMITS.email.max) errors.email = messages.email;

  if (phone && !PHONE_PATTERN.test(phone)) errors.phone = messages.phone;

  for (const field of ['company', 'projectType', 'budget'] as const) {
    if (values[field].trim().length > CONTACT_LIMITS[field].max) errors[field] = messages.tooLong;
  }

  if (!message) errors.message = messages.required;
  else if (message.length < CONTACT_LIMITS.message.min) errors.message = messages.messageTooShort;
  else if (message.length > CONTACT_LIMITS.message.max) errors.message = messages.tooLong;

  return errors;
}

/** Builds the API payload: trimmed values, empty optional fields omitted. */
export function toContactPayload(values: ContactValues, honeypot: string, elapsedMs: number) {
  const optional = (value: string) => (value.trim() ? value.trim() : undefined);
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    phone: optional(values.phone),
    company: optional(values.company),
    projectType: optional(values.projectType),
    budget: optional(values.budget),
    message: values.message.trim(),
    website: honeypot,
    elapsedMs: Math.max(0, Math.round(elapsedMs)),
  };
}
