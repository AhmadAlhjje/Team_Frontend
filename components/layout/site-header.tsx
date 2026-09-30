import { mainNavigation } from '@/lib/constants/navigation';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import { localizePath } from '@/lib/i18n/routing';
import type { SiteSettings } from '@/types/api';

import { Logo } from './logo';
import { SiteNav } from './site-nav';

export function SiteHeader({ locale, dict, settings }: { locale: Locale; dict: Dictionary; settings: SiteSettings }) {
  const items = mainNavigation(dict.nav).map((item) => ({ ...item, href: localizePath(item.href, locale) }));

  return (
    <header className="sticky top-0 z-40 border-b border-white/6 bg-canvas/80 backdrop-blur-xl supports-backdrop-filter:bg-canvas/65">
      <div className="relative mx-auto flex h-16 max-w-page items-center justify-between gap-4 px-4 sm:px-6 lg:h-18 lg:px-8">
        <Logo href={localizePath('/', locale)} siteName={settings.siteName} logoUrl={settings.logoUrl} />
        <SiteNav
          items={items}
          cta={{ href: localizePath('/contact', locale), label: dict.nav.startProject }}
          labels={{ nav: dict.nav.label, open: dict.nav.openMenu, close: dict.nav.closeMenu }}
        />
      </div>
    </header>
  );
}
