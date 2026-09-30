import { cn } from '@/lib/utils/cn';

/** Small label above a heading. The rhombus echoes the brand mark. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-bold text-aqua sm:text-sm',
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 shrink-0 rotate-45 bg-aqua" />
      {children}
    </p>
  );
}
