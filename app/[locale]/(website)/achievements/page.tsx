import type { Metadata } from 'next';

import { AchievementCard } from '@/components/achievements/achievement-card';
import { CtaSection } from '@/components/shared/cta-section';
import { EmptyState } from '@/components/shared/empty-state';
import { PageIntro } from '@/components/shared/page-intro';
import { Container } from '@/components/ui/container';
import { getAchievements, getSiteSettings } from '@/lib/api/content';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { localizePath } from '@/lib/i18n/routing';
import { breadcrumbTrail } from '@/lib/seo/breadcrumbs';
import { buildPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({ params }: PageProps<'/[locale]/achievements'>): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const dict = getDictionary(locale);
  return buildPageMetadata({
    locale,
    settings: await getSiteSettings(),
    path: '/achievements',
    title: dict.meta.pages.achievements.title,
    description: dict.meta.pages.achievements.description,
  });
}

export default async function AchievementsPage({ params }: PageProps<'/[locale]/achievements'>) {
  const locale = (await params).locale as Locale;
  const dict = getDictionary(locale);
  const achievements = await getAchievements();

  return (
    <>
      <PageIntro
        eyebrow={dict.achievements.eyebrow}
        title={dict.achievements.title}
        subtitle={dict.achievements.subtitle}
        breadcrumbs={breadcrumbTrail(locale, dict, [{ name: dict.nav.achievements, path: '/achievements' }])}
        breadcrumbLabel={dict.common.breadcrumb}
      />
      <Container className="py-12 sm:py-16">
        {achievements.length ? (
          <ul className="mx-auto max-w-3xl space-y-4">
            {achievements.map((achievement) => (
              <li key={achievement.id}>
                <AchievementCard achievement={achievement} locale={locale} dict={dict} headingLevel="h2" />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message={dict.achievements.empty} />
        )}
      </Container>
      <CtaSection
        title={dict.cta.defaultTitle}
        subtitle={dict.cta.defaultSubtitle}
        primary={{ href: localizePath('/contact', locale), label: dict.cta.primary }}
        secondary={{ href: localizePath('/projects', locale), label: dict.cta.secondary }}
      />
    </>
  );
}
