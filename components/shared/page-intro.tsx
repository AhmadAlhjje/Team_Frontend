import { Container } from '@/components/ui/container';
import { Eyebrow } from '@/components/ui/eyebrow';
import type { BreadcrumbItem } from '@/lib/seo/json-ld';

import { Breadcrumbs } from './breadcrumbs';

interface PageIntroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string | null;
  breadcrumbs: BreadcrumbItem[];
  breadcrumbLabel: string;
  children?: React.ReactNode;
}

/** Top block of inner pages: breadcrumbs + the page's single h1. */
export function PageIntro({ eyebrow, title, subtitle, breadcrumbs, breadcrumbLabel, children }: PageIntroProps) {
  return (
    <header className="relative isolate overflow-hidden border-b border-line/60">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-80 bg-aurora" />
        <div className="absolute inset-0 bg-grid" />
      </div>
      <Container className="py-12 sm:py-16 lg:py-20">
        <Breadcrumbs items={breadcrumbs} label={breadcrumbLabel} />
        {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
        <h1 className="max-w-3xl text-3xl font-bold sm:text-4xl lg:text-5xl">{title}</h1>
        {subtitle ? (
          <p className="mt-5 max-w-2xl text-base leading-8 text-body sm:text-lg sm:leading-9">{subtitle}</p>
        ) : null}
        {children}
      </Container>
    </header>
  );
}
