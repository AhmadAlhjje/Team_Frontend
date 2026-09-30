import type { NextConfig } from 'next';

const isProduction = process.env.NODE_ENV === 'production';

function parseUrl(value: string | undefined): URL | null {
  try {
    return value?.trim() ? new URL(value.trim()) : null;
  } catch {
    return null;
  }
}

const apiUrl = parseUrl(process.env.NEXT_PUBLIC_API_URL);
const extraImageOrigins = (process.env.NEXT_PUBLIC_IMAGE_ORIGINS ?? '')
  .split(',')
  .map(parseUrl)
  .filter((url): url is URL => url !== null);

/** Images optimized by next/image (keep in sync with lib/utils/images.ts). */
const remotePatterns = [
  ...(apiUrl ? [{ url: apiUrl, pathname: '/uploads/**' }] : []),
  ...extraImageOrigins.map((url) => ({ url, pathname: '/**' })),
].map(({ url, pathname }) => ({
  protocol: url.protocol.replace(':', '') as 'http' | 'https',
  hostname: url.hostname,
  port: url.port,
  pathname,
}));

const origins = [apiUrl, ...extraImageOrigins].filter((url): url is URL => url !== null).map((url) => url.origin);

/**
 * Static CSP (no nonces, so pages stay statically rendered and cacheable).
 * Inline scripts are required by Next.js bootstrapping; external scripts are
 * not allowed, and the page cannot be framed.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProduction ? '' : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https:${origins.length ? ` ${origins.join(' ')}` : ''}`,
  "font-src 'self'",
  `connect-src 'self'${apiUrl ? ` ${apiUrl.origin}` : ''}`,
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  ...(isProduction ? ['upgrade-insecure-requests'] : []),
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  ...(isProduction
    ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]
    : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // Tailwind output is small (~8 KB gzipped): inlining it removes a render-blocking
    // request for first-time visitors — most of this site's audience. See docs/performance.md.
    inlineCss: true,
  },
  images: {
    remotePatterns,
    formats: ['image/avif', 'image/webp'],
    // Uploads are immutable (unique file names), so optimized variants can be cached long.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Allows optimizing images served from localhost / private networks.
    // Needed in development; in production only enable it for a private network (SSRF risk).
    dangerouslyAllowLocalIP: !isProduction || process.env.IMAGES_ALLOW_LOCAL_IP === 'true',
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
