/**
 * Returns true if the user has requested reduced motion via the OS/browser
 * accessibility setting. Safe to call during SSR (returns false server-side).
 */
export function usePrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
