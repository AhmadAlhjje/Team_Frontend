import { localeDefinitions, type Locale } from '@/lib/i18n/config';

/** Formats an ISO date as "month year" in the locale (e.g. "سبتمبر 2026"). */
export function formatMonthYear(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(localeDefinitions[locale].intl, {
    year: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(new Date(iso));
}

/** Formats an ISO date as a full date (e.g. "12 سبتمبر 2026"). */
export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(localeDefinitions[locale].intl, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso));
}

/**
 * Formats a project timeline:
 * - start & end → "يناير 2025 – مارس 2025"
 * - start only  → "يناير 2025 – الآن"
 * - end only    → "مارس 2025"
 */
export function formatDateRange(
  start: string | null,
  end: string | null,
  locale: Locale,
  presentLabel: string,
): string | null {
  if (!start && !end) return null;
  if (!start && end) return formatMonthYear(end, locale);
  const from = formatMonthYear(start as string, locale);
  const to = end ? formatMonthYear(end, locale) : presentLabel;
  return from === to ? from : `${from} – ${to}`;
}

/** Formats a number in the locale (Latin digits for Arabic). */
export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(localeDefinitions[locale].intl).format(value);
}

/** Builds a wa.me link from a phone number in any format. */
export function whatsappUrl(phone: string): string {
  return `https://wa.me/${phone.replace(/[^\d]/g, '')}`;
}

/** Returns a tel: href from a phone number in any format. */
export function telUrl(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

/** Returns up to two initials, used as an avatar/cover fallback. */
export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
}

/**
 * Avatar letters: one letter for Arabic names (two-letter initials read oddly
 * in Arabic, e.g. "سا" for "سامي الخطيب"), up to two initials otherwise.
 */
export function monogram(name: string): string {
  const trimmed = name.trim();
  return /^[؀-ۿ]/.test(trimmed) ? trimmed.charAt(0) : initials(trimmed);
}
