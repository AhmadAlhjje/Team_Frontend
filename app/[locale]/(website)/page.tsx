import type { Metadata } from 'next';

import {
  ClientsSection,
  AboutSection,
  AchievementsSection,
  FeaturedProjectsSection,
  ProcessSection,
  ServicesSection,
  TeamSection,
  TestimonialsSection,
} from '@/components/home/home-sections';
import { Hero } from '@/components/home/hero';
import { StatsStrip } from '@/components/home/stats-strip';
import { CtaSection } from '@/components/shared/cta-section';
import {
  getAchievements,
  getClients,
  getProjects,
  getServices,
  getSiteSettings,
  getStats,
  getTeamMembers,
  getTestimonials,
} from '@/lib/api/content';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { localizePath } from '@/lib/i18n/routing';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { completeRows } from '@/lib/utils/grid';
import { stripHighlights } from '@/lib/utils/highlight';

const FEATURED_LIMIT = 6;
/** Columns of the project grid on desktop (components/projects/project-grid.tsx). */
const PROJECTS_PER_ROW = 3;

export async function generateMetadata({ params }: PageProps<'/[locale]'>): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const dict = getDictionary(locale);
  const settings = await getSiteSettings();

  return buildPageMetadata({
    locale,
    settings,
    path: '/',
    title: settings.tagline ? `${settings.siteName} — ${settings.tagline}` : settings.siteName,
    absoluteTitle: true,
    description: settings.description ?? dict.meta.pages.home.description,
  });
}

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const locale = (await params).locale as Locale;
  const dict = getDictionary(locale);

  const [settings, stats, services, featured, team, achievements, testimonials, clients] = await Promise.all([
    getSiteSettings(),
    getStats(),
    getServices(),
    getProjects({ featured: true, limit: FEATURED_LIMIT }),
    getTeamMembers(),
    getAchievements(),
    getTestimonials(),
    getClients(),
  ]);

  // Complete rows only need the full list (shared, cached with /projects) when the featured ones do not fill them.
  const projects =
    featured.length > 0 && featured.length % PROJECTS_PER_ROW === 0
      ? featured
      : completeRows(featured, await getProjects(), { perRow: PROJECTS_PER_ROW, max: FEATURED_LIMIT });
  const path = (value: string) => localizePath(value, locale);
  const heroTitle = settings.heroTitle ?? dict.hero.defaultTitle;
  // The tagline is shown above the headline only when it adds information.
  const comparable = (text: string) => stripHighlights(text).replace(/[.،]/g, '').trim();
  const eyebrow = settings.tagline && comparable(settings.tagline) !== comparable(heroTitle) ? settings.tagline : null;

  return (
    <>
      <Hero
        eyebrow={eyebrow}
        title={heroTitle}
        subtitle={settings.heroSubtitle ?? dict.hero.defaultSubtitle}
        primary={{ href: path('/projects'), label: dict.hero.primaryCta }}
        secondary={{ href: path('/contact'), label: dict.hero.secondaryCta }}
      />
      <StatsStrip stats={stats} labels={dict.stats} locale={locale} overlap />
      <AboutSection locale={locale} dict={dict} title={settings.aboutTitle} summary={settings.aboutSummary} />
      <ServicesSection locale={locale} dict={dict} services={services} />
      <FeaturedProjectsSection locale={locale} dict={dict} projects={projects} />
      <ProcessSection dict={dict} steps={settings.processSteps} />
      <TeamSection locale={locale} dict={dict} members={team} />
      <AchievementsSection locale={locale} dict={dict} achievements={achievements} />
      <TestimonialsSection locale={locale} dict={dict} testimonials={testimonials} />
      <ClientsSection dict={dict} clients={clients} />
      <CtaSection
        title={settings.ctaTitle ?? dict.cta.defaultTitle}
        subtitle={settings.ctaSubtitle ?? dict.cta.defaultSubtitle}
        primary={{ href: path('/contact'), label: dict.cta.primary }}
        secondary={{ href: path('/projects'), label: dict.cta.secondary }}
      />
    </>
  );
}
