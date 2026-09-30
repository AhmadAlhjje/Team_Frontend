import { Container } from '@/components/ui/container';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import { cn } from '@/lib/utils/cn';
import { formatNumber } from '@/lib/utils/format';
import type { SiteStats } from '@/types/api';

/**
 * Trust numbers computed by the backend from published data. A number is only
 * shown when it is real and greater than zero — nothing is ever made up.
 */
export function buildStats(stats: SiteStats, labels: Dictionary['stats']) {
  return [
    { value: stats.projects, label: labels.projects },
    { value: stats.liveProjects, label: labels.liveProjects },
    { value: stats.teamMembers, label: labels.teamMembers },
    { value: stats.clients, label: labels.clients },
    { value: stats.achievements, label: labels.achievements },
    { value: stats.yearsOfExperience ?? 0, label: labels.years },
  ]
    .filter((item) => item.value > 0)
    .slice(0, 4);
}

export function StatsStrip({
  stats,
  labels,
  locale,
  overlap = false,
}: {
  stats: SiteStats;
  labels: Dictionary['stats'];
  locale: Locale;
  /** Pulls the panel up over the bottom edge of the hero. */
  overlap?: boolean;
}) {
  const items = buildStats(stats, labels);
  if (items.length === 0) return null;

  return (
    <section aria-label={labels.label} className={cn('relative z-10', overlap ? '-mt-12 sm:-mt-16' : 'pt-10 sm:pt-12')}>
      <Container>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line shadow-[0_30px_80px_-40px_rgb(0_0_0/0.8)] sm:flex">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex flex-1 flex-col items-center gap-1 bg-surface/95 px-4 py-6 text-center backdrop-blur sm:py-8"
            >
              <dt className="order-2 text-sm text-muted">{item.label}</dt>
              {/* The short brand bar is a pseudo-element: only dt/dd may sit inside a <dl> group. */}
              <dd className="order-1 text-3xl font-bold text-ink tabular-nums after:mx-auto after:mt-2 after:block after:h-0.5 after:w-6 after:rounded-full after:bg-brand sm:text-4xl">
                {formatNumber(item.value, locale)}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
