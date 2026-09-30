/**
 * Locale configuration.
 *
 * The website is built RTL/LTR-ready: every locale has its own direction and
 * every route lives under `app/[locale]`. The default locale is served without
 * a prefix (`/projects`), other locales with a prefix (`/en/projects`).
 *
 * To enable English: translate the content (see docs/i18n.md) and add 'en' to
 * `enabledLocales`. No layout or routing changes are needed.
 */

export const locales = ['ar', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ar';

/** Locales currently exposed on the website. */
export const enabledLocales: readonly Locale[] = ['ar'];

export interface LocaleDefinition {
  dir: 'rtl' | 'ltr';
  label: string;
  /** Locale passed to Intl formatters (Latin digits for Arabic). */
  intl: string;
  /** Open Graph locale. */
  openGraph: string;
}

export const localeDefinitions: Record<Locale, LocaleDefinition> = {
  ar: { dir: 'rtl', label: 'العربية', intl: 'ar-u-nu-latn', openGraph: 'ar_AR' },
  en: { dir: 'ltr', label: 'English', intl: 'en-US', openGraph: 'en_US' },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function isEnabledLocale(value: string): value is Locale {
  return (enabledLocales as readonly string[]).includes(value);
}
