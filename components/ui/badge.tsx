import { cn } from '@/lib/utils/cn';

type Tone = 'neutral' | 'primary' | 'success' | 'warning' | 'glass' | 'brand';

const tones: Record<Tone, string> = {
  neutral: 'bg-white/6 text-body ring-white/10',
  primary: 'bg-primary/15 text-primary-bright ring-primary/25',
  success: 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/25',
  warning: 'bg-amber-400/10 text-amber-300 ring-amber-400/25',
  // On top of images and covers.
  glass: 'bg-night/75 text-ink ring-white/10 backdrop-blur-md',
  brand: 'bg-brand text-on-brand ring-transparent',
};

export function Badge({
  tone = 'neutral',
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Technology / skill chips. Latin names keep their own direction. */
export function TagList({ items, max, className }: { items: string[]; max?: number; className?: string }) {
  if (items.length === 0) return null;
  const visible = max ? items.slice(0, max) : items;
  const hidden = items.length - visible.length;

  return (
    <ul className={cn('flex flex-wrap gap-1.5', className)}>
      {visible.map((item) => (
        <li
          key={item}
          className="rounded-full border border-line bg-white/3 px-2.5 py-0.5 text-xs text-body"
          dir="auto"
        >
          {item}
        </li>
      ))}
      {hidden > 0 ? <li className="px-1.5 py-0.5 text-xs text-muted">+{hidden}</li> : null}
    </ul>
  );
}
