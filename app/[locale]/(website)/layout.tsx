import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { SkipLink } from '@/components/layout/skip-link';
import { getServices, getSiteSettings } from '@/lib/api/content';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';

export default async function WebsiteLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const locale = (await params).locale as Locale;
  const dict = getDictionary(locale);
  const [settings, services] = await Promise.all([getSiteSettings(), getServices()]);

  return (
    <>
      <SkipLink label={dict.nav.skipToContent} />
      <SiteHeader locale={locale} dict={dict} settings={settings} />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <SiteFooter locale={locale} dict={dict} settings={settings} services={services} />
    </>
  );
}
