import { ExternalIcon } from '@/components/icons';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import { cn } from '@/lib/utils/cn';
import type { SocialLink } from '@/types/api';

interface SocialLinksProps {
  links: SocialLink[];
  labels: Dictionary['social'];
  newTabLabel: string;
  /** Accessible name prefix, e.g. the member name. */
  owner?: string;
  className?: string;
}

/** Text chips instead of brand logos: clear, accessible and trademark-safe. */
export function SocialLinks({ links, labels, newTabLabel, owner, className }: SocialLinksProps) {
  if (links.length === 0) return null;

  return (
    <ul className={cn('flex flex-wrap gap-2', className)}>
      {links.map((link) => {
        const name = link.label ?? labels[link.platform];
        return (
          <li key={`${link.platform}-${link.url}`}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer me"
              className="inline-flex items-center gap-1 rounded-full border border-line bg-white/3 px-3 py-1 text-xs font-medium text-body transition-colors hover:border-primary-bright/50 hover:text-ink"
            >
              <span dir="auto">{name}</span>
              <ExternalIcon />
              <span className="sr-only">
                {owner ? `— ${owner} ` : ''}
                {newTabLabel}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
