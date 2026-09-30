import type { Dictionary } from '@/lib/i18n/get-dictionary';

export interface NavLink {
  href: string;
  label: string;
}

/** Main header navigation (paths without locale prefix). */
export function mainNavigation(nav: Dictionary['nav']): NavLink[] {
  return [
    { href: '/about', label: nav.about },
    { href: '/services', label: nav.services },
    { href: '/projects', label: nav.projects },
    { href: '/team', label: nav.team },
    { href: '/contact', label: nav.contact },
  ];
}

/** Footer "pages" column. */
export function footerNavigation(nav: Dictionary['nav']): NavLink[] {
  return [
    { href: '/', label: nav.home },
    { href: '/about', label: nav.about },
    { href: '/projects', label: nav.projects },
    { href: '/team', label: nav.team },
    { href: '/achievements', label: nav.achievements },
    { href: '/contact', label: nav.contact },
  ];
}
