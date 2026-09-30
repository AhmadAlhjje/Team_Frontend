'use client';

import { defaultLocale, localeDefinitions } from '@/lib/i18n/config';
import { errorMessages } from '@/lib/i18n/error-messages';

/** Last-resort boundary when the root layout fails. Must render its own <html>. */
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const text = errorMessages[defaultLocale];

  return (
    <html lang={defaultLocale} dir={localeDefinitions[defaultLocale].dir}>
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          fontFamily: 'system-ui, sans-serif',
          background: '#070b14',
          color: '#c2cce0',
          colorScheme: 'dark',
        }}
      >
        <main style={{ textAlign: 'center', padding: '1rem' }}>
          <h1 style={{ color: '#f3f6fc', fontSize: '1.5rem' }}>{text.title}</h1>
          <p>{text.body}</p>
          <button
            type="button"
            onClick={retry}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              border: 0,
              borderRadius: 999,
              background: 'linear-gradient(120deg, #67e8f9, #60a5fa 48%, #818cf8)',
              color: '#04101f',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {text.retry}
          </button>
        </main>
      </body>
    </html>
  );
}
