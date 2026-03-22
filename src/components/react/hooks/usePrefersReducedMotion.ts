/**
 * Returns true if the user has requested reduced motion via the OS/browser
 * accessibility setting. Safe to call during SSR (returns false server-side).
 */
import { PREFERS_REDUCED_MOTION_QUERY } from '../../../config/theme';

export function usePrefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(PREFERS_REDUCED_MOTION_QUERY).matches;
}
