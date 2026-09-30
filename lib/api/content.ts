import 'server-only';

import { fallbackSiteName } from '@/lib/constants/env';
import type {
  Achievement,
  Client,
  Faq,
  ProjectDetail,
  ProjectSummary,
  Service,
  SiteSettings,
  SiteStats,
  TeamMember,
  Testimonial,
} from '@/types/api';

import { apiGet, withBuildFallback } from './client';

/**
 * Typed accessors for the public API. Pages call these functions, never
 * `fetch` directly, so caching tags and fallbacks stay consistent.
 * Identical requests within one render are deduplicated by Next.js.
 */

export const emptySettings: SiteSettings = {
  siteName: fallbackSiteName,
  tagline: null,
  description: null,
  logoUrl: null,
  email: null,
  phone: null,
  whatsapp: null,
  location: null,
  heroTitle: null,
  heroSubtitle: null,
  aboutTitle: null,
  aboutSummary: null,
  aboutContent: null,
  ctaTitle: null,
  ctaSubtitle: null,
  foundedYear: null,
  defaultOgImageUrl: null,
  socialLinks: [],
  processSteps: [],
  updatedAt: new Date(0).toISOString(),
};

const emptyStats: SiteStats = {
  projects: 0,
  liveProjects: 0,
  teamMembers: 0,
  clients: 0,
  achievements: 0,
  yearsOfExperience: null,
};

export function getSiteSettings(): Promise<SiteSettings> {
  return withBuildFallback(apiGet<SiteSettings>('/settings/public', { tags: ['settings'] }), emptySettings, 'settings');
}

export function getStats(): Promise<SiteStats> {
  return withBuildFallback(apiGet<SiteStats>('/stats', { tags: ['stats'] }), emptyStats, 'stats');
}

export function getTeamMembers(): Promise<TeamMember[]> {
  return withBuildFallback(apiGet<TeamMember[]>('/team', { tags: ['team'] }), [], 'team');
}

export function getServices(): Promise<Service[]> {
  return withBuildFallback(apiGet<Service[]>('/services', { tags: ['services'] }), [], 'services');
}

export function getProjects(options: { featured?: boolean; limit?: number } = {}): Promise<ProjectSummary[]> {
  const params = new URLSearchParams();
  if (options.featured) params.set('featured', 'true');
  if (options.limit) params.set('limit', String(options.limit));
  const query = params.size > 0 ? `?${params.toString()}` : '';

  return withBuildFallback(apiGet<ProjectSummary[]>(`/projects${query}`, { tags: ['projects'] }), [], 'projects');
}

/** Throws ApiNotFoundError when the project does not exist or is not published. */
export function getProject(slug: string): Promise<ProjectDetail> {
  return apiGet<ProjectDetail>(`/projects/${encodeURIComponent(slug)}`, {
    tags: ['projects'],
    extraTags: [`project:${slug}`],
  });
}

export function getAchievements(): Promise<Achievement[]> {
  return withBuildFallback(apiGet<Achievement[]>('/achievements', { tags: ['achievements'] }), [], 'achievements');
}

export function getClients(): Promise<Client[]> {
  return withBuildFallback(apiGet<Client[]>('/clients', { tags: ['clients'] }), [], 'clients');
}

export function getTestimonials(): Promise<Testimonial[]> {
  return withBuildFallback(apiGet<Testimonial[]>('/testimonials', { tags: ['testimonials'] }), [], 'testimonials');
}

export function getFaqs(): Promise<Faq[]> {
  return withBuildFallback(apiGet<Faq[]>('/faqs', { tags: ['faqs'] }), [], 'faqs');
}
