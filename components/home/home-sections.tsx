import Link from 'next/link';

import { AchievementCard } from '@/components/achievements/achievement-card';
import { ArrowForwardIcon, QuoteIcon } from '@/components/icons';
import { ProjectGrid } from '@/components/projects/project-grid';
import { ServiceIcon } from '@/components/services/service-icon';
import { SmartImage } from '@/components/shared/smart-image';
import { Monogram, TeamMemberPreview } from '@/components/team/team-member-card';
import { Eyebrow } from '@/components/ui/eyebrow';
import { Section, SectionHeader } from '@/components/ui/section';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import { localizePath } from '@/lib/i18n/routing';
import type { Achievement, Client, ProcessStep, ProjectSummary, Service, TeamMember, Testimonial } from '@/types/api';

interface BaseProps {
  locale: Locale;
  dict: Dictionary;
}

function ViewAllLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 text-sm font-bold text-primary-bright transition-colors hover:text-aqua"
    >
      {label}
      <ArrowForwardIcon className="size-4 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
    </Link>
  );
}

export function AboutSection({
  locale,
  dict,
  title,
  summary,
}: BaseProps & { title: string | null; summary: string | null }) {
  if (!summary) return null;
  return (
    <Section labelledBy="about-title">
      <div className="reveal grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div>
          <Eyebrow className="mb-4">{dict.about.eyebrow}</Eyebrow>
          <h2 id="about-title" className="text-2xl font-bold sm:text-3xl lg:text-4xl">
            {title ?? dict.about.defaultTitle}
          </h2>
        </div>
        <div className="border-s-2 border-primary/40 ps-6 sm:ps-8">
          <p className="text-lg leading-9 whitespace-pre-line text-body sm:text-xl sm:leading-10">{summary}</p>
          <div className="mt-6">
            <ViewAllLink href={localizePath('/about', locale)} label={dict.about.readMore} />
          </div>
        </div>
      </div>
    </Section>
  );
}

