import 'server-only';

import type { Locale } from './config';
import { ar, type Dictionary } from './dictionaries/ar';
import { en } from './dictionaries/en';

const dictionaries: Record<Locale, Dictionary> = { ar, en };

/**
 * Server-only accessor. Client components receive the strings they need as
 * props, so dictionaries never end up in the browser bundle.
 */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
