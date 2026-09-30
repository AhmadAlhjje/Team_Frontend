import { defaultLocale, enabledLocales, isLocale, type Locale } from './config';

/** Builds a public URL path for a locale: `/projects` (default) or `/en/projects`. */
export function localizePath(path: string, locale: Locale): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (locale === defaultLocale) return normalized;
  return normalized === '/' ? `/${locale}` : `/${locale}${normalized}`;
}

export type LocaleRouteDecision =
  { action: 'next' } | { action: 'rewrite'; pathname: string } | { action: 'redirect'; pathname: string };

/**
 * Decides how the proxy handles an incoming pathname:
 * - `/projects`      → rewrite to `/ar/projects` (default locale, no prefix in the URL)
 * - `/ar/projects`   → redirect to `/projects` (single canonical URL)
 * - `/en/projects`   → served as-is when English is enabled
 * - anything else    → rewritten under the default locale (unknown paths 404 there)
 */
export function resolveLocaleRoute(pathname: string): LocaleRouteDecision {
  const [, firstSegment = ''] = pathname.split('/');

  if (firstSegment === defaultLocale) {
    const rest = pathname.slice(defaultLocale.length + 1);
    return { action: 'redirect', pathname: rest === '' ? '/' : rest };
  }

  if (isLocale(firstSegment) && enabledLocales.includes(firstSegment)) {
    return { action: 'next' };
  }

  return {
    action: 'rewrite',
    pathname: pathname === '/' ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`,
  };
}
