import { locale as rootLocale } from 'next/root-params';

import { BrandMark } from '@/components/brand/brand-mark';
import { ButtonLink } from '@/components/ui/button-link';
import { Container } from '@/components/ui/container';
import { defaultLocale, isEnabledLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { localizePath } from '@/lib/i18n/routing';

export default async function NotFound() {
  const value = await rootLocale();
  const locale = isEnabledLocale(value) ? value : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <div className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-aurora" />
        <div className="absolute inset-0 bg-grid" />
      </div>
      <Container className="flex min-h-[65vh] flex-col items-center justify-center py-20 text-center">
        <BrandMark className="mb-6 size-16 motion-safe:animate-float" />
        <p className="text-gradient text-6xl font-bold tabular-nums sm:text-7xl">404</p>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{dict.notFound.title}</h1>
        <p className="mt-3 max-w-md text-muted">{dict.notFound.body}</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={localizePath('/', locale)}>{dict.notFound.home}</ButtonLink>
          <ButtonLink href={localizePath('/projects', locale)} variant="secondary">
            {dict.notFound.projects}
          </ButtonLink>
        </div>
      </Container>
    </div>
  );
}
