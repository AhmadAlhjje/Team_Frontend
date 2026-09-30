import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import { localizePath } from '@/lib/i18n/routing';
import type { ProjectSummary } from '@/types/api';

import { ProjectCard } from './project-card';

export function ProjectGrid({
  projects,
  locale,
  labels,
  headingLevel,
}: {
  projects: ProjectSummary[];
  locale: Locale;
  labels: Dictionary['projects'];
  headingLevel?: 'h2' | 'h3';
}) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <li key={project.slug} className="reveal flex">
          <ProjectCard
            project={project}
            href={localizePath(`/projects/${project.slug}`, locale)}
            labels={labels}
            headingLevel={headingLevel}
          />
        </li>
      ))}
    </ul>
  );
}
