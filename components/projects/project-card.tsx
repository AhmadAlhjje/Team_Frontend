import Link from 'next/link';

import { ArrowForwardIcon, StarIcon } from '@/components/icons';
import { Badge, TagList } from '@/components/ui/badge';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import type { ProjectSummary } from '@/types/api';

import { ProjectCover } from './project-cover';

interface ProjectCardProps {
  project: ProjectSummary;
  href: string;
  labels: Dictionary['projects'];
  headingLevel?: 'h2' | 'h3';
}

const PHASE_DOTS = { LIVE: 'bg-emerald-400', IN_PROGRESS: 'bg-amber-400', COMPLETED: null } as const;

export function ProjectCard({ project, href, labels, headingLevel: Heading = 'h3' }: ProjectCardProps) {
  const phaseDot = PHASE_DOTS[project.phase];

  return (
    <article className="group relative flex card-interactive flex-col overflow-hidden card">
      <div className="relative aspect-16/10 overflow-hidden border-b border-line bg-raised">
        <ProjectCover
          src={project.coverImageUrl}
          title={project.title}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-s-3 top-3 flex flex-wrap gap-1.5">
          {project.isFeatured ? (
            <Badge tone="brand">
              <StarIcon className="size-3" />
              {labels.featured}
            </Badge>
          ) : null}
          {phaseDot ? (
            <Badge tone="glass">
              <span aria-hidden="true" className={`size-1.5 rounded-full ${phaseDot}`} />
              {labels.phases[project.phase]}
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {project.category ? <p className="mb-2 text-xs font-bold text-aqua">{project.category}</p> : null}
        <Heading className="text-lg font-bold transition-colors group-hover:text-aqua">
          {/* Stretched link: the whole card is clickable, the accessible name stays the title. */}
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {project.title}
          </Link>
        </Heading>
        <p className="mt-2 line-clamp-3 text-sm leading-7 text-muted">{project.summary}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <TagList items={project.technologies.map((technology) => technology.name)} max={4} />
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-muted transition duration-300 group-hover:border-transparent group-hover:bg-brand group-hover:text-on-brand"
          >
            <ArrowForwardIcon />
          </span>
        </div>
      </div>
      {/* Visible focus ring for the stretched link. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl ring-aqua group-has-[a:focus-visible]:ring-2"
      />
    </article>
  );
}
