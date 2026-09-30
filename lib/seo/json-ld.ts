import { siteUrl } from '@/lib/constants/env';
import type { Locale } from '@/lib/i18n/config';
import { localizePath } from '@/lib/i18n/routing';
import type { ProjectDetail, SiteSettings, TeamMember } from '@/types/api';

/**
 * Structured data (schema.org). Only types that match the real content are used:
 * Organization, WebSite, BreadcrumbList, Person (team), CreativeWork (projects).
 */

type JsonLdObject = Record<string, unknown>;

const organizationId = `${siteUrl}/#organization`;
const websiteId = `${siteUrl}/#website`;

function absoluteUrl(pathOrUrl: string): string {
  return /^https?:\/\//.test(pathOrUrl) ? pathOrUrl : `${siteUrl}${pathOrUrl}`;
}

function compact<T extends JsonLdObject>(object: T): T {
  return Object.fromEntries(
    Object.entries(object).filter(([, value]) =>
      Array.isArray(value) ? value.length > 0 : value !== null && value !== undefined && value !== '',
    ),
  ) as T;
}

export function organizationSchema(settings: SiteSettings, locale: Locale): JsonLdObject {
  return compact({
    '@type': 'Organization',
    '@id': organizationId,
    name: settings.siteName,
    url: absoluteUrl(localizePath('/', locale)),
    logo: settings.logoUrl ? absoluteUrl(settings.logoUrl) : undefined,
    description: settings.description ?? settings.tagline ?? undefined,
    email: settings.email ?? undefined,
    telephone: settings.phone ?? undefined,
    sameAs: settings.socialLinks.map((link) => link.url),
  });
}

export function websiteSchema(settings: SiteSettings, locale: Locale): JsonLdObject {
  return compact({
    '@type': 'WebSite',
    '@id': websiteId,
    name: settings.siteName,
    url: absoluteUrl(localizePath('/', locale)),
    inLanguage: locale,
    publisher: { '@id': organizationId },
  });
}

export interface BreadcrumbItem {
  name: string;
  /** Path including locale prefix (as produced by localizePath). */
  href: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]): JsonLdObject {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function personSchema(member: TeamMember, locale: Locale): JsonLdObject {
  return compact({
    '@type': 'Person',
    '@id': `${siteUrl}${localizePath('/team', locale)}#${member.slug}`,
    name: member.name,
    jobTitle: member.role,
    description: member.bio ?? undefined,
    image: member.avatarUrl ? absoluteUrl(member.avatarUrl) : undefined,
    knowsAbout: member.skills,
    sameAs: member.socialLinks.map((link) => link.url),
    worksFor: { '@id': organizationId },
  });
}

export function projectSchema(project: ProjectDetail, locale: Locale): JsonLdObject {
  const image = project.ogImageUrl ?? project.coverImageUrl;
  return compact({
    '@type': 'CreativeWork',
    '@id': `${siteUrl}${localizePath(`/projects/${project.slug}`, locale)}#project`,
    name: project.title,
    headline: project.title,
    abstract: project.summary,
    description: project.seoDescription ?? project.summary,
    url: absoluteUrl(localizePath(`/projects/${project.slug}`, locale)),
    image: image ? absoluteUrl(image) : undefined,
    inLanguage: locale,
    dateCreated: project.startDate ?? undefined,
    datePublished: project.publishedAt ?? undefined,
    dateModified: project.updatedAt,
    keywords: project.technologies.map((technology) => technology.name).join(', '),
    genre: project.category ?? undefined,
    creator: { '@id': organizationId },
    contributor: project.members.map((member) => ({
      '@type': 'Person',
      '@id': `${siteUrl}${localizePath('/team', locale)}#${member.slug}`,
      name: member.name,
    })),
    sameAs: project.liveUrl ?? undefined,
  });
}

/** Wraps several schema objects into one JSON-LD graph. */
export function jsonLdGraph(...nodes: JsonLdObject[]): JsonLdObject {
  return { '@context': 'https://schema.org', '@graph': nodes };
}
