import type { MetadataRoute } from 'next';

import { allowIndexing, siteUrl } from '@/lib/constants/env';

export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) {
    // Staging / preview deployments must never be indexed.
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/admin'] },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
