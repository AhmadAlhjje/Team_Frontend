/**
 * Public API contract (GET /api/v1/...).
 *
 * These types mirror the backend's public response DTOs
 * (backend/src/modules/<module>/dto/*-response.dto.ts).
 * When a backend response changes, update this file in the same change.
 */

export type ProjectPhase = 'IN_PROGRESS' | 'LIVE' | 'COMPLETED';

export type AchievementType = 'COMPETITION' | 'AWARD' | 'CERTIFICATION' | 'MILESTONE' | 'OTHER';

export type SocialPlatform =
  | 'WEBSITE'
  | 'GITHUB'
  | 'LINKEDIN'
  | 'X'
  | 'INSTAGRAM'
  | 'FACEBOOK'
  | 'YOUTUBE'
  | 'BEHANCE'
  | 'DRIBBBLE'
  | 'TELEGRAM'
  | 'WHATSAPP'
  | 'OTHER';

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  label: string | null;
}

export interface Technology {
  name: string;
  slug: string;
}

export interface ProcessStep {
  title: string;
  description: string | null;
}

export interface SiteSettings {
  siteName: string;
  tagline: string | null;
  description: string | null;
  logoUrl: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  location: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
  aboutTitle: string | null;
  aboutSummary: string | null;
  aboutContent: string | null;
  ctaTitle: string | null;
  ctaSubtitle: string | null;
  foundedYear: number | null;
  defaultOgImageUrl: string | null;
  socialLinks: SocialLink[];
  processSteps: ProcessStep[];
  updatedAt: string;
}

export interface SiteStats {
  projects: number;
  liveProjects: number;
  teamMembers: number;
  clients: number;
  achievements: number;
  yearsOfExperience: number | null;
}

export interface ProjectReference {
  slug: string;
  title: string;
}

export interface TeamMember {
  id: number;
  slug: string;
  name: string;
  role: string;
  specialization: string | null;
  bio: string | null;
  avatarUrl: string | null;
  skills: string[];
  socialLinks: SocialLink[];
  projects: Array<ProjectReference & { contribution: string | null }>;
}

export interface Service {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description: string | null;
  icon: string;
  technologies: Technology[];
  projects: ProjectReference[];
}

export interface ProjectSummary {
  id: number;
  slug: string;
  title: string;
  summary: string;
  category: string | null;
  coverImageUrl: string | null;
  phase: ProjectPhase;
  isFeatured: boolean;
  technologies: Technology[];
  startDate: string | null;
  endDate: string | null;
  updatedAt: string;
}

export interface ProjectImage {
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
}

export interface ProjectFeature {
  title: string;
  description: string | null;
}

export interface ProjectMember {
  slug: string;
  name: string;
  role: string;
  contribution: string | null;
  avatarUrl: string | null;
}

export interface ClientReference {
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  industry: string | null;
}

export interface Testimonial {
  id: number;
  authorName: string;
  authorTitle: string | null;
  company: string | null;
  content: string;
  avatarUrl: string | null;
  project: ProjectReference | null;
}

export interface ProjectDetail extends ProjectSummary {
  description: string | null;
  problem: string | null;
  solution: string | null;
  ourRole: string | null;
  results: string | null;
  liveUrl: string | null;
  repositoryUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImageUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
  images: ProjectImage[];
  features: ProjectFeature[];
  members: ProjectMember[];
  services: ProjectReference[];
  client: ClientReference | null;
  testimonials: Testimonial[];
  achievements: Array<{ title: string; highlight: string | null; date: string | null }>;
  relatedProjects: ProjectSummary[];
}

export interface Achievement {
  id: number;
  title: string;
  description: string | null;
  type: AchievementType;
  issuer: string | null;
  highlight: string | null;
  date: string | null;
  imageUrl: string | null;
  proofUrl: string | null;
  project: ProjectReference | null;
}

export interface Client {
  id: number;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  industry: string | null;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
}

export interface ContactMessageInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType?: string;
  budget?: string;
  message: string;
  /** Honeypot — must stay empty. */
  website?: string;
  /** Milliseconds between form render and submit (bot heuristic). */
  elapsedMs?: number;
}

/** Error body returned by the backend for every failed request. */
export interface ApiErrorBody {
  statusCode: number;
  error: string;
  message: string;
  details?: Array<{ field: string; messages: string[] }>;
  requestId?: string;
}
