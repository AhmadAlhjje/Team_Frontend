import { cn } from '@/lib/utils/cn';

import { Container } from './container';
import { Eyebrow } from './eyebrow';

interface SectionProps {
  id?: string;
  className?: string;
  /** `band` slightly lifts the background to separate consecutive sections. */
  tone?: 'default' | 'band';
  /** Accessible name when the section has no visible heading id. */
  labelledBy?: string;
  children: React.ReactNode;
}

export function Section({ id, className, tone = 'default', labelledBy, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        'relative py-16 sm:py-20 lg:py-24',
        tone === 'band' && 'border-y border-line/60 bg-band',
        className,
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}

interface SectionHeaderProps {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string | null;
  action?: React.ReactNode;
  align?: 'start' | 'center';
  /** Use h1 for page-level headers. */
  as?: 'h1' | 'h2';
}

export function SectionHeader({
  id,
  eyebrow,
  title,
  subtitle,
  action,
  align = 'start',
  as: Heading = 'h2',
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-10 flex flex-col gap-4 sm:mb-14',
        align === 'center' ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between',
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
        <Heading
          id={id}
          className={cn(
            'font-bold',
            Heading === 'h1' ? 'text-3xl sm:text-4xl lg:text-5xl' : 'text-2xl sm:text-3xl lg:text-4xl',
          )}
        >
          {title}
        </Heading>
        {subtitle ? <p className="mt-4 text-base text-muted sm:text-lg">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
