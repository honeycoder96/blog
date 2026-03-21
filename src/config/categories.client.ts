/**
 * Client-facing category utilities — only what React components need at runtime.
 * Import from here in client components to avoid bundling the full CATEGORY_CONFIG
 * (descriptions, border hover classes, showOnHomepage flags, etc.) into the JS bundle.
 */

/** Lookup map: category name → Tailwind color classes for badge/pill rendering. */
export const CATEGORY_COLOR_MAP: Record<string, string> = {
  Architecture: 'text-blue-400 border-blue-800',
  'Deep Dive': 'text-purple-400 border-purple-800',
  Engineering: 'text-green-400 border-green-800',
  'AI & Automation': 'text-orange-400 border-orange-800',
  JavaScript: 'text-yellow-400 border-yellow-800',
};

/** Ordered list of known category names — used to sort filter tabs. */
export const KNOWN_CATEGORY_NAMES = [
  'Architecture',
  'Deep Dive',
  'Engineering',
  'AI & Automation',
  'JavaScript',
];

/**
 * Given a list of category strings found in actual content, returns them sorted:
 * known categories (in config order) first, unknown ones alphabetically after.
 * Prepends 'All' for use as filter tab list.
 */
export function buildFilterCategories(categoriesInContent: string[]): string[] {
  const unique = [...new Set(categoriesInContent)];
  const known = KNOWN_CATEGORY_NAMES.filter((n) => unique.includes(n));
  const unknown = unique.filter((n) => !KNOWN_CATEGORY_NAMES.includes(n)).sort();
  return ['All', ...known, ...unknown];
}

/**
 * Converts a category name to a URL-safe slug used in static JSON API paths.
 * Must match the slug generated at build time by the JSON endpoint generator.
 *
 * Examples:
 *   "All"             → "all"
 *   "Deep Dive"       → "deep-dive"
 *   "AI & Automation" → "ai-and-automation"
 */
export function slugifyCategory(category: string): string {
  return category
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
