/**
 * Environment-derived configuration. Nothing environment-specific (URLs,
 * ports, secrets) may be hard-coded elsewhere — read it from here.
 *
 * NEXT_PUBLIC_* values are inlined at build time: changing them requires a rebuild.
 */

const isProduction = process.env.NODE_ENV === 'production';

function readUrl(name: string, value: string | undefined, developmentFallback: string): string {
  const raw = value?.trim();
  if (!raw) {
    if (isProduction) {
      throw new Error(`Missing required environment variable ${name}. See .env.example.`);
    }
    return developmentFallback;
  }
  return raw.replace(/\/+$/, '');
}

/** Public URL of this website, used for canonical URLs, sitemap and Open Graph. */
export const siteUrl = readUrl('NEXT_PUBLIC_SITE_URL', process.env.NEXT_PUBLIC_SITE_URL, 'http://localhost:3000');

/** Public URL of the backend (reachable from browsers, e.g. for the contact form). */
export const publicApiUrl = readUrl('NEXT_PUBLIC_API_URL', process.env.NEXT_PUBLIC_API_URL, 'http://localhost:4000');

/**
 * URL used for server-to-server requests. Set API_INTERNAL_URL when the
 * frontend and backend share a private network (e.g. http://127.0.0.1:4000).
 */
export const serverApiUrl = process.env.API_INTERNAL_URL?.trim().replace(/\/+$/, '') || publicApiUrl;

/** Site name used only when the API is unreachable at build time. */
export const fallbackSiteName = process.env.NEXT_PUBLIC_SITE_NAME?.trim() || 'Team';

/** Set NEXT_PUBLIC_ALLOW_INDEXING=false on staging to block search engines. */
export const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING !== 'false';
