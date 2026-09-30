import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';

import { JsonLd } from '@/components/shared/json-ld';
import { getSiteSettings } from '@/lib/api/content';
import { allowIndexing, siteUrl } from '@/lib/constants/env';
import { fontVariables } from '@/lib/fonts';
import { enabledLocales, isEnabledLocale, localeDefinitions } from '@/lib/i18n/config';
import { jsonLdGraph, organizationSchema, websiteSchema } from '@/lib/seo/json-ld';

import '@/styles/globals.css';

export function generateStaticParams() {
  return enabledLocales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#070b14',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getSiteSettings();
  const description = settings.description ?? settings.tagline ?? undefined;

  return {
    metadataBase: new URL(siteUrl),
    title: { default: settings.siteName, template: `%s | ${settings.siteName}` },
    description,
    applicationName: settings.siteName,
    openGraph: {
      siteName: settings.siteName,
      locale: isEnabledLocale(locale) ? localeDefinitions[locale].openGraph : undefined,
      type: 'website',
    },
    // Indexing is the default; only emit robots rules to block it (staging).
    robots: allowIndexing ? undefined : { index: false, follow: false },
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isEnabledLocale(locale)) notFound();

  const settings = await getSiteSettings();

  return (
    <html lang={locale} dir={localeDefinitions[locale].dir} className={fontVariables}>
      <body>
        {children}
        <JsonLd data={jsonLdGraph(organizationSchema(settings, locale), websiteSchema(settings, locale))} />
      </body>
    </html>
  );
}
