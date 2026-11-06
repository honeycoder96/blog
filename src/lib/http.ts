/**
 * Cache-Control headers for content-addressed static assets.
 * Safe to cache at the edge indefinitely — URLs include a content hash or
 * are generated at build time from immutable source data.
 */
export const IMMUTABLE_CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=31536000, immutable',
} as const;

/**
 * Cache-Control headers for paginated JSON API endpoints (posts, series).
 * These URLs are stable but their content changes when new posts or series are
 * added between builds, so they must not be marked immutable.
 * stale-while-revalidate keeps the response fast while fetching a fresh copy
 * in the background so the next request is always up-to-date.
 */
export const API_CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=0, stale-while-revalidate=86400',
} as const;
