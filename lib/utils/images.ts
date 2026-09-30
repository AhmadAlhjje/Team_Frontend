/**
 * next/image only optimizes images from origins allowed in next.config.ts
 * (the API origin + NEXT_PUBLIC_IMAGE_ORIGINS). Admins may paste URLs from
 * other hosts; those are rendered unoptimized instead of breaking the page.
 * Keep this logic in sync with `remotePatterns` in next.config.ts.
 */

function parseOrigin(value: string | undefined): URL | null {
  if (!value?.trim()) return null;
  try {
    return new URL(value.trim());
  } catch {
    return null;
  }
}

/** Origins whose images are optimized by next/image. */
export function allowedImageOrigins(): URL[] {
  const origins = [parseOrigin(process.env.NEXT_PUBLIC_API_URL)];
  for (const origin of (process.env.NEXT_PUBLIC_IMAGE_ORIGINS ?? '').split(',')) origins.push(parseOrigin(origin));
  return origins.filter((origin): origin is URL => origin !== null);
}

export function isOptimizableImage(src: string, origins: URL[] = allowedImageOrigins()): boolean {
  if (src.startsWith('/') && !src.startsWith('//')) return true;
  const url = parseOrigin(src);
  return url !== null && origins.some((origin) => origin.origin === url.origin);
}
