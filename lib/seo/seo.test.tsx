import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { buildStats } from '@/components/home/stats-strip';
import { JsonLd } from '@/components/shared/json-ld';
import { ar } from '@/lib/i18n/dictionaries/ar';
import type { ProjectDetail } from '@/types/api';

import { breadcrumbSchema, jsonLdGraph, projectSchema } from './json-ld';
import { buildPageMetadata } from './metadata';

const settings = { siteName: 'Team', defaultOgImageUrl: 'https://api.example.com/uploads/og.webp' };

describe('buildPageMetadata', () => {
  it('builds canonical, Open Graph and Twitter metadata', () => {
    const metadata = buildPageMetadata({
      locale: 'ar',
      settings,
      path: '/projects/wafeer',
      title: 'Wafeer',
      description: 'An ordering platform',
      type: 'article',
    });

    expect(metadata.alternates?.canonical).toBe('/projects/wafeer');
    expect(metadata.title).toBe('Wafeer');
    expect(metadata.openGraph).toMatchObject({
      title: 'Wafeer | Team',
      url: '/projects/wafeer',
      locale: 'ar_AR',
      siteName: 'Team',
      images: [{ url: settings.defaultOgImageUrl }],
    });
    expect(metadata.twitter).toMatchObject({ card: 'summary_large_image' });
  });

  it('prefers the page image and supports absolute titles', () => {
    const metadata = buildPageMetadata({
      locale: 'ar',
      settings: { siteName: 'Team', defaultOgImageUrl: null },
      path: '/',
      title: 'Team — Builders',
      absoluteTitle: true,
      description: 'Home',
      image: 'https://api.example.com/uploads/cover.webp',
    });
    expect(metadata.title).toEqual({ absolute: 'Team — Builders' });
    expect(metadata.openGraph?.images).toEqual([
      { url: 'https://api.example.com/uploads/cover.webp', alt: 'Team — Builders' },
    ]);
  });
});

describe('structured data', () => {
  it('escapes "<" so API content cannot break out of the script tag', () => {
    const html = renderToStaticMarkup(<JsonLd data={{ name: '</script><script>alert(1)</script>' }} />);
    expect(html).not.toContain('</script><script>');
    expect(html).toContain('\\u003c/script>');
  });

  it('builds breadcrumbs with absolute URLs', () => {
    const schema = breadcrumbSchema([
      { name: 'Home', href: '/' },
      { name: 'Projects', href: '/projects' },
    ]);
    expect(schema.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'http://localhost:3000/' },
      { '@type': 'ListItem', position: 2, name: 'Projects', item: 'http://localhost:3000/projects' },
    ]);
  });

  it('omits empty fields in project schema', () => {
    const project = {
      slug: 'wafeer',
      title: 'Wafeer',
      summary: 'Summary',
      seoDescription: null,
      ogImageUrl: null,
      coverImageUrl: null,
      category: null,
      startDate: null,
      publishedAt: null,
      updatedAt: '2026-01-01T00:00:00.000Z',
      liveUrl: null,
      technologies: [],
      members: [],
    } as unknown as ProjectDetail;
    const graph = jsonLdGraph(projectSchema(project, 'ar'));
    const node = (graph['@graph'] as Array<Record<string, unknown>>)[0];
    expect(node).toMatchObject({
      '@type': 'CreativeWork',
      name: 'Wafeer',
      url: 'http://localhost:3000/projects/wafeer',
    });
    expect(node).not.toHaveProperty('image');
    expect(node).not.toHaveProperty('contributor');
  });
});

describe('buildStats', () => {
  it('only shows real, non-zero numbers (max 4)', () => {
    const stats = buildStats(
      { projects: 12, liveProjects: 0, teamMembers: 5, clients: 3, achievements: 2, yearsOfExperience: 4 },
      ar.stats,
    );
    expect(stats.map((item) => item.value)).toEqual([12, 5, 3, 2]);
    expect(
      buildStats(
        { projects: 0, liveProjects: 0, teamMembers: 0, clients: 0, achievements: 0, yearsOfExperience: null },
        ar.stats,
      ),
    ).toEqual([]);
  });
});
