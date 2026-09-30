import 'server-only';

import { apiRequestTimeoutMs, contentRevalidateSeconds, type CacheTag } from '@/lib/constants/cache';
import { serverApiUrl } from '@/lib/constants/env';
import { logger } from '@/lib/utils/logger';

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = 'ApiError';
  }
}

export class ApiNotFoundError extends ApiError {
  constructor(path: string) {
    super(404, `Not found: ${path}`);
    this.name = 'ApiNotFoundError';
  }
}

interface GetOptions {
  tags: CacheTag[];
  /** Extra, more specific tags (e.g. `project:wafeer`). */
  extraTags?: string[];
  revalidate?: number;
}

/** Cached GET request against the public API (`/api/v1`). Server-side only. */
export async function apiGet<T>(path: string, options: GetOptions): Promise<T> {
  const url = `${serverApiUrl}/api/v1${path}`;
  let response: Response;

  try {
    response = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: {
        revalidate: options.revalidate ?? contentRevalidateSeconds,
        tags: [...options.tags, ...(options.extraTags ?? [])],
      },
      signal: AbortSignal.timeout(apiRequestTimeoutMs),
    });
  } catch (error) {
    throw new ApiError(0, `Network error while requesting ${path}`, { cause: error });
  }

  if (response.status === 404) throw new ApiNotFoundError(path);
  if (!response.ok) throw new ApiError(response.status, `API responded ${response.status} for ${path}`);

  return (await response.json()) as T;
}

const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

/**
 * Resilience policy for content requests:
 * - During `next build`, an unreachable API must not fail the build: the page is
 *   rendered with `fallback` and regenerated at the next revalidation.
 * - At runtime the error is re-thrown, so Next.js keeps serving the last good
 *   (stale) page instead of caching a degraded one.
 */
export async function withBuildFallback<T>(request: Promise<T>, fallback: T, label: string): Promise<T> {
  try {
    return await request;
  } catch (error) {
    if (!isBuildPhase) throw error;
    logger.warn(`API unavailable during build, rendering "${label}" with fallback data`, {
      error: error instanceof Error ? error.message : String(error),
    });
    return fallback;
  }
}
