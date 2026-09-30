import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { TestimonialCard } from '@/components/home/home-sections';
import { CheckIcon, ExternalIcon } from '@/components/icons';
import { ProjectCover } from '@/components/projects/project-cover';
import { ProjectGrid } from '@/components/projects/project-grid';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import { CtaSection } from '@/components/shared/cta-section';
import { JsonLd } from '@/components/shared/json-ld';
import { RichText } from '@/components/shared/rich-text';
import { SmartImage } from '@/components/shared/smart-image';
import { MemberAvatar } from '@/components/team/team-member-card';
import { Badge, TagList } from '@/components/ui/badge';
import { buttonClasses } from '@/components/ui/button-link';
import { Container } from '@/components/ui/container';
import { ApiNotFoundError } from '@/lib/api/client';
import { getProject, getProjects, getSiteSettings } from '@/lib/api/content';
import { defaultLocale, type Locale } from '@/lib/i18n/config';
import { type Dictionary, getDictionary } from '@/lib/i18n/get-dictionary';
import { localizePath } from '@/lib/i18n/routing';
import { breadcrumbTrail } from '@/lib/seo/breadcrumbs';
import { jsonLdGraph, projectSchema } from '@/lib/seo/json-ld';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { formatDateRange, formatMonthYear } from '@/lib/utils/format';
import { toPlainExcerpt } from '@/lib/utils/rich-text';
import type { ProjectDetail } from '@/types/api';

/** Projects published after the build are rendered on first request, then cached. */
export const dynamicParams = true;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

async function loadProject(slug: string): Promise<ProjectDetail> {
  try {
    return await getProject(slug);
  } catch (error) {
    if (error instanceof ApiNotFoundError) notFound();
    throw error;
  }
}

export async function generateMetadata({ params }: PageProps<'/[locale]/projects/[slug]'>): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const [project, settings] = await Promise.all([loadProject(slug), getSiteSettings()]);

  return buildPageMetadata({
    locale,
    settings,
    path: `/projects/${project.slug}`,
    title: project.seoTitle ?? project.title,
    description: project.seoDescription ?? toPlainExcerpt(project.summary),
    image: project.ogImageUrl ?? project.coverImageUrl,
    type: 'article',
  });
}

function ContentBlock({ id, title, text }: { id: string; title: string; text: string | null }) {
  if (!text) return null;
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="mb-4 text-xl font-bold sm:text-2xl">
        {title}
      </h2>
      <RichText text={text} />
    </section>
  );
}

