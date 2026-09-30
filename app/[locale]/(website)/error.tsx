'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

import { buttonClasses } from '@/components/ui/button-link';
import { defaultLocale, isEnabledLocale } from '@/lib/i18n/config';
import { errorMessages } from '@/lib/i18n/error-messages';
import { localizePath } from '@/lib/i18n/routing';

export default function WebsiteError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const params = useParams<{ locale: string }>();
  const locale = isEnabledLocale(params.locale) ? params.locale : defaultLocale;
  const text = errorMessages[locale];

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="mx-auto flex min-h-[60vh] max-w-page flex-col items-center justify-center px-4 py-20 text-center"
    >
      <span aria-hidden="true" className="mb-6 icon-tile size-14 text-2xl font-bold">
        !
      </span>
      <h1 className="text-2xl font-bold sm:text-3xl">{text.title}</h1>
      <p className="mt-3 max-w-md text-muted">{text.body}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={retry} className={buttonClasses('primary')}>
          {text.retry}
        </button>
        <Link href={localizePath('/', locale)} className={buttonClasses('secondary')}>
          {text.home}
        </Link>
      </div>
    </div>
  );
}
