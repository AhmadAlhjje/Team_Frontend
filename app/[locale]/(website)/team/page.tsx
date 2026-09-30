import type { Metadata } from 'next';

import { CtaSection } from '@/components/shared/cta-section';
import { EmptyState } from '@/components/shared/empty-state';
import { JsonLd } from '@/components/shared/json-ld';
import { PageIntro } from '@/components/shared/page-intro';
import { TeamMemberProfile } from '@/components/team/team-member-card';
import { Container } from '@/components/ui/container';
import { getSiteSettings, getTeamMembers } from '@/lib/api/content';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { localizePath } from '@/lib/i18n/routing';
import { breadcrumbTrail } from '@/lib/seo/breadcrumbs';
import { jsonLdGraph, personSchema } from '@/lib/seo/json-ld';
import { buildPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({ params }: PageProps<'/[locale]/team'>): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const dict = getDictionary(locale);
  return buildPageMetadata({
    locale,
    settings: await getSiteSettings(),
    path: '/team',
    title: dict.meta.pages.team.title,
    description: dict.meta.pages.team.description,
  });
}

export default async function TeamPage({ params }: PageProps<'/[locale]/team'>) {
  const locale = (await params).locale as Locale;
  const dict = getDictionary(locale);
  const members = await getTeamMembers();

  return (
    <>
      <PageIntro
        eyebrow={dict.team.eyebrow}
        title={dict.team.title}
        subtitle={dict.team.subtitle}
        breadcrumbs={breadcrumbTrail(locale, dict, [{ name: dict.nav.team, path: '/team' }])}
        breadcrumbLabel={dict.common.breadcrumb}
      />
      <Container className="py-12 sm:py-16">
        {members.length ? (
          <ul className="grid gap-6 md:grid-cols-2">
            {members.map((member) => (
              <li key={member.slug} className="flex [&>article]:flex-1">
                <TeamMemberProfile member={member} locale={locale} dict={dict} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState message={dict.team.empty} />
        )}
      </Container>
      {members.length ? <JsonLd data={jsonLdGraph(...members.map((member) => personSchema(member, locale)))} /> : null}
      <CtaSection
        title={dict.cta.defaultTitle}
        subtitle={dict.cta.defaultSubtitle}
        primary={{ href: localizePath('/contact', locale), label: dict.cta.primary }}
      />
    </>
  );
}
