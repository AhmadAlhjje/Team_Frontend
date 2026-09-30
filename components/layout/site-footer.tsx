import Link from 'next/link';

import { BrandMark } from '@/components/brand/brand-mark';
import { ArrowForwardIcon, ChatIcon, MailIcon, PhoneIcon } from '@/components/icons';
import { SocialLinks } from '@/components/shared/social-links';
import { ButtonLink } from '@/components/ui/button-link';
import { Container } from '@/components/ui/container';
import { footerNavigation } from '@/lib/constants/navigation';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/get-dictionary';
import { localizePath } from '@/lib/i18n/routing';
import { telUrl, whatsappUrl } from '@/lib/utils/format';
import type { Service, SiteSettings } from '@/types/api';

import { Logo } from './logo';

interface SiteFooterProps {
  locale: Locale;
  dict: Dictionary;
  settings: SiteSettings;
  services: Service[];
}

export function SiteFooter({ locale, dict, settings, services }: SiteFooterProps) {
  const year = new Date().getFullYear();
  const heading = 'mb-4 text-sm font-bold text-ink';
  const link = 'text-sm text-muted transition-colors hover:text-ink';

  return (
    <footer className="relative overflow-hidden border-t border-line/70 bg-night">
      {/* A thin brand line and a faint mark: the identity closes every page. */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-brand opacity-40" />
      <BrandMark className="pointer-events-none absolute -bottom-24 -inset-e-16 size-80 opacity-[0.04]" />

      <Container className="relative py-14 sm:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo href={localizePath('/', locale)} siteName={settings.siteName} logoUrl={settings.logoUrl} />
            {settings.tagline || settings.description ? (
              <p className="mt-4 max-w-sm text-sm leading-7 text-muted">{settings.tagline ?? settings.description}</p>
            ) : null}
            <SocialLinks
              links={settings.socialLinks}
              labels={dict.social}
              newTabLabel={dict.common.opensInNewTab}
              className="mt-6"
            />
          </div>

          <nav aria-labelledby="footer-pages">
            <h2 id="footer-pages" className={heading}>
              {dict.footer.pages}
            </h2>
            <ul className="space-y-2.5">
              {footerNavigation(dict.nav).map((item) => (
                <li key={item.href}>
                  <Link href={localizePath(item.href, locale)} className={link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {services.length ? (
            <nav aria-labelledby="footer-services">
              <h2 id="footer-services" className={heading}>
                {dict.footer.services}
              </h2>
              <ul className="space-y-2.5">
                {services.slice(0, 6).map((service) => (
                  <li key={service.slug}>
                    <Link href={`${localizePath('/services', locale)}#${service.slug}`} className={link}>
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          <div>
            <h2 className={heading}>{dict.footer.contact}</h2>
            <ul className="space-y-3 text-sm">
              {settings.email ? (
                <li>
                  <a href={`mailto:${settings.email}`} className={`${link} inline-flex items-center gap-2`}>
                    <MailIcon className="size-4 text-aqua" />
                    <span dir="ltr">{settings.email}</span>
                  </a>
                </li>
              ) : null}
              {settings.phone ? (
                <li>
                  <a href={telUrl(settings.phone)} className={`${link} inline-flex items-center gap-2`}>
                    <PhoneIcon className="size-4 text-aqua" />
                    <span dir="ltr">{settings.phone}</span>
                  </a>
                </li>
              ) : null}
              {settings.whatsapp ? (
                <li>
                  <a
                    href={whatsappUrl(settings.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${link} inline-flex items-center gap-2`}
                  >
                    <ChatIcon className="size-4 text-aqua" />
                    {dict.contact.whatsapp}
                    <span className="sr-only">{dict.common.opensInNewTab}</span>
                  </a>
                </li>
              ) : null}
            </ul>
            <p className="mt-6 text-sm font-bold text-ink">{dict.footer.ctaTitle}</p>
            <ButtonLink href={localizePath('/contact', locale)} className="mt-3">
              {dict.nav.startProject}
              <ArrowForwardIcon />
            </ButtonLink>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-line/70 pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {settings.siteName}. {dict.footer.rights}
          </p>
          {settings.location ? <p>{settings.location}</p> : null}
        </div>
      </Container>
    </footer>
  );
}
