# Contributing

Thank you for your interest in contributing. This document covers everything you need to get from idea to merged pull request.

> Before writing any code, please read the [Coding Guidelines](./CODING_GUIDELINES.md). They cover naming, TypeScript conventions, shared utilities, and more.

---

## Table of Contents

1. [What counts as a contribution?](#1-what-counts-as-a-contribution)
2. [Getting started](#2-getting-started)
3. [Development workflow](#3-development-workflow)
4. [Project structure](#4-project-structure)
5. [Key conventions to know before you code](#5-key-conventions-to-know-before-you-code)
6. [Submitting a pull request](#6-submitting-a-pull-request)
7. [PR review checklist](#7-pr-review-checklist)
8. [Reporting bugs](#8-reporting-bugs)

---

## 1. What counts as a contribution?

All of the following are welcome:

- **Bug fixes** — broken layouts, incorrect data, TypeScript errors
- **Performance improvements** — bundle size, build time, Lighthouse score
- **Accessibility improvements** — keyboard navigation, ARIA, reduced motion
- **New Astro/React components** — must follow the patterns in [§5](#5-key-conventions-to-know-before-you-code)
- **Content utilities** — additions to `src/lib/content.ts` or other shared utilities
- **Documentation** — README, this file, inline JSDoc

The following are **out of scope** for pull requests:

- Personalising the blog with your own content, author name, or site URL (that is the intended use of `src/config/site.ts` — no PR needed)
- Changes to the build system that break static deployability
- Introducing new runtime dependencies without prior discussion

---

## 2. Getting started

### Prerequisites

- Node.js 20+
- npm 10+

### Fork and clone

```bash
# 1. Fork the repo on GitHub, then:
git clone https://github.com/<your-username>/blog.git
cd blog

# 2. Install dependencies
npm install

# 3. Set up your local environment
cp .env.example .env.development
# Edit .env.development if you want to test the contact form against a real API.
# If PUBLIC_CONTACT_API_URL is left empty the form silently succeeds locally.

# 4. Start the dev server
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

### TypeScript check

Run this before every commit:

```bash
npx tsc --noEmit
```

The CI pipeline runs the same check. A PR with TypeScript errors will not be merged.

---

## 3. Development workflow

### Branches

Create a branch from `main` following the naming convention:

```
feat/<short-description>
fix/<short-description>
refactor/<short-description>
docs/<short-description>
```

```bash
git checkout -b feat/series-rss-feed
```

### Running the project

| Command | What it does |
|---|---|
| `npm run dev` | Dev server at `localhost:4321` with HMR |
| `npm run build` | Production build + Pagefind indexing into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npx tsc --noEmit` | Type check without emitting files |

### Making a production build

Always verify your change works in a production build before opening a PR — some issues only appear after Pagefind indexing or static pre-rendering:

```bash
npm run build && npm run preview
```

---

## 4. Project structure

```
src/
├── config/
│   ├── site.ts          ← author / site metadata (single source of truth)
│   └── categories.ts    ← category config, slugifyCategory, buildFilterCategories
├── content/
│   ├── blog/            ← blog posts (.mdx)
│   └── series/          ← series index + post files (.md / .mdx)
├── lib/
│   ├── content.ts       ← server-side data utilities (getPublishedPosts, etc.)
│   ├── animation.ts     ← lerp and other animation math
│   ├── http.ts          ← shared HTTP constants (cache headers)
│   ├── toc.ts           ← MAX_TOC_DEPTH, scrollToHeading
│   ├── utils.ts         ← general utilities (delay, etc.)
│   └── og.ts            ← OG image generation (Satori + resvg)
├── layouts/
│   ├── BaseLayout.astro ← <head>, meta tags, global scripts
│   ├── BlogLayout.astro ← post layout (TOC, prev/next, series context)
│   └── PageLayout.astro ← general layout (navbar, footer)
├── pages/
│   ├── index.astro
│   ├── blog/            ← /blog, /blog/[...slug], /blog/category/[slug]
│   ├── series/          ← /series, /series/[seriesSlug]/[postSlug]
│   ├── api/             ← static JSON API for paginated PostsGrid / SeriesAccordion
│   ├── og/              ← build-time OG image generation
│   └── rss.xml.ts
├── components/
│   ├── astro/           ← server-rendered components (Navbar, Footer, CategoryFilterNav)
│   └── react/
│       ├── hooks/       ← shared React hooks (usePrefersReducedMotion, useTheme, etc.)
│       ├── ui/          ← generic UI components (SearchModal, CustomCursor, ErrorRetry, etc.)
│       ├── blog/        ← blog-specific components (PostsGrid, TableOfContents, etc.)
│       ├── series/      ← series-specific components (SeriesAccordion)
│       ├── canvas/      ← canvas-based effects (HeroCanvas)
│       └── sections/    ← page sections (HeroSection, ContactForm, NewsletterSection)
└── styles/
    └── global.css       ← Tailwind v4 + theme tokens + prose styles + keyframes
```

### Where to add new things

| What you're adding | Where it goes |
|---|---|
| A shared data-fetching helper | `src/lib/content.ts` |
| A generic animation utility | `src/lib/animation.ts` |
| A reusable React hook | `src/components/react/hooks/` |
| A generic UI component | `src/components/react/ui/` |
| A blog-specific component | `src/components/react/blog/` |
| A new page | `src/pages/` following Astro file-based routing |
| A new theme token | `src/styles/global.css` under `:root` and `[data-theme="light"]` |

---

## 5. Key conventions to know before you code

Read the full [Coding Guidelines](./CODING_GUIDELINES.md) for the complete picture. The most common mistakes are listed here.

### Server vs client boundary

`src/lib/content.ts` uses `astro:content` — a **build-time-only** module. Never import it in React components (`.tsx` files) or any file that runs in the browser. If a React component needs data, receive it as a prop from the Astro parent page.

```astro
---
// ✅ Correct — data fetched server-side in .astro frontmatter
import { getPublishedPosts, mapPostToDisplay } from '../../lib/content';
const posts = (await getPublishedPosts()).map(mapPostToDisplay);
---
<PostsGrid initialPosts={posts.slice(0, 10)} initialTotal={posts.length} category="All" client:idle />
```

### No raw hex / RGB in JSX

All colour values must reference a theme token so they adapt to light/dark mode automatically:

```tsx
// ❌ Breaks dark mode
<div style={{ color: '#fafafa' }} />

// ✅ Theme-aware
<div className="text-fg" />
```

### Reduced motion

Every animation must have a reduced-motion path:

```ts
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const prefersReducedMotion = usePrefersReducedMotion();
useEffect(() => {
  if (prefersReducedMotion) return; // ← always guard
  // start RAF loop or heavy animation
}, [prefersReducedMotion]);
```

### DRY — check before you write

Before writing a helper, check `src/lib/` and `src/components/react/hooks/`. The most common ones:

```ts
import { getPublishedPosts, mapPostToDisplay, countByCategory } from '../../lib/content';
import { lerp } from '../../lib/animation';
import { delay } from '../../lib/utils';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
```

---

## 6. Submitting a pull request

### Before opening the PR

- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] `npm run build` succeeds
- [ ] `npm run preview` and manually test the affected pages
- [ ] No new `// eslint-disable` or `as any` without a comment explaining why
- [ ] All new exported functions have JSDoc comments
- [ ] No hardcoded personal values — author name, URLs, etc. belong in `src/config/site.ts`

### PR title

Use Conventional Commits format: `type(scope): short summary`

```
feat(search): improve keyboard navigation in SearchModal
fix(og): correct buffer type for OG image Response
refactor(content): extract resolveReadingTime to src/lib/content.ts
```

### PR description template

```markdown
## What does this PR do?
<!-- One paragraph summary -->

## Why?
<!-- The motivation — link an issue if one exists -->

## How to test
<!-- Steps to reproduce / verify the change manually -->

## Checklist
- [ ] TypeScript passes
- [ ] Production build passes
- [ ] Manually tested in browser
- [ ] Reduced motion tested (if animation changed)
- [ ] Light mode tested (if colour / theme changed)
```

---

## 7. PR review checklist

Reviewers will check for the following:

**Correctness**
- Does the change do what the PR description says?
- Are edge cases handled (empty state, loading state, error state)?

**Type safety**
- No new `any` without a documented reason
- No type assertions that mask a real issue

**DRY / shared code**
- Are new utilities in the right place (`src/lib/`, `src/hooks/`)?
- Is duplicated logic extracted when it appears three or more times?

**Accessibility**
- Does new animation respect `prefers-reduced-motion`?
- Do new interactive elements work with keyboard?
- Do icon-only buttons have `aria-label`?

**Theme compliance**
- Do new colours use design tokens?
- Is the component tested in both light and dark mode?

**Performance**
- Are new `client:load` directives justified? Could they be `client:idle` or `client:visible`?
- Are large dependencies added with justification?

---

## 8. Reporting bugs

Open a GitHub Issue with:

1. **What you expected** to happen
2. **What actually happened** (with a screenshot if visual)
3. **Steps to reproduce**
4. **Environment** — OS, browser, Node.js version

For security issues, do not open a public issue — email the maintainer directly.
