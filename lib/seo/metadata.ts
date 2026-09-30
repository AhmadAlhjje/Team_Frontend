import type { Metadata } from 'next';

import { allowIndexing } from '@/lib/constants/env';
import { enabledLocales, localeDefinitions, type Locale } from '@/lib/i18n/config';
import { localizePath } from '@/lib/i18n/routing';
import type { SiteSettings } from '@/types/api';

interface PageMetadataInput {
  locale: Locale;
  settings: Pick<SiteSettings, 'siteName' | 'defaultOgImageUrl'>;
  /** Path without locale prefix, e.g. "/projects/wafeer". */
  path: string;
  title: string;
  description: string;
  /** Uses the site default Open Graph image when omitted. */
  image?: string | null;
  type?: 'website' | 'article';
  /** Title is used as-is, without the "| Site name" template. */
  absoluteTitle?: boolean;
  noIndex?: boolean;
}

/**
 * Builds complete metadata for a page: canonical URL, hreflang alternates,
 * Open Graph and Twitter cards. Relative URLs resolve against `metadataBase`
 * (NEXT_PUBLIC_SITE_URL) set in the root layout.
 */
export function buildPageMetadata(input: PageMetadataInput): Metadata {
  const url = localizePath(input.path, input.locale);
  const image = input.image || input.settings.defaultOgImageUrl || undefined;
  const fullTitle = input.absoluteTitle ? input.title : `${input.title} | ${input.settings.siteName}`;

  const languages =
    enabledLocales.length > 1
      ? Object.fromEntries(enabledLocales.map((locale) => [locale, localizePath(input.path, locale)]))
      : undefined;

  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: { canonical: url, languages },
    openGraph: {
      type: input.type ?? 'website',
      url,
      title: fullTitle,
      description: input.description,
      siteName: input.settings.siteName,
      locale: localeDefinitions[input.locale].openGraph,
      images: image ? [{ url: image, alt: input.title }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: fullTitle,
      description: input.description,
      images: image ? [image] : undefined,
    },
    robots: input.noIndex || !allowIndexing ? { index: false, follow: !input.noIndex } : undefined,
  };
}