function ProjectFacts({ project, locale, dict }: { project: ProjectDetail; locale: Locale; dict: Dictionary }) {
  const labels = dict.projects.detail;
  const timeline = formatDateRange(project.startDate, project.endDate, locale, labels.present);
  const rows: Array<{ label: string; value: React.ReactNode }> = [
    ...(project.category ? [{ label: labels.category, value: project.category }] : []),
    { label: labels.status, value: dict.projects.phases[project.phase] },
    ...(timeline ? [{ label: labels.timeline, value: timeline }] : []),
    ...(project.client ? [{ label: labels.client, value: project.client.name }] : []),
    ...(project.services.length
      ? [
          {
            label: labels.services,
            value: (
              <ul className="space-y-1">
                {project.services.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`${localizePath('/services', locale)}#${service.slug}`}
                      className="text-primary-bright transition-colors hover:text-aqua hover:underline"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ),
          },
        ]
      : []),
  ];

  return (
    <aside aria-labelledby="facts-title" className="space-y-6 lg:sticky lg:top-24">
      <div className="card p-6">
        <h2 id="facts-title" className="mb-4 text-base font-bold">
          {labels.facts}
        </h2>
        <dl className="space-y-4 text-sm">
          {rows.map((row) => (
            <div key={row.label}>
              <dt className="text-muted">{row.label}</dt>
              <dd className="mt-0.5 font-medium text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>
        {project.technologies.length ? (
          <div className="mt-6 border-t border-line pt-5">
            <h3 className="mb-3 text-sm font-semibold">{labels.technologies}</h3>
            <TagList items={project.technologies.map((technology) => technology.name)} />
          </div>
        ) : null}
      </div>

      {project.members.length ? (
        <div className="card p-6">
          <h2 className="mb-4 text-base font-bold">{labels.team}</h2>
          <ul className="space-y-4">
            {project.members.map((member) => (
              <li key={member.slug}>
                <Link
                  href={`${localizePath('/team', locale)}#${member.slug}`}
                  className="group flex items-center gap-3"
                >
                  <MemberAvatar member={member} size="sm" />
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-ink transition-colors group-hover:text-aqua">
                      {member.name}
                    </span>
                    <span className="block truncate text-xs text-muted" dir="auto">
                      {member.contribution ?? member.role}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}

export default async function ProjectPage({ params }: PageProps<'/[locale]/projects/[slug]'>) {
  const { locale: rawLocale, slug } = await params;
  const locale = (rawLocale ?? defaultLocale) as Locale;
  const dict = getDictionary(locale);
  const labels = dict.projects.detail;
  const project = await loadProject(slug);

  return (
    <article aria-labelledby="project-title">
      <header className="relative isolate overflow-hidden border-b border-line/60">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 opacity-80 bg-aurora" />
          <div className="absolute inset-0 bg-grid" />
        </div>
        <Container className="pt-12 pb-12 sm:pt-16 sm:pb-14">
          <Breadcrumbs
            label={dict.common.breadcrumb}
            items={breadcrumbTrail(locale, dict, [
              { name: dict.nav.projects, path: '/projects' },
              { name: project.title, path: `/projects/${project.slug}` },
            ])}
          />
          <div className="flex flex-wrap items-center gap-2">
            {project.category ? <Badge tone="primary">{project.category}</Badge> : null}
            <Badge
              tone={project.phase === 'LIVE' ? 'success' : project.phase === 'IN_PROGRESS' ? 'warning' : 'neutral'}
            >
              {dict.projects.phases[project.phase]}
            </Badge>
          </div>
          <h1 id="project-title" className="mt-4 max-w-3xl text-3xl font-bold sm:text-4xl lg:text-5xl">
            {project.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-body sm:text-xl sm:leading-9">{project.summary}</p>
          {project.liveUrl || project.repositoryUrl ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {project.liveUrl ? (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses('primary', 'md')}
                >
                  {labels.visitLive}
                  <ExternalIcon />
                  <span className="sr-only">{dict.common.opensInNewTab}</span>
                </a>
              ) : null}
              {project.repositoryUrl ? (
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses('secondary', 'md')}
                >
                  {labels.viewCode}
                  <ExternalIcon />
                  <span className="sr-only">{dict.common.opensInNewTab}</span>
                </a>
              ) : null}
            </div>
          ) : null}
        </Container>
      </header>

      <Container className="py-10 sm:py-14">
        {project.coverImageUrl ? (
          <div className="relative mb-12 aspect-video overflow-hidden rounded-3xl border border-line bg-raised shadow-[0_40px_100px_-50px_rgb(59_130_246/0.5)]">
            <ProjectCover
              src={project.coverImageUrl}
              title={project.title}
              alt={project.title}
              sizes="(min-width: 1152px) 1088px, 100vw"
              preload
            />
          </div>
        ) : null}

        <div className="grid gap-12 lg:grid-cols-[1fr_20rem]">
          <div className="min-w-0 space-y-12">
            <ContentBlock id="overview" title={labels.overview} text={project.description} />

            {project.problem || project.solution ? (
              <div className="grid gap-6 md:grid-cols-2">
                {project.problem ? (
                  <section aria-labelledby="problem" className="card p-6">
                    <h2 id="problem" className="mb-3 text-lg font-bold">
                      {labels.problem}
                    </h2>
                    <RichText text={project.problem} className="text-base sm:text-base" />
                  </section>
                ) : null}
                {project.solution ? (
                  <section
                    aria-labelledby="solution"
                    className="rounded-2xl border border-primary/30 bg-primary/10 p-6"
                  >
                    <h2 id="solution" className="mb-3 text-lg font-bold">
                      {labels.solution}
                    </h2>
                    <RichText text={project.solution} className="text-base sm:text-base" />
                  </section>
                ) : null}
              </div>
            ) : null}

            {project.features.length ? (
              <section aria-labelledby="features">
                <h2 id="features" className="mb-5 text-xl font-bold sm:text-2xl">
                  {labels.features}
                </h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {project.features.map((feature) => (
                    <li key={feature.title} className="flex gap-3 card rounded-xl p-4">
                      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-aqua">
                        <CheckIcon className="size-4" />
                      </span>
                      <div>
                        <p className="font-semibold text-ink">{feature.title}</p>
                        {feature.description ? (
                          <p className="mt-1 text-sm leading-7 text-muted">{feature.description}</p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {project.images.length ? (
              <section aria-labelledby="screenshots">
                <h2 id="screenshots" className="mb-5 text-xl font-bold sm:text-2xl">
                  {labels.screenshots}
                </h2>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {project.images.map((image, index) => (
                    <li key={image.url}>
                      <figure className="overflow-hidden rounded-xl border border-line bg-surface">
                        <a href={image.url} target="_blank" rel="noopener noreferrer" className="block">
                          {image.width && image.height ? (
                            <SmartImage
                              src={image.url}
                              alt={image.alt ?? `${project.title} (${index + 1})`}
                              width={image.width}
                              height={image.height}
                              sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                              className="h-auto w-full"
                            />
                          ) : (
                            <div className="relative aspect-[16/10]">
                              <SmartImage
                                src={image.url}
                                alt={image.alt ?? `${project.title} (${index + 1})`}
                                fill
                                sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                                className="object-cover"
                              />
                            </div>
                          )}
                        </a>
                        {image.alt ? (
                          <figcaption className="px-4 py-2.5 text-sm text-muted">{image.alt}</figcaption>
                        ) : null}
                      </figure>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <ContentBlock id="our-role" title={labels.ourRole} text={project.ourRole} />
            <ContentBlock id="results" title={labels.results} text={project.results} />

            {project.achievements.length ? (
              <section aria-labelledby="achievements">
                <h2 id="achievements" className="mb-4 text-xl font-bold sm:text-2xl">
                  {labels.achievements}
                </h2>
                <ul className="space-y-2">
                  {project.achievements.map((achievement) => (
                    <li key={achievement.title} className="card rounded-xl px-4 py-3">
                      <span className="font-semibold text-ink">{achievement.title}</span>
                      {achievement.highlight ? (
                        <span className="text-amber-300"> — {achievement.highlight}</span>
                      ) : null}
                      {achievement.date ? (
                        <span className="ms-2 text-sm text-muted">{formatMonthYear(achievement.date, locale)}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {project.testimonials.length ? (
              <section aria-labelledby="testimonial">
                <h2 id="testimonial" className="mb-4 text-xl font-bold sm:text-2xl">
                  {labels.testimonial}
                </h2>
                <div className="grid gap-4">
                  {project.testimonials.map((testimonial) => (
                    <TestimonialCard
                      key={testimonial.id}
                      testimonial={{ ...testimonial, project: null }}
                      locale={locale}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <ProjectFacts project={project} locale={locale} dict={dict} />
        </div>
      </Container>

      {project.relatedProjects.length ? (
        <section aria-labelledby="related" className="border-t border-line/60 bg-band py-14 sm:py-16">
          <Container>
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 id="related" className="text-2xl font-bold sm:text-3xl">
                {labels.related}
              </h2>
              <Link
                href={localizePath('/projects', locale)}
                className="text-sm font-bold text-primary-bright transition-colors hover:text-aqua"
              >
                {labels.backToProjects}
              </Link>
            </div>
            <ProjectGrid projects={project.relatedProjects} locale={locale} labels={dict.projects} />
          </Container>
        </section>
      ) : null}

      <CtaSection
        title={dict.cta.defaultTitle}
        subtitle={dict.cta.defaultSubtitle}
        primary={{ href: localizePath('/contact', locale), label: dict.cta.primary }}
      />
      <JsonLd data={jsonLdGraph(projectSchema(project, locale))} />
    </article>
  );
}
