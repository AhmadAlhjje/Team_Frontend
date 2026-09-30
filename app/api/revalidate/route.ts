import { revalidateTag } from 'next/cache';

import { isCacheTag } from '@/lib/constants/cache';
import { logger } from '@/lib/utils/logger';
import { isValidSecret } from '@/lib/utils/secret';

/**
 * On-demand revalidation webhook, called by the backend after content changes:
 *   POST /api/revalidate   x-revalidate-secret: <REVALIDATE_SECRET>   { "tags": ["projects"] }
 * Only known cache tags are accepted.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return Response.json({ error: 'Revalidation is not configured' }, { status: 503 });
  }

  if (!isValidSecret(request.headers.get('x-revalidate-secret'), secret)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { tags?: unknown } | null;
  const tags = Array.isArray(body?.tags) ? [...new Set(body.tags.filter(isCacheTag))] : [];
  if (tags.length === 0) {
    return Response.json({ error: 'No valid cache tags provided' }, { status: 400 });
  }

  // expire: 0 → the next visit renders fresh content instead of a stale copy.
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  logger.info('Content revalidated', { tags });

  return Response.json({ revalidated: tags, now: Date.now() });
}
