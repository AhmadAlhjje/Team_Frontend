import type { Metadata } from 'next';

import { ProjectGrid } from '@/components/projects/project-grid';
import { CtaSection } from '@/components/shared/cta-section';
import { EmptyState } from '@/components/shared/empty-state';
import { PageIntro } from '@/components/shared/page-intro';
import { Container } from '@/components/ui/container';
import { getProjects, getSiteSettings } from '@/lib/api/content';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { localizePath } from '@/lib/i18n/routing';
import { breadcrumbTrail } from '@/lib/seo/breadcrumbs';
import { buildPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({ params }: PageProps<'/[locale]/projects'>): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const dict = getDictionary(locale);
  return buildPageMetadata({
    locale,
    settings: await getSiteSettings(),
    path: '/projects',
    title: dict.meta.pages.projects.title,
    description: dict.meta.pages.projects.description,
  });
}

export default async function ProjectsPage({ params }: PageProps<'/[locale]/projects'>) {
  const locale = (await params).locale as Locale;
  const dict = getDictionary(locale);
  const projects = await getProjects();

  return (
    <>
      <PageIntro
        eyebrow={dict.projects.eyebrow}
        title={dict.projects.title}
        subtitle={dict.projects.subtitle}
        breadcrumbs={breadcrumbTrail(locale, dict, [{ name: dict.nav.projects, path: '/projects' }])}
        breadcrumbLabel={dict.common.breadcrumb}
      />
      <Container className="py-12 sm:py-16">
        {projects.length ? (
          <ProjectGrid projects={projects} locale={locale} labels={dict.projects} headingLevel="h2" />
        ) : (
          <EmptyState message={dict.projects.empty} />
        )}
      </Container>
      <CtaSection
        title={dict.cta.defaultTitle}
        subtitle={dict.cta.defaultSubtitle}
        primary={{ href: localizePath('/contact', locale), label: dict.cta.primary }}
      />
    </>
  );
}
