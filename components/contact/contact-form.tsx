'use client';

import { useEffect, useRef } from 'react';

import { CheckIcon } from '@/components/icons';
import { buttonClasses } from '@/components/ui/button-link';
import { useContactForm } from '@/hooks/use-contact-form';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import { cn } from '@/lib/utils/cn';
import { CONTACT_LIMITS, type ContactField } from '@/lib/validation/contact';

interface ContactFormProps {
  endpoint: string;
  labels: Dictionary['contact']['form'];
  projectTypes: string[];
}

const inputClasses =
  'block w-full rounded-xl border border-line-strong bg-canvas/70 px-4 py-3 text-base text-ink placeholder:text-muted transition-colors hover:border-primary/50 focus:border-primary-bright focus:ring-4 focus:ring-primary/20 focus:outline-none aria-invalid:border-red-400';

function Field({
  id,
  label,
  optional,
  error,
  children,
  className,
}: {
  id: ContactField;
  label: string;
  optional?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-bold text-ink">
        {label}
        {optional ? <span className="font-normal text-muted"> ({optional})</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ContactForm({ endpoint, labels, projectTypes }: ContactFormProps) {
  const { status, errors, formError, submit, reset } = useContactForm({ endpoint, messages: labels.errors });
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  if (status === 'success') {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-2xl border border-emerald-400/25 bg-emerald-400/5 p-8 text-center focus:outline-none"
      >
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/30">
          <CheckIcon className="size-7" />
        </span>
        <h2 className="text-xl font-bold">{labels.successTitle}</h2>
        <p className="mt-2 text-body">{labels.successBody}</p>
        <button type="button" onClick={reset} className={buttonClasses('secondary', 'md', 'mt-6')}>
          {labels.sendAnother}
        </button>
      </div>
    );
  }

  const invalid = (field: ContactField) =>
    errors[field] ? { 'aria-invalid': true, 'aria-describedby': `${field}-error` } : {};
  const submitting = status === 'submitting';

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void submit(event.currentTarget);
      }}
      className="space-y-5"
      aria-busy={submitting}
    >
      {formError ? (
        <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {formError}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label={labels.name} error={errors.name}>
          <input
            id="name"
            name="name"
            autoComplete="name"
            required
            maxLength={CONTACT_LIMITS.name.max}
            className={inputClasses}
            {...invalid('name')}
          />
        </Field>
        <Field id="email" label={labels.email} error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            dir="ltr"
            autoComplete="email"
            required
            maxLength={CONTACT_LIMITS.email.max}
            className={cn(inputClasses, 'text-start')}
            {...invalid('email')}
          />
        </Field>
        <Field id="phone" label={labels.phone} optional={labels.optional} error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            dir="ltr"
            autoComplete="tel"
            maxLength={CONTACT_LIMITS.phone.max}
            className={cn(inputClasses, 'text-start')}
            {...invalid('phone')}
          />
        </Field>
        <Field id="company" label={labels.company} optional={labels.optional} error={errors.company}>
          <input
            id="company"
            name="company"
            autoComplete="organization"
            maxLength={CONTACT_LIMITS.company.max}
            className={inputClasses}
            {...invalid('company')}
          />
        </Field>
        <Field id="projectType" label={labels.projectType} optional={labels.optional} error={errors.projectType}>
          <select
            id="projectType"
            name="projectType"
            defaultValue=""
            className={inputClasses}
            {...invalid('projectType')}
          >
            <option value="">{labels.projectTypePlaceholder}</option>
            {projectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
            <option value={labels.projectTypeOther}>{labels.projectTypeOther}</option>
          </select>
        </Field>
        <Field id="budget" label={labels.budget} optional={labels.optional} error={errors.budget}>
          <select id="budget" name="budget" defaultValue="" className={inputClasses} {...invalid('budget')}>
            <option value="">{labels.budgetPlaceholder}</option>
            {labels.budgets.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field id="message" label={labels.message} error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          maxLength={CONTACT_LIMITS.message.max}
          placeholder={labels.messagePlaceholder}
          className={cn(inputClasses, 'resize-y')}
          {...invalid('message')}
        />
      </Field>

      {/* Honeypot: invisible to people and assistive technology, tempting for bots. */}
      <div aria-hidden="true" className="absolute inset-s-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">{labels.privacy}</p>
        <button
          type="submit"
          disabled={submitting}
          className={buttonClasses('primary', 'lg', 'disabled:cursor-wait disabled:opacity-60')}
        >
          {submitting ? labels.submitting : labels.submit}
        </button>
      </div>
    </form>
  );
}
