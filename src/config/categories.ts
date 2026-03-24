/**
 * Single source of truth for blog categories.
 *
 * To add a new category:
 *   1. Add an entry here with name, color, description, and card styles.
 *   2. Set `showOnHomepage: true` to display it in the homepage CategoriesSection.
 *   3. Write posts with `category: "Your Category"` in frontmatter — filters auto-update.
 *
 * Categories not in this config still work as filters on /blog and /series,
 * but will render with a fallback color and won't appear on the homepage.
 */

export interface CategoryConfig {
  /** Exact string used in post frontmatter */
  name: string;
  /** Tailwind classes for badge/pill (border + text color) */
  color: string;
  /** Short description shown on the homepage category card */
  description: string;
  /** Homepage card border style */
  border: string;
  borderHover: string;
  /** Accent text color for article count label on homepage card */
  accent: string;
  /** Set to true to show this category card on the homepage */
  showOnHomepage: boolean;
}

export const CATEGORY_CONFIG: CategoryConfig[] = [
  {
    name: 'Architecture',
    color: 'text-blue-400 border-blue-800',
    description: 'System design, distributed systems, and the decisions that define your platform.',
    border: 'border-line-strong',
    borderHover: 'hover:border-fg-muted',
    accent: 'text-fg',
    showOnHomepage: true,
  },
  {
    name: 'Deep Dive',
    color: 'text-purple-400 border-purple-800',
    description: 'Implementation details, internals, and the "how it actually works" explanations.',
    border: 'border-line-strong',
    borderHover: 'hover:border-fg-muted',
    accent: 'text-fg-default',
    showOnHomepage: true,
  },
  {
    name: 'Engineering',
    color: 'text-green-400 border-green-800',
    description: 'Process, tooling, team dynamics, and building software at scale.',
    border: 'border-line-strong',
    borderHover: 'hover:border-fg-muted',
    accent: 'text-fg-muted',
    showOnHomepage: true,
  },
  {
    name: 'AI & Automation',
    color: 'text-orange-400 border-orange-800',
    description:
      'AI-powered tooling, autonomous workflows, and intelligent automation for engineering.',
    border: 'border-line-strong',
    borderHover: 'hover:border-fg-muted',
    accent: 'text-fg-muted',
    showOnHomepage: true,
  },
  {
    name: 'JavaScript',
    color: 'text-yellow-400 border-yellow-800',
    description: 'Deep dives into JavaScript internals, async patterns, and the ecosystem.',
    border: 'border-line-strong',
    borderHover: 'hover:border-fg-muted',
    accent: 'text-fg-muted',
    showOnHomepage: false,
  },
];

/**
 * Lookup map: category name → Tailwind color classes.
 * Used by badge/pill components for fast access.
 */
export const CATEGORY_COLOR_MAP: Record<string, string> = Object.fromEntries(
  CATEGORY_CONFIG.map((c) => [c.name, c.color]),
);

/**
 * Categories shown on the homepage CategoriesSection.
 * Toggle visibility by setting `showOnHomepage` in CATEGORY_CONFIG above.
 */
export const HOMEPAGE_CATEGORIES = CATEGORY_CONFIG.filter((c) => c.showOnHomepage);

/**
 * Ordered list of known category names (mirrors CATEGORY_CONFIG order).
 * Used to sort filter tabs: known categories first, unknown ones appended alphabetically.
 */
export const KNOWN_CATEGORY_NAMES = CATEGORY_CONFIG.map((c) => c.name);

/**
 * Given a list of category strings found in actual content, returns them sorted:
 * known categories (in CATEGORY_CONFIG order) first, unknown ones alphabetically after.
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
 * Must be the single source of truth — used by both the endpoint generator
 * (build time) and the PostsGrid fetch calls (runtime).
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
