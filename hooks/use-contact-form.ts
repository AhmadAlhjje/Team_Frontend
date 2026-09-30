'use client';

import { useEffect, useRef, useState } from 'react';

import {
  type ContactErrorMessages,
  type ContactField,
  type ContactValues,
  toContactPayload,
  validateContact,
} from '@/lib/validation/contact';

export type ContactStatus = 'idle' | 'submitting' | 'success';

export interface ContactFormMessages extends ContactErrorMessages {
  generic: string;
  rateLimited: string;
  network: string;
  summary: string;
}

const FIELDS: ContactField[] = ['name', 'email', 'phone', 'company', 'projectType', 'budget', 'message'];

function readValues(form: HTMLFormElement): { values: ContactValues; honeypot: string } {
  const data = new FormData(form);
  const read = (name: string) => String(data.get(name) ?? '');
  return {
    values: Object.fromEntries(FIELDS.map((field) => [field, read(field)])) as ContactValues,
    honeypot: read('website'),
  };
}

/** Contact form state machine: validation, submission and error mapping. */
export function useContactForm({ endpoint, messages }: { endpoint: string; messages: ContactFormMessages }) {
  const startedAt = useRef(0);
  const [status, setStatus] = useState<ContactStatus>('idle');
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  function focusField(form: HTMLFormElement, field: ContactField) {
    form.querySelector<HTMLElement>(`[name="${field}"]`)?.focus();
  }

  async function submit(form: HTMLFormElement) {
    const { values, honeypot } = readValues(form);
    const fieldErrors = validateContact(values, messages);
    setErrors(fieldErrors);

    const firstInvalid = FIELDS.find((field) => fieldErrors[field]);
    if (firstInvalid) {
      setFormError(messages.summary);
      focusField(form, firstInvalid);
      return;
    }

    setFormError(null);
    setStatus('submitting');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(toContactPayload(values, honeypot, Date.now() - startedAt.current)),
      });

      if (response.ok) {
        form.reset();
        setStatus('success');
        return;
      }

      if (response.status === 429) {
        setFormError(messages.rateLimited);
      } else if (response.status === 400) {
        const body = (await response.json().catch(() => null)) as {
          details?: Array<{ field: string }>;
        } | null;
        const serverErrors: Partial<Record<ContactField, string>> = {};
        for (const detail of body?.details ?? []) {
          if (FIELDS.includes(detail.field as ContactField)) {
            serverErrors[detail.field as ContactField] = messages.generic;
          }
        }
        setErrors(serverErrors);
        setFormError(Object.keys(serverErrors).length ? messages.summary : messages.generic);
      } else {
        setFormError(messages.generic);
      }
    } catch {
      setFormError(messages.network);
    }
    setStatus('idle');
  }

  function reset() {
    startedAt.current = Date.now();
    setErrors({});
    setFormError(null);
    setStatus('idle');
  }

  return { status, errors, formError, submit, reset };
}