export function ServicesSection({ locale, dict, services }: BaseProps & { services: Service[] }) {
  if (services.length === 0) return null;
  const servicesPath = localizePath('/services', locale);

  return (
    <Section tone="band" labelledBy="services-title">
      <SectionHeader
        id="services-title"
        eyebrow={dict.services.eyebrow}
        title={dict.services.title}
        subtitle={dict.services.subtitle}
        action={<ViewAllLink href={servicesPath} label={dict.services.viewAll} />}
      />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <li key={service.slug} className="reveal">
            <Link
              href={`${servicesPath}#${service.slug}`}
              className="group flex h-full card-interactive flex-col card p-6 sm:p-7"
            >
              <span className="mb-6 icon-tile size-12 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                <ServiceIcon name={service.icon} className="size-6" />
              </span>
              <h3 className="text-lg font-bold transition-colors group-hover:text-aqua">{service.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{service.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function FeaturedProjectsSection({ locale, dict, projects }: BaseProps & { projects: ProjectSummary[] }) {
  if (projects.length === 0) return null;
  return (
    <Section labelledBy="projects-title">
      <SectionHeader
        id="projects-title"
        eyebrow={dict.projects.eyebrow}
        title={dict.projects.title}
        subtitle={dict.projects.subtitle}
        action={<ViewAllLink href={localizePath('/projects', locale)} label={dict.projects.viewAll} />}
      />
      <ProjectGrid projects={projects} locale={locale} labels={dict.projects} />
    </Section>
  );
}

export function ProcessSection({ dict, steps }: Pick<BaseProps, 'dict'> & { steps: ProcessStep[] }) {
  if (steps.length === 0) return null;
  return (
    <Section tone="band" labelledBy="process-title">
      <SectionHeader
        id="process-title"
        eyebrow={dict.process.eyebrow}
        title={dict.process.title}
        subtitle={dict.process.subtitle}
      />
      <div className="relative">
        {/* The path that connects the steps on wide screens. */}
        <span
          aria-hidden="true"
          className="absolute inset-x-[10%] top-6 hidden h-px bg-linear-to-l from-transparent via-line-strong to-transparent lg:block"
        />
        <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="reveal card p-5 lg:border-transparent lg:bg-transparent lg:bg-none lg:p-0 lg:text-center"
            >
              <span
                aria-hidden="true"
                className="mb-4 flex size-12 items-center justify-center rounded-full bg-brand text-base font-bold text-on-brand tabular-nums shadow-[0_0_0_6px_var(--color-band),0_12px_30px_-10px_rgb(34_211_238/0.6)] lg:mx-auto"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="text-base font-bold">{step.title}</h3>
              {step.description ? <p className="mt-2 text-sm leading-7 text-muted">{step.description}</p> : null}
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}

export function TeamSection({ locale, dict, members }: BaseProps & { members: TeamMember[] }) {
  if (members.length === 0) return null;
  return (
    <Section labelledBy="team-title">
      <SectionHeader
        id="team-title"
        eyebrow={dict.team.eyebrow}
        title={dict.team.title}
        subtitle={dict.team.subtitle}
        action={<ViewAllLink href={localizePath('/team', locale)} label={dict.team.viewAll} />}
      />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {members.slice(0, 8).map((member) => (
          <li key={member.slug} className="flex [&>article]:flex-1">
            <TeamMemberPreview member={member} href={`${localizePath('/team', locale)}#${member.slug}`} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function AchievementsSection({ locale, dict, achievements }: BaseProps & { achievements: Achievement[] }) {
  if (achievements.length === 0) return null;
  return (
    <Section tone="band" labelledBy="achievements-title">
      <SectionHeader
        id="achievements-title"
        eyebrow={dict.achievements.eyebrow}
        title={dict.achievements.title}
        subtitle={dict.achievements.subtitle}
        action={<ViewAllLink href={localizePath('/achievements', locale)} label={dict.achievements.viewAll} />}
      />
      <ul className="grid gap-4 lg:grid-cols-3">
        {achievements.slice(0, 3).map((achievement) => (
          <li key={achievement.id} className="flex [&>article]:flex-1">
            <AchievementCard achievement={achievement} locale={locale} dict={dict} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function TestimonialsSection({ locale, dict, testimonials }: BaseProps & { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;
  return (
    <Section labelledBy="testimonials-title">
      <SectionHeader
        id="testimonials-title"
        eyebrow={dict.testimonials.eyebrow}
        title={dict.testimonials.title}
        align="center"
      />
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <li key={testimonial.id} className="reveal flex">
            <TestimonialCard testimonial={testimonial} locale={locale} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function TestimonialCard({ testimonial, locale }: { testimonial: Testimonial; locale: Locale }) {
  return (
    <figure className="relative flex flex-1 flex-col card p-6 sm:p-7">
      <QuoteIcon className="size-9 text-primary/50 rtl:-scale-x-100" />
      <blockquote className="mt-4 flex-1 text-base leading-8 whitespace-pre-line text-body">
        {testimonial.content}
      </blockquote>
      <figcaption className="mt-6 flex items-start gap-3 border-t border-line pt-5">
        {testimonial.avatarUrl ? (
          <SmartImage
            src={testimonial.avatarUrl}
            alt=""
            width={44}
            height={44}
            className="size-11 rounded-full object-cover ring-2 ring-primary/30"
          />
        ) : (
          <Monogram name={testimonial.authorName} className="size-11 text-base" />
        )}
        <div className="min-w-0 text-sm">
          <p className="font-bold text-ink">{testimonial.authorName}</p>
          {testimonial.authorTitle || testimonial.company ? (
            <p className="text-muted">{[testimonial.authorTitle, testimonial.company].filter(Boolean).join(' · ')}</p>
          ) : null}
          {testimonial.project ? (
            <Link
              href={localizePath(`/projects/${testimonial.project.slug}`, locale)}
              className="mt-1 inline-block text-primary-bright underline decoration-primary-bright/40 underline-offset-4 transition-colors hover:text-aqua"
            >
              {testimonial.project.title}
            </Link>
          ) : null}
        </div>
      </figcaption>
    </figure>
  );
}

export function ClientsSection({ dict, clients }: Pick<BaseProps, 'dict'> & { clients: Client[] }) {
  if (clients.length === 0) return null;
  return (
    <section aria-labelledby="clients-title" className="border-y border-line/60 bg-band py-12 sm:py-14">
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <h2 id="clients-title" className="mb-8 text-center text-sm font-bold text-muted">
          {dict.clients.title}
        </h2>
        <ul className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {clients.map((client) => {
            const content = client.logoUrl ? (
              <SmartImage
                src={client.logoUrl}
                alt={client.name}
                width={140}
                height={48}
                className="h-9 w-auto object-contain opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0"
              />
            ) : (
              <span className="text-base font-bold text-body">{client.name}</span>
            );
            const chip =
              'flex h-16 min-w-36 items-center justify-center rounded-2xl border border-line bg-white/2 px-6 transition-colors';
            return (
              <li key={client.id}>
                {client.websiteUrl ? (
                  <a
                    href={client.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={client.name}
                    className={`${chip} hover:border-primary-bright/40`}
                  >
                    {content}
                  </a>
                ) : (
                  <div className={chip}>{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
