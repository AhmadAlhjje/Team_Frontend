import { type NextRequest, NextResponse } from 'next/server';

import { resolveLocaleRoute } from '@/lib/i18n/routing';

/**
 * Locale routing: the default locale (Arabic) is served without a prefix
 * (`/projects` → internally `/ar/projects`), other enabled locales use one
 * (`/en/projects`). `/ar/...` redirects to the canonical unprefixed URL.
 */
export function proxy(request: NextRequest) {
  const decision = resolveLocaleRoute(request.nextUrl.pathname);
  if (decision.action === 'next') return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = decision.pathname;
  return decision.action === 'redirect' ? NextResponse.redirect(url, 308) : NextResponse.rewrite(url);
}

export const config = {
  // Skip API routes, Next internals, metadata routes and files with an extension.
  matcher: ['/((?!api|_next|sitemap.xml|robots.txt|manifest.webmanifest|icon|apple-icon|favicon.ico|.*\\..*).*)'],
};
