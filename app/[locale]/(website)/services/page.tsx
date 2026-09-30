import type { Metadata } from 'next';
import Link from 'next/link';

import { ProcessSection } from '@/components/home/home-sections';
import { ServiceIcon } from '@/components/services/service-icon';
import { CtaSection } from '@/components/shared/cta-section';
import { EmptyState } from '@/components/shared/empty-state';
import { FaqList } from '@/components/shared/faq-list';
import { PageIntro } from '@/components/shared/page-intro';
import { RichText } from '@/components/shared/rich-text';
import { TagList } from '@/components/ui/badge';
import { Container } from '@/components/ui/container';
import { Section, SectionHeader } from '@/components/ui/section';
import { getFaqs, getServices, getSiteSettings } from '@/lib/api/content';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { localizePath } from '@/lib/i18n/routing';
import { breadcrumbTrail } from '@/lib/seo/breadcrumbs';
import { buildPageMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({ params }: PageProps<'/[locale]/services'>): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const dict = getDictionary(locale);
  return buildPageMetadata({
    locale,
    settings: await getSiteSettings(),
    path: '/services',
    title: dict.meta.pages.services.title,
    description: dict.meta.pages.services.description,
  });
}

export default async function ServicesPage({ params }: PageProps<'/[locale]/services'>) {
  const locale = (await params).locale as Locale;
  const dict = getDictionary(locale);
  const [services, settings, faqs] = await Promise.all([getServices(), getSiteSettings(), getFaqs()]);

  return (
    <>
      <PageIntro
        eyebrow={dict.services.eyebrow}
        title={dict.services.title}
        subtitle={dict.services.subtitle}
        breadcrumbs={breadcrumbTrail(locale, dict, [{ name: dict.nav.services, path: '/services' }])}
        breadcrumbLabel={dict.common.breadcrumb}
      />

      <Container className="py-12 sm:py-16">
        {services.length === 0 ? (
          <EmptyState message={dict.services.empty} />
        ) : (
          <div className="space-y-6">
            {services.map((service) => (
              <article
                key={service.slug}
                id={service.slug}
                aria-labelledby={`${service.slug}-title`}
                className="reveal grid scroll-mt-28 gap-6 card p-6 transition-colors target:border-primary/50 sm:p-8 lg:grid-cols-[auto_1fr_18rem]"
              >
                <span className="icon-tile size-14">
                  <ServiceIcon name={service.icon} className="size-7" />
                </span>
                <div>
                  <h2 id={`${service.slug}-title`} className="text-xl font-bold sm:text-2xl">
                    {service.title}
                  </h2>
                  <p className="mt-2 text-lg leading-8 text-muted">{service.summary}</p>
                  <RichText text={service.description} className="mt-4 text-base sm:text-base" />
                </div>
                <div className="space-y-5 border-t border-line pt-5 lg:border-s lg:border-t-0 lg:ps-6 lg:pt-0">
                  {service.technologies.length ? (
                    <div>
                      <h3 className="mb-2 text-sm font-bold">{dict.services.technologies}</h3>
                      <TagList items={service.technologies.map((technology) => technology.name)} />
                    </div>
                  ) : null}
                  {service.projects.length ? (
                    <div>
                      <h3 className="mb-2 text-sm font-bold">{dict.services.relatedProjects}</h3>
                      <ul className="space-y-1.5 text-sm">
                        {service.projects.map((project) => (
                          <li key={project.slug}>
                            <Link
                              href={localizePath(`/projects/${project.slug}`, locale)}
                              className="text-primary-bright transition-colors hover:text-aqua hover:underline"
                            >
                              {project.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </Container>

      <ProcessSection dict={dict} steps={settings.processSteps} />

      {faqs.length ? (
        <Section labelledBy="faq-title">
          <div className="mx-auto max-w-3xl">
            <SectionHeader id="faq-title" eyebrow={dict.faq.eyebrow} title={dict.faq.title} align="center" />
            <FaqList faqs={faqs} />
          </div>
        </Section>
      ) : null}

      <CtaSection
        title={settings.ctaTitle ?? dict.cta.defaultTitle}
        subtitle={settings.ctaSubtitle ?? dict.cta.defaultSubtitle}
        primary={{ href: localizePath('/contact', locale), label: dict.cta.primary }}
        secondary={{ href: localizePath('/projects', locale), label: dict.cta.secondary }}
      />
    </>
  );
}
