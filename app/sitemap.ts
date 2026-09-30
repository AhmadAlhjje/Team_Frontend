import type { MetadataRoute } from 'next';

import { getProjects } from '@/lib/api/content';
import { siteUrl } from '@/lib/constants/env';
import { enabledLocales, type Locale } from '@/lib/i18n/config';
import { localizePath } from '@/lib/i18n/routing';

const STATIC_PAGES: Array<{ path: string; priority: number; changeFrequency: 'weekly' | 'monthly' }> = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/projects', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/services', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/team', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/achievements', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.6, changeFrequency: 'monthly' },
];

function alternates(path: string) {
  if (enabledLocales.length < 2) return undefined;
  return {
    languages: Object.fromEntries(enabledLocales.map((locale) => [locale, `${siteUrl}${localizePath(path, locale)}`])),
  };
}

function entry(
  path: string,
  locale: Locale,
  extra: Partial<MetadataRoute.Sitemap[number]>,
): MetadataRoute.Sitemap[number] {
  return { url: `${siteUrl}${localizePath(path, locale)}`, alternates: alternates(path), ...extra };
}

/** Public pages + every published project. Regenerated with the `projects` cache tag. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();

  return enabledLocales.flatMap((locale) => [
    ...STATIC_PAGES.map((page) =>
      entry(page.path, locale, { priority: page.priority, changeFrequency: page.changeFrequency }),
    ),
    ...projects.map((project) =>
      entry(`/projects/${project.slug}`, locale, {
        lastModified: project.updatedAt,
        priority: 0.8,
        changeFrequency: 'monthly',
      }),
    ),
  ]);
}
