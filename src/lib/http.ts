/**
 * Cache-Control headers for content-addressed static assets.
 * Safe to cache at the edge indefinitely — URLs include a content hash or
 * are generated at build time from immutable source data.
 */
export const IMMUTABLE_CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=31536000, immutable',
} as const;
