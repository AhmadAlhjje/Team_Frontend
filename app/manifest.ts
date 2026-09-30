import type { MetadataRoute } from 'next';

import { getSiteSettings } from '@/lib/api/content';
import { defaultLocale, localeDefinitions } from '@/lib/i18n/config';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSiteSettings();
  return {
    name: settings.siteName,
    short_name: settings.siteName,
    description: settings.description ?? settings.tagline ?? undefined,
    start_url: '/',
    display: 'browser',
    background_color: '#070b14',
    theme_color: '#070b14',
    lang: defaultLocale,
    dir: localeDefinitions[defaultLocale].dir,
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
