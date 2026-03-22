/** Maximum heading depth shown in the table of contents. */
export const MAX_TOC_DEPTH = 2;

/** Smoothly scrolls the page to the heading element with the given slug. */
export function scrollToHeading(slug: string): void {
  document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth' });
}
