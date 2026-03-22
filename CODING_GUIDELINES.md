# Coding Guidelines

These guidelines apply to all code in this repository. They are inspired by the [VS Code Coding Guidelines](https://github.com/microsoft/vscode/wiki/Coding-Guidelines) and adapted for a TypeScript + React + Astro codebase.

---

## Table of Contents

1. [General Principles](#1-general-principles)
2. [Naming Conventions](#2-naming-conventions)
3. [TypeScript](#3-typescript)
4. [File & Module Structure](#4-file--module-structure)
5. [React Components](#5-react-components)
6. [Astro Pages & Layouts](#6-astro-pages--layouts)
7. [Styling (Tailwind CSS v4)](#7-styling-tailwind-css-v4)
8. [Shared Code & DRY](#8-shared-code--dry)
9. [Comments & Documentation](#9-comments--documentation)
10. [Accessibility](#10-accessibility)
11. [Git & Commits](#11-git--commits)

---

## 1. General Principles

- **Clarity over cleverness.** Code is read far more than it is written. Prefer obvious solutions.
- **One concern per unit.** Functions do one thing. Components render one concept. Files own one domain.
- **Minimum necessary complexity.** Only add abstraction when the same pattern appears three or more times, or when the domain genuinely requires it.
- **Fail loudly at build time, never silently at runtime.** Prefer TypeScript errors and build-time validation (e.g. Zod, Astro content schema) over runtime fallbacks that hide bugs.

---

## 2. Naming Conventions

| Entity | Convention | Example |
|---|---|---|
| Types, Interfaces, Enums | `PascalCase` | `PostDisplayItem`, `FormState` |
| React components | `PascalCase` | `ReadingProgress`, `PostsGrid` |
| Astro components | `PascalCase` | `BaseLayout`, `CategoryFilterNav` |
| Functions & methods | `camelCase` | `getPublishedPosts`, `slugifyCategory` |
| Variables & parameters | `camelCase` | `initialPosts`, `activeCategory` |
| React hooks | `camelCase`, prefixed `use` | `usePrefersReducedMotion`, `useTheme` |
| Module-level constants | `SCREAMING_SNAKE_CASE` | `CATEGORY_CONFIG`, `IMMUTABLE_CACHE_HEADERS` |
| Files — utilities & hooks | `kebab-case` | `reading-progress.ts`, `use-theme.ts` |
| Files — components | `PascalCase` | `PostsGrid.tsx`, `BlogLayout.astro` |
| Files — pages | `kebab-case` or Astro routing convention | `[...slug].astro`, `rss.xml.ts` |

**Use full words.** Abbreviations obscure intent. `prefetchCache` not `pfxCache`. Exception: universally understood abbreviations (`id`, `url`, `ctx`, `e` for event).

---

## 3. TypeScript

### Strictness

The project runs in strict mode (`"strict": true`). Never weaken type safety to silence an error — fix the root cause instead.

```ts
// Bad
const data = response as any;

// Good
const data = response as PostsPagePayload;
// or: narrow properly with a type guard
```

### Prefer `interface` for object shapes, `type` for unions and aliases

```ts
// Object shape → interface
interface PostDisplayItem {
  slug: string;
  data: { title: string; category: string };
}

// Union or alias → type
type FormState = 'idle' | 'validating' | 'sending' | 'success';
```

### Export only what is needed

Do not export types or functions unless they are consumed by another module. Internal helpers stay unexported.

```ts
// only exported because PostsGrid and the JSON API both need it
export interface PostDisplayItem { ... }

// internal — no export
function normaliseSlug(s: string): string { ... }
```

### Explicit return types on public functions

Public functions exported from `src/lib/` must have explicit return types. Internal functions may rely on inference.

```ts
// Good — exported utility
export async function getPublishedPosts(): Promise<CollectionEntry<'blog'>[]> { ... }

// OK — small internal helper, return type is obvious
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
```

### Arrow functions vs `function` declarations

- Use **`export function`** for top-level exported functions (better stack traces, hoisted).
- Use **arrow functions** for callbacks, event handlers, and inline utilities.

```ts
// top-level export → function declaration
export function countByCategory(categories: string[]): Record<string, number> { ... }

// callback → arrow
posts.map((p) => p.data.category)
```

### `null` vs `undefined`

- Prefer `null` for intentionally absent values returned from functions or stored in state (explicit absence).
- Prefer `undefined` for optional function parameters and optional object properties.
- Never mix the two for the same concept within a module.

---

## 4. File & Module Structure

### Module boundaries

| Location | Purpose | Import rule |
|---|---|---|
| `src/lib/` | Server-side utilities | Only in Astro pages, layouts, API routes |
| `src/config/` | Static configuration | Anywhere |
| `src/components/react/hooks/` | React hooks | Only in React components |
| `src/components/react/` | React components | Only where hydrated |
| `src/components/astro/` | Astro components | Only in `.astro` files |

`src/lib/content.ts` uses `astro:content` which is a **build-time-only** module. Never import it in React components or client-side code.

### Import ordering

1. Node built-ins (`node:fs`, `node:path`)
2. Framework imports (`astro:content`, `react`)
3. Third-party packages (`lucide-react`, `satori`)
4. Internal aliases / relative paths — ordered from furthest to nearest

Separate each group with a blank line. Do not mix groups.

```ts
import { readFile } from 'node:fs/promises';

import { getCollection } from 'astro:content';

import satori from 'satori';

import { siteConfig } from '../../config/site';
import { getPublishedPosts } from '../../lib/content';
```

### One component per file

Each `.tsx` or `.astro` file exports exactly one primary component. Tightly coupled sub-components (e.g. `AccordionItem` inside `SeriesAccordion`) may live in the same file if they are not used elsewhere.

---

## 5. React Components

### Functional components only

Class components are not used in this codebase. Every component is a function.

```ts
// Correct
export const ReadingProgress: React.FC = () => { ... };

// Also correct for components with props
export const ErrorRetry: React.FC<ErrorRetryProps> = ({ message, onRetry }) => { ... };
```

### Props interfaces

Define a `*Props` interface above the component. Keep it in the same file unless shared.

```ts
interface PostsGridProps {
  initialPosts: PostDisplayItem[];
  initialTotal: number;
  category: string;
}

export const PostsGrid: React.FC<PostsGridProps> = ({ initialPosts, initialTotal, category }) => { ... };
```

### Hook rules

- Hooks always start with `use`.
- Place shared hooks in `src/components/react/hooks/`.
- Never call hooks conditionally.
- Always clean up effects (cancel animation frames, remove listeners, clear timers).

```ts
useEffect(() => {
  const rafId = requestAnimationFrame(update);
  return () => cancelAnimationFrame(rafId); // cleanup required
}, []);
```

### Avoid inline object/array creation in JSX

Inline objects create a new reference on every render, causing unnecessary re-renders for children that accept objects as props.

```tsx
// Bad — new object reference every render
<Component style={{ color: 'red' }} />

// Good — static styles belong in Tailwind classes; dynamic ones use a variable
const style = useMemo(() => ({ color: theme === 'dark' ? 'white' : 'black' }), [theme]);
<Component style={style} />
```

### Prefer `useCallback` for handlers passed as props

Wrap handlers that are passed to child components in `useCallback` to avoid re-rendering children unnecessarily.

---

## 6. Astro Pages & Layouts

### Server data belongs in frontmatter

All `getCollection` calls and data transformation happen in the `---` frontmatter block. Components receive ready-to-render props — never raw collection entries.

```astro
---
// Correct: data fetched and shaped server-side
import { getPublishedPosts, mapPostToDisplay } from '../../lib/content';
const posts = (await getPublishedPosts()).map(mapPostToDisplay);
---
<PostsGrid initialPosts={posts.slice(0, 10)} initialTotal={posts.length} category="All" />
```

### Use `client:` directives intentionally

| Directive | Use when |
|---|---|
| `client:load` | Component is needed immediately above the fold |
| `client:idle` | Component can wait for the browser to be idle |
| `client:visible` | Component is below the fold — hydrate on scroll |

Prefer `client:idle` or `client:visible` over `client:load` for most components to improve Time to Interactive.

### `getStaticPaths` isolation

Each `getStaticPaths` function must be self-contained and only call shared utilities from `src/lib/`. Do not duplicate data-fetching logic across pages — add a utility to `src/lib/content.ts` instead.

---

## 7. Styling (Tailwind CSS v4)

### Use design tokens, never raw values

The theme tokens defined in `src/styles/global.css` (e.g. `bg-fg`, `text-fg-muted`, `border-line`) automatically adapt to light/dark mode. Raw hex or RGB values bypass this and break theme switching.

```tsx
// Bad — breaks dark mode
<div style={{ color: '#fafafa' }} />

// Good — theme-aware
<div className="text-fg" />
```

### Dynamic class names must be complete strings

Tailwind's class scanner is static. Never construct class names with string interpolation or template literals that split the class name.

```tsx
// Bad — Tailwind cannot detect 'bg-' + color at build time
<div className={`bg-${color}-400`} />

// Good — full class names are statically visible
const colorClass = color === 'blue' ? 'bg-blue-400' : 'bg-green-400';
<div className={colorClass} />
```

### Responsive modifiers: mobile-first

Write base styles for mobile, then layer responsive overrides:

```tsx
// Correct
<div className="flex flex-col md:flex-row">

// Avoid writing desktop-first and overriding downward
```

### No inline styles for static values

Use Tailwind classes for all static values. Reserve `style={{}}` for values that are computed at runtime (e.g. animation positions, dynamic widths from user interaction).

---

## 8. Shared Code & DRY

Follow the module ownership table from [§4](#4-file--module-structure). Before writing a new function, check if it already exists in:

| File | Contains |
|---|---|
| `src/lib/content.ts` | `getPublishedPosts`, `mapPostToDisplay`, `parseSeriesCollection`, `countByCategory`, `resolveReadingTime`, `splitSeriesEntries` |
| `src/lib/animation.ts` | `lerp` |
| `src/lib/utils.ts` | `delay` |
| `src/lib/toc.ts` | `MAX_TOC_DEPTH`, `scrollToHeading` |
| `src/lib/http.ts` | `IMMUTABLE_CACHE_HEADERS` |
| `src/lib/og.ts` | `generateOgImage` |
| `src/hooks/usePrefersReducedMotion.ts` | Reduced motion media query |
| `src/config/site.ts` | All author / site metadata |
| `src/config/categories.ts` | Category config, `slugifyCategory`, `buildFilterCategories` |

**The three-instance rule:** if the same logic appears in three or more places, extract it. For two instances, use judgment — extraction is worthwhile when the logic is non-trivial or the two locations are in different domains.

---

## 9. Comments & Documentation

### Explain "why", not "what"

The code shows *what* it does. Comments explain *why* a decision was made when it is not obvious.

```ts
// Bad — restates the code
// increment the page counter
setPage(page + 1);

// Good — explains a non-obvious constraint
// Satori requires a plain object tree, not a ReactNode — cast to any to bypass type mismatch
const svg = await satori({ type: 'div', ... } as any, options);
```

### JSDoc for exported public APIs

Every function or type exported from `src/lib/` must have a JSDoc comment describing its purpose and any non-obvious parameters.

```ts
/**
 * Returns all non-draft, visible blog posts sorted newest-first.
 * Use this as the single entry point for any page that lists blog posts.
 */
export async function getPublishedPosts(): Promise<CollectionEntry<'blog'>[]> { ... }
```

### No commented-out code

Remove dead code instead of commenting it out. Git history preserves it if ever needed again.

---

## 10. Accessibility

### Respect `prefers-reduced-motion`

All animation — RAF loops, CSS transitions, keyframe animations — must either be disabled or reduced when the user has requested it.

```ts
// Use the shared hook for all motion decisions
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const prefersReducedMotion = usePrefersReducedMotion();
useEffect(() => {
  if (prefersReducedMotion) return;
  // start animation
}, [prefersReducedMotion]);
```

For CSS-only animations, pair `@keyframes` with the `@media (prefers-reduced-motion: reduce)` override in `global.css`.

### Semantic HTML

Use the correct element for the job. A button that performs an action is `<button>`. A link that navigates is `<a>`. Do not use `<div onClick>` for interactive elements.

### ARIA labels

Interactive elements without visible text must have `aria-label` or `aria-labelledby`.

```tsx
<button aria-label="Open table of contents">
  <MenuIcon />
</button>
```

### Keyboard navigation

Any custom interactive widget must be operable with the keyboard. Focusable elements must be reachable via Tab and activated via Enter or Space.

---

## 11. Git & Commits

### Commit message format

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>

[optional body]
[optional footer]
```

**Types:**

| Type | When to use |
|---|---|
| `feat` | A new feature or page |
| `fix` | A bug fix |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `style` | Formatting, whitespace — no logic change |
| `docs` | Documentation only |
| `chore` | Build scripts, config, dependency updates |
| `perf` | Performance improvement |
| `test` | Adding or correcting tests |

**Examples:**

```
feat(blog): add reading progress bar to blog posts
fix(search): prevent stale results when modal reopens
refactor(content): extract getPublishedPosts to src/lib/content.ts
chore: update astro to 5.17.1
```

### Commit scope

Keep each commit focused on one change. A commit that touches 15 unrelated files is a sign that it should be split.

### Branch naming

```
feat/<short-description>
fix/<short-description>
refactor/<short-description>
docs/<short-description>
```

Examples: `feat/series-rss-feed`, `fix/og-image-buffer-type`, `refactor/dry-categories`.
