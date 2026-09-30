import type { Metadata } from 'next';

import { ContactForm } from '@/components/contact/contact-form';
import { ChatIcon, MailIcon, MapPinIcon, PhoneIcon } from '@/components/icons';
import { FaqList } from '@/components/shared/faq-list';
import { PageIntro } from '@/components/shared/page-intro';
import { SocialLinks } from '@/components/shared/social-links';
import { Container } from '@/components/ui/container';
import { Eyebrow } from '@/components/ui/eyebrow';
import { getFaqs, getServices, getSiteSettings } from '@/lib/api/content';
import { publicApiUrl } from '@/lib/constants/env';
import type { Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { breadcrumbTrail } from '@/lib/seo/breadcrumbs';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { telUrl, whatsappUrl } from '@/lib/utils/format';

export async function generateMetadata({ params }: PageProps<'/[locale]/contact'>): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const dict = getDictionary(locale);
  return buildPageMetadata({
    locale,
    settings: await getSiteSettings(),
    path: '/contact',
    title: dict.meta.pages.contact.title,
    description: dict.meta.pages.contact.description,
  });
}

export default async function ContactPage({ params }: PageProps<'/[locale]/contact'>) {
  const locale = (await params).locale as Locale;
  const dict = getDictionary(locale);
  const [settings, services, faqs] = await Promise.all([getSiteSettings(), getServices(), getFaqs()]);

  const channels = [
    settings.email
      ? {
          icon: MailIcon,
          label: dict.contact.email,
          value: settings.email,
          href: `mailto:${settings.email}`,
          ltr: true,
        }
      : null,
    settings.whatsapp
      ? {
          icon: ChatIcon,
          label: dict.contact.whatsapp,
          value: settings.whatsapp,
          href: whatsappUrl(settings.whatsapp),
          ltr: true,
          external: true,
        }
      : null,
    settings.phone
      ? { icon: PhoneIcon, label: dict.contact.phone, value: settings.phone, href: telUrl(settings.phone), ltr: true }
      : null,
    settings.location ? { icon: MapPinIcon, label: dict.contact.location, value: settings.location } : null,
  ].filter((channel) => channel !== null);

  return (
    <>
      <PageIntro
        eyebrow={dict.contact.eyebrow}
        title={dict.contact.title}
        subtitle={dict.contact.subtitle}
        breadcrumbs={breadcrumbTrail(locale, dict, [{ name: dict.nav.contact, path: '/contact' }])}
        breadcrumbLabel={dict.common.breadcrumb}
      />
      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
          <section aria-labelledby="form-title" className="card p-6 sm:p-8">
            <h2 id="form-title" className="mb-6 text-xl font-bold">
              {dict.contact.form.title}
            </h2>
            <ContactForm
              endpoint={`${publicApiUrl}/api/v1/contact`}
              labels={dict.contact.form}
              projectTypes={services.map((service) => service.title)}
            />
          </section>

          {channels.length || settings.socialLinks.length ? (
            <aside aria-labelledby="channels-title" className="space-y-6">
              <div className="card p-6 lg:sticky lg:top-28">
                <h2 id="channels-title" className="mb-5 text-base font-bold">
                  {dict.contact.infoTitle}
                </h2>
                <ul className="space-y-4">
                  {channels.map((channel) => {
                    const Icon = channel.icon;
                    const body = (
                      <>
                        <span className="icon-tile size-11">
                          <Icon className="size-5" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-xs text-muted">{channel.label}</span>
                          <span className="block truncate font-medium text-ink" dir={channel.ltr ? 'ltr' : undefined}>
                            {channel.value}
                          </span>
                        </span>
                      </>
                    );
                    return (
                      <li key={channel.label}>
                        {channel.href ? (
                          <a
                            href={channel.href}
                            className="-m-2 flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/4"
                            {...(channel.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          >
                            {body}
                          </a>
                        ) : (
                          <div className="flex items-center gap-3">{body}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
                <SocialLinks
                  links={settings.socialLinks}
                  labels={dict.social}
                  newTabLabel={dict.common.opensInNewTab}
                  className="mt-6 border-t border-line pt-5"
                />
              </div>
            </aside>
          ) : null}
        </div>

        {faqs.length ? (
          <section aria-labelledby="faq-title" className="mx-auto mt-16 max-w-3xl">
            <div className="mb-4 flex justify-center">
              <Eyebrow>{dict.faq.eyebrow}</Eyebrow>
            </div>
            <h2 id="faq-title" className="mb-8 text-center text-2xl font-bold sm:text-3xl">
              {dict.faq.title}
            </h2>
            <FaqList faqs={faqs} />
          </section>
        ) : null}
      </Container>
    </>
  );
}
