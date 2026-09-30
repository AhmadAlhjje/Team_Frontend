'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useState } from 'react';

import { CloseIcon, MenuIcon } from '@/components/icons';
import { buttonClasses } from '@/components/ui/button-link';
import { cn } from '@/lib/utils/cn';

interface SiteNavProps {
  items: Array<{ href: string; label: string }>;
  cta: { href: string; label: string };
  labels: { nav: string; open: string; close: string };
}

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * The only interactive part of the header: active link state and the mobile
 * menu. Everything else in the header is server-rendered.
 */
export function SiteNav({ items, cta, labels }: SiteNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);
  const panelId = useId();

  // Close the menu after navigating.
  if (open && openedAt !== pathname) setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const links = (mobile: boolean) =>
    items.map((item) => {
      const active = isActive(pathname, item.href);
      return (
        <li key={item.href}>
          <Link
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'relative block font-medium transition-colors duration-200',
              mobile ? 'rounded-xl px-4 py-3 text-base' : 'rounded-full px-3.5 py-2 text-sm',
              active ? 'text-ink' : 'text-muted hover:text-ink',
              mobile && (active ? 'bg-white/6' : 'hover:bg-white/4'),
              // Desktop: a short brand bar under the current page.
              !mobile &&
                active &&
                'after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-brand',
              !mobile && !active && 'hover:bg-white/5',
            )}
          >
            {item.label}
          </Link>
        </li>
      );
    });

  return (
    <>
      <nav aria-label={labels.nav} className="hidden md:block">
        <ul className="flex items-center gap-0.5">{links(false)}</ul>
      </nav>

      <div className="flex items-center gap-2">
        <div className="hidden sm:block">
          <Link href={cta.href} className={buttonClasses('primary', 'md')}>
            {cta.label}
          </Link>
        </div>
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-white/4 text-ink transition-colors hover:bg-white/8 md:hidden"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? labels.close : labels.open}
          onClick={() => {
            setOpenedAt(pathname);
            setOpen((value) => !value);
          }}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* `invisible` (visibility: hidden) keeps the closed menu out of the tab order and the accessibility tree. */}
      <div
        id={panelId}
        className={cn(
          'absolute inset-x-0 top-full border-b border-line bg-canvas/95 shadow-2xl shadow-black/50 backdrop-blur-xl transition-[opacity,transform,visibility] duration-200 ease-out md:hidden',
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0',
        )}
      >
        <nav aria-label={labels.nav} className="mx-auto max-w-page px-4 py-4">
          <ul className="space-y-1">{links(true)}</ul>
          <Link href={cta.href} className={buttonClasses('primary', 'lg', 'mt-4 mb-1 w-full')}>
            {cta.label}
          </Link>
        </nav>
      </div>
    </>
  );
}
