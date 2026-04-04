# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # start dev server
npm run build        # astro build + pagefind index (must run together)
npm run preview      # preview the production build locally

npm run typecheck    # astro sync + tsc --noEmit
npm run lint         # eslint src
npm run lint:fix     # eslint src --fix
npm run format       # prettier write
npm run format:check # prettier check

npm run test         # vitest run (single pass)
npm run test:watch   # vitest watch mode
npm run buildcheck   # full pre-deploy: typecheck + lint + format + test + build
```

Run a single test file:
```bash
npx vitest run src/lib/__tests__/content.test.ts
```

## Architecture

### Stack
Astro (static output) + Preact (with React compat, acts as React) + Tailwind v4 (vite plugin). All pages are pre-rendered at build time — there is no SSR.

### Content Collections
Two collections defined in `src/content/config.ts`:

- **`blog`** — regular posts at `src/content/blog/{category}/{slug}.mdx`. Frontmatter fields: `title`, `date` (display string), `pubDate` (Date), `category`, `summary`, `tags`, `draft`, `isVisible`, `featured`, `relatedPosts`, `prevPost`, `nextPost`.
- **`series`** — at `src/content/series/{seriesSlug}/`. Each series has:
  - `index.md` — series metadata with a `postOrder: [slug1, slug2, ...]` array that defines sequence and controls which posts appear
  - Individual `.mdx` files — one per post in the series

`draft: true` hides a post from all listings. `isVisible: false` hides from listings but the post page still renders (used for unlisted/hidden posts).

### Component Zones
- `src/components/astro/` — server-rendered Astro components (Navbar, Footer, CategoryBadge, Note, etc.)
- `src/components/mdx/` — Astro components intended for import inside MDX post bodies (Callout, Steps, Step, NetworkPath, SequenceDiagram, ArchFlow, Terminal, PacketDiagram, etc.)
- `src/components/react/` — interactive Preact components (PostsGrid, SearchModal, SeriesAccordion, TableOfContents, ContactForm, etc.)

**`src/lib/content.ts` is server-side only** — it uses `astro:content` which is a build-time virtual module. Never import it in React/Preact components. Client-side data comes from the static JSON API below.

### Static JSON API
`src/pages/api/posts/[category]/[page].json.ts` and `src/pages/api/series/[category]/[page].json.ts` are pre-rendered at build time into paginated JSON files. PostsGrid and SeriesAccordion fetch these client-side rather than receiving all data as props. `slugifyCategory()` in `src/config/categories.ts` is the single source of truth for category → URL slug conversion — it's used at both build time (endpoint generation) and runtime (fetch calls).

### Configuration Files
- `src/config/site.ts` — all site identity, URLs, social links, API endpoints, analytics, comments (Giscus). Single place to edit when personalising the blog.
- `src/config/categories.ts` — `CATEGORY_CONFIG` array is the source of truth for category display names, badge colours, and homepage visibility. Categories not in this config still work as filters but render with fallback styling and won't appear on the homepage cards.

### Build Pipeline
`npm run build` runs `astro build` followed by `npx pagefind --site dist`. Pagefind generates the search index post-build, so it is not available during the Astro build phase. The service worker (via `@vite-pwa/astro`) precaches build output but leaves pagefind assets to runtime caching only.

### OG Images
Generated at build time using Satori + `@resvg/resvg-js` via `src/pages/og/blog/[...slug].png.ts` and `src/pages/og/series/[seriesSlug]/[postSlug].png.ts`.

### Reading Time
Injected at build time by the `src/lib/remark-reading-time.ts` remark plugin into post frontmatter. `resolveReadingTime()` in `content.ts` falls back to a word-count estimate when the plugin value is absent.

### Testing
Vitest with `astro:content` aliased to `src/__mocks__/astro-content.ts` (the real module is unavailable outside the Astro build). All tests live in `src/lib/__tests__/`. Tests cover pure utility functions only — no Astro component tests.

### Code Syntax Highlighting
Shiki dual-theme (`github-dark` / `github-light`) emits `--shiki-dark` / `--shiki-light` CSS variables per token. `global.css` switches between them based on `[data-theme]` on `<html>`.

## GitHub Issue & PR Workflow

This repo uses GitHub issues to track every blog post and series. The GitHub MCP (`mcp__github__*` tools) is connected and must be used for all GitHub operations — do not use the `gh` CLI.

### Labels
Three labels are used (create them at `github.com/honeycoder96/blog/labels` if missing):

| Label | Colour | Purpose |
|-------|--------|---------|
| `epic` | `#6B46C1` | Top-level tracking issue for a series |
| `javascript-promises` | `#F0DB4F` | All issues in the JS Promises series |
| `how-internet-works` | `#0EA5E9` | All issues in the How Internet Works series |

### New series → create an epic
When a new series is started, create one epic issue using `mcp__github__issue_write` with `method: "create"`:

- **Title:** `Epic: {Series Title} ({N} posts)`
- **Labels:** `["epic", "{series-label}"]`
- **Body:** series description, a structure table (parts/blocks with post counts), and a story checklist section (populate with issue links once stories exist)

After creating all story issues, update the epic body (`method: "update"`, `issue_number: <epic#>`) to replace the placeholder checklist with `- [ ] #{issue} Post NN: Title` lines grouped by part/block.

### New post → create a story issue
For each new post being written, create an issue using `mcp__github__issue_write` with `method: "create"`:

- **Title:** `Post NN: {Post Title}`
- **Labels:** `["{series-label}"]` (or no label for standalone blog posts)
- **Body:**
  ```
  **Epic:** #{epic-issue-number}
  **Part/Block:** {part or block name}
  **Series order:** NN of total

  ## Description
  {one-paragraph description of what the post covers}

  ## Key topics
  - bullet list of the main concepts to cover
  ```

### Post published → close the story issue
When a post's `.mdx` file is written and committed, close its issue:

```
mcp__github__issue_write
  method: "update"
  issue_number: {N}
  state: "closed"
  state_reason: "completed"
```

The epic's checklist item auto-renders as checked once the issue is closed.

### PR body → reference the issue
Every PR for a post must reference its issue in the PR body so GitHub auto-links them and marks the issue as in-progress:

```
## Summary
- Writes Post NN: {title}

Closes #{issue-number}
```

Use `mcp__github__create_pull_request` with `head: "stage"`, `base: "main"`. The `Closes #N` line is what triggers the auto-link to the project board.
