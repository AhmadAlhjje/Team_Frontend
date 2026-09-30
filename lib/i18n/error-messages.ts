import type { Locale } from './config';

/**
 * Minimal strings for error boundaries. Error boundaries are client components
 * that cannot receive props from the server, so they import this small map
 * instead of the full dictionary.
 */
export const errorMessages: Record<Locale, { title: string; body: string; retry: string; home: string }> = {
  ar: {
    title: 'حدث خطأ غير متوقع',
    body: 'نعتذر، حدثت مشكلة أثناء تحميل الصفحة. حاول مرة أخرى بعد لحظات.',
    retry: 'حاول مجدداً',
    home: 'العودة إلى الرئيسية',
  },
  en: {
    title: 'Something went wrong',
    body: 'Sorry, there was a problem loading this page. Please try again in a moment.',
    retry: 'Try again',
    home: 'Back to home',
  },
};
