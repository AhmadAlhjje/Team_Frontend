import { BrandMark } from '@/components/brand/brand-mark';
import { SmartImage } from '@/components/shared/smart-image';
import { cn } from '@/lib/utils/cn';

interface ProjectCoverProps {
  src: string | null;
  title: string;
  sizes: string;
  alt?: string;
  preload?: boolean;
  className?: string;
}

/** Brand-colored backdrops for projects without a cover image. */
const PALETTES = [
  'from-[#0b2a6b] via-[#1d4ed8] to-[#0e7490]',
  'from-[#1e1b4b] via-[#4338ca] to-[#1d4ed8]',
  'from-[#082f49] via-[#0369a1] to-[#0891b2]',
  'from-[#172554] via-[#3730a3] to-[#6d28d9]',
];

/** Skeleton "lines" of the illustrated product window, as width classes. */
const LINE_SETS = [
  ['w-3/4', 'w-1/2', 'w-2/3', 'w-2/5'],
  ['w-2/3', 'w-5/6', 'w-1/3', 'w-1/2'],
  ['w-1/2', 'w-3/4', 'w-3/5', 'w-1/4'],
];

function hash(text: string): number {
  let value = 0;
  for (const character of text) value = (value * 31 + (character.codePointAt(0) ?? 0)) | 0;
  return Math.abs(value);
}

/**
 * Cover image, or — when none was uploaded — a generated illustration in the
 * brand colors: a product window on a gradient. The palette and the lines are
 * derived from the title, so every project looks different but stays stable.
 */
export function ProjectCover({ src, title, sizes, alt = '', preload = false, className }: ProjectCoverProps) {
  if (src) {
    return (
      <SmartImage src={src} alt={alt} fill sizes={sizes} preload={preload} className={className ?? 'object-cover'} />
    );
  }

  const seed = hash(title);
  const palette = PALETTES[seed % PALETTES.length];
  const lines = LINE_SETS[seed % LINE_SETS.length];

  return (
    <div aria-hidden="true" className={cn('absolute inset-0 overflow-hidden bg-linear-to-br', palette)}>
      <div className="absolute inset-0 bg-grid-fine" />
      <BrandMark className="absolute -bottom-8 -inset-e-8 size-36 opacity-25" />
      <div className="absolute inset-x-[14%] top-[20%] -bottom-2 rounded-t-xl border border-white/15 bg-night/60 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.6)] transition-transform duration-500 ease-out group-hover:-translate-y-1.5">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2.5">
          <span className="size-2 rounded-full bg-white/25" />
          <span className="size-2 rounded-full bg-white/25" />
          <span className="size-2 rounded-full bg-aqua/80" />
        </div>
        <div className="space-y-2.5 p-4">
          <div className="h-2.5 w-2/5 rounded-full bg-brand opacity-90" />
          {lines.map((width, index) => (
            <div key={index} className={cn('h-2 rounded-full bg-white/15', width)} />
          ))}
        </div>
      </div>
    </div>
  );
}
