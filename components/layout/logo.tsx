import Link from 'next/link';

import { BrandMark } from '@/components/brand/brand-mark';
import { SmartImage } from '@/components/shared/smart-image';
import { cn } from '@/lib/utils/cn';

interface LogoProps {
  href: string;
  siteName: string;
  /** Uploaded logo from Admin; the brand mark is used when empty. */
  logoUrl: string | null;
  className?: string;
}

export function Logo({ href, siteName, logoUrl, className }: LogoProps) {
  return (
    <Link href={href} className={cn('group flex shrink-0 items-center gap-2.5', className)}>
      {logoUrl ? (
        <SmartImage
          src={logoUrl}
          alt=""
          width={36}
          height={36}
          className="size-9 rounded-lg object-contain"
          loading="eager"
        />
      ) : (
        <BrandMark className="size-9 transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:scale-105" />
      )}
      <span className="text-lg font-bold tracking-tight text-ink">{siteName}</span>
    </Link>
  );
}
