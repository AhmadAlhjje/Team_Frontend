import { BrandMark } from '@/components/brand/brand-mark';
import { CodeIcon, CpuIcon, LayersIcon, SmartphoneIcon } from '@/components/icons';
import { cn } from '@/lib/utils/cn';

/** Positions and staggered delays (pop-in, then one float) of the satellites. */
const satellites = [
  { icon: CodeIcon, position: 'top-[6%] inset-e-[16%]', delay: '[animation-delay:0.15s,0.85s]' },
  { icon: SmartphoneIcon, position: 'top-[24%] inset-s-[2%]', delay: '[animation-delay:0.3s,1s]' },
  { icon: CpuIcon, position: 'bottom-[14%] inset-s-[14%]', delay: '[animation-delay:0.45s,1.15s]' },
  { icon: LayersIcon, position: 'bottom-[26%] inset-e-[2%]', delay: '[animation-delay:0.6s,1.3s]' },
];

/**
 * The brand mark as a hero illustration: the block at the center of its orbit,
 * surrounded by what the team builds (web, mobile, AI, systems). The entrance
 * motion settles within five seconds. Decorative only, pure CSS, no images.
 */
export function HeroArt({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('relative mx-auto aspect-square w-full max-w-md', className)}>
      <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(closest-side,rgb(59_130_246/0.38),rgb(99_102_241/0.12)_60%,transparent)]" />
      <div className="absolute inset-[4%] rounded-full border border-dashed border-line-strong/80 motion-safe:animate-orbit" />
      <div className="absolute inset-[20%] rounded-full border border-line" />
      <div className="absolute inset-[34%] rounded-full border border-primary/20 bg-primary/5" />

      <div className="absolute inset-[27%] motion-safe:animate-float">
        <BrandMark className="size-full drop-shadow-[0_24px_40px_rgb(34_211_238/0.3)]" />
      </div>

      {satellites.map(({ icon: Icon, position, delay }) => (
        <div
          key={position}
          className={cn(
            'absolute flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-surface/80 text-aqua shadow-[0_18px_40px_-18px_rgb(34_211_238/0.5)] backdrop-blur-md motion-safe:animate-satellite',
            position,
            delay,
          )}
        >
          <Icon className="size-6" />
        </div>
      ))}
    </div>
  );
}
