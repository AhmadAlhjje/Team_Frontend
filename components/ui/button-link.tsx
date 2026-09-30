import Link from 'next/link';

import { cn } from '@/lib/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

const variants: Record<Variant, string> = {
  // Bright brand gradient with dark text (contrast ≥ 7:1 on every stop).
  primary:
    'bg-brand text-on-brand shadow-[0_10px_30px_-10px_rgb(34_211_238/0.55)] hover:shadow-[0_14px_38px_-10px_rgb(96_165_250/0.7)] hover:brightness-110',
  secondary: 'border border-line-strong bg-white/4 text-ink hover:border-primary-bright/50 hover:bg-white/8',
  ghost: 'text-body hover:bg-white/5 hover:text-ink',
};

const sizes: Record<Size, string> = {
  md: 'h-10 px-5 text-sm',
  lg: 'h-12 px-7 text-base',
};

export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', className?: string) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-bold whitespace-nowrap transition duration-200 active:scale-[0.98]',
    variants[variant],
    sizes[size],
    className,
  );
}

interface ButtonLinkProps extends Omit<React.ComponentProps<typeof Link>, 'className'> {
  variant?: Variant;
  size?: Size;
  className?: string;
}

/** A link styled as a button (navigation, never an action). */
export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, size, className)} {...props} />;
}
