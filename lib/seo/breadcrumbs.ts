import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import { localizePath } from '@/lib/i18n/routing';

import type { BreadcrumbItem } from './json-ld';

/** Home → …trail, with localized hrefs. */
export function breadcrumbTrail(
  locale: Locale,
  dict: Dictionary,
  trail: Array<{ name: string; path: string }>,
): BreadcrumbItem[] {
  return [
    { name: dict.common.home, href: localizePath('/', locale) },
    ...trail.map((item) => ({ name: item.name, href: localizePath(item.path, locale) })),
  ];
}
