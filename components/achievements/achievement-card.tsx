import Link from 'next/link';

import { AwardIcon, ExternalIcon, FlagIcon, TrophyIcon } from '@/components/icons';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import { localizePath } from '@/lib/i18n/routing';
import { formatMonthYear } from '@/lib/utils/format';
import type { Achievement } from '@/types/api';

const TYPE_ICONS = {
  COMPETITION: TrophyIcon,
  AWARD: AwardIcon,
  CERTIFICATION: AwardIcon,
  MILESTONE: FlagIcon,
  OTHER: TrophyIcon,
} as const;

export function AchievementCard({
  achievement,
  locale,
  dict,
  headingLevel: Heading = 'h3',
}: {
  achievement: Achievement;
  locale: Locale;
  dict: Dictionary;
  headingLevel?: 'h2' | 'h3';
}) {
  const Icon = TYPE_ICONS[achievement.type];

  return (
    <article className="reveal relative flex gap-4 overflow-hidden card p-5 sm:p-6">
      {/* Brand accent along the leading edge. */}
      <span aria-hidden="true" className="absolute inset-y-0 inset-s-0 w-0.5 bg-brand opacity-60" />
      <span className="icon-tile size-12">
        <Icon className="size-6" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span className="font-bold text-aqua">{dict.achievements.types[achievement.type]}</span>
          {achievement.date ? (
            <time dateTime={achievement.date}>{formatMonthYear(achievement.date, locale)}</time>
          ) : null}
          {achievement.issuer ? <span>{achievement.issuer}</span> : null}
        </div>
        <Heading className="mt-1.5 text-lg font-bold">{achievement.title}</Heading>
        {achievement.highlight ? (
          <p className="mt-2 inline-flex rounded-full bg-amber-400/10 px-3 py-0.5 text-sm font-bold text-amber-300 ring-1 ring-amber-400/25 ring-inset">
            {achievement.highlight}
          </p>
        ) : null}
        {achievement.description ? (
          <p className="mt-3 text-sm leading-7 whitespace-pre-line text-muted">{achievement.description}</p>
        ) : null}
        {achievement.project || achievement.proofUrl ? (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {achievement.project ? (
              <Link
                href={localizePath(`/projects/${achievement.project.slug}`, locale)}
                className="text-primary-bright transition-colors hover:text-aqua hover:underline"
              >
                {dict.achievements.relatedProject}: {achievement.project.title}
              </Link>
            ) : null}
            {achievement.proofUrl ? (
              <a
                href={achievement.proofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-body transition-colors hover:text-ink"
              >
                {dict.achievements.proof}
                <ExternalIcon />
                <span className="sr-only">{dict.common.opensInNewTab}</span>
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}
