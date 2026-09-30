/**
 * Caching strategy for API content:
 *
 * 1. Every GET is cached by Next.js with a tag (e.g. `projects`).
 * 2. When content changes in Admin, the backend calls POST /api/revalidate with
 *    the affected tags → pages are regenerated on the next request.
 * 3. A time-based revalidation (CONTENT_REVALIDATE_SECONDS) is a safety net in
 *    case a webhook is missed.
 *
 * Result: visitors get static pages, MySQL is hit only when content changes.
 */

export const CACHE_TAGS = [
  'settings',
  'stats',
  'team',
  'projects',
  'services',
  'achievements',
  'clients',
  'testimonials',
  'faqs',
] as const;

export type CacheTag = (typeof CACHE_TAGS)[number];

export function isCacheTag(value: unknown): value is CacheTag {
  return typeof value === 'string' && (CACHE_TAGS as readonly string[]).includes(value);
}

const configuredRevalidate = Number(process.env.CONTENT_REVALIDATE_SECONDS);

/** Safety-net revalidation window in seconds (default: 1 hour). */
export const contentRevalidateSeconds =
  Number.isFinite(configuredRevalidate) && configuredRevalidate > 0 ? configuredRevalidate : 3600;

/** Timeout for a single API request made while rendering. */
export const apiRequestTimeoutMs = 10_000;
