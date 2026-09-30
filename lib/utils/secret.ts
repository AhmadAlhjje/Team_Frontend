import 'server-only';

import { timingSafeEqual } from 'node:crypto';

/** Constant-time comparison of a provided secret with the expected one. */
export function isValidSecret(provided: string | null, expected: string): boolean {
  if (!provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
