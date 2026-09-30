import type { Metadata } from 'next';

import { BrandMark } from '@/components/brand/brand-mark';
import { ProcessSection, TeamSection } from '@/components/home/home-sections';
import { StatsStrip } from '@/components/home/stats-strip';
import { CtaSection } from '@/components/shared/cta-section';
import { PageIntro } from '@/components/shared/page-intro';
import { RichText } from '@/components/shared/rich-text';
import { Section } from '@/components/ui/section';
import { getSiteSettings, getStats, getTeamMembers } from '@/lib/api/content';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { localizePath } from '@/lib/i18n/routing';
import { breadcrumbTrail } from '@/lib/seo/breadcrumbs';
import { buildPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({ params }: PageProps<'/[locale]/about'>): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const dict = getDictionary(locale);
  return buildPageMetadata({
    locale,
    settings: await getSiteSettings(),
    path: '/about',
    title: dict.meta.pages.about.title,
    description: dict.meta.pages.about.description,
  });
}

export default async function AboutPage({ params }: PageProps<'/[locale]/about'>) {
  const locale = (await params).locale as Locale;
  const dict = getDictionary(locale);
  const [settings, stats, team] = await Promise.all([getSiteSettings(), getStats(), getTeamMembers()]);

  return (
    <>
      <PageIntro
        eyebrow={dict.about.eyebrow}
        title={settings.aboutTitle ?? dict.about.defaultTitle}
        subtitle={settings.aboutSummary}
        breadcrumbs={breadcrumbTrail(locale, dict, [{ name: dict.nav.about, path: '/about' }])}
        breadcrumbLabel={dict.common.breadcrumb}
      />
      <StatsStrip stats={stats} labels={dict.stats} locale={locale} />

      {settings.aboutContent ? (
        <Section labelledBy="story-title">
          <div className="reveal relative mx-auto max-w-3xl overflow-hidden card p-6 sm:p-10">
            <BrandMark className="pointer-events-none absolute -top-8 -inset-e-8 size-40 opacity-[0.07]" />
            <h2 id="story-title" className="mb-6 text-2xl font-bold sm:text-3xl">
              {dict.about.storyTitle}
            </h2>
            <RichText text={settings.aboutContent} />
          </div>
        </Section>
      ) : null}

      <ProcessSection dict={dict} steps={settings.processSteps} />
      <TeamSection locale={locale} dict={dict} members={team} />
      <CtaSection
        title={settings.ctaTitle ?? dict.cta.defaultTitle}
        subtitle={settings.ctaSubtitle ?? dict.cta.defaultSubtitle}
        primary={{ href: localizePath('/contact', locale), label: dict.cta.primary }}
        secondary={{ href: localizePath('/projects', locale), label: dict.cta.secondary }}
      />
    </>
  );
}
