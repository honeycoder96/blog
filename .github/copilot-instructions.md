# GitHub Copilot Instructions for blog

- This is an Astro 5 blog template with MDX content, client-side React UI, and static output. The project is designed for minimal runtime APIs: all page data is built at compile time via `astro:content` and `src/lib/content.ts`.
- Source-of-truth site metadata: `src/config/site.ts`. Categories are in `src/config/categories.ts`. Do not hardcode author/site settings elsewhere.

## Big-picture architecture
- `src/content/blog/**` and `src/content/series/**` are Markdown/MDX posts + series indexes.
- `src/lib/content.ts` reads and shapes posts (published/draft filters, category/tag indexing, pagination).
- Pages (`src/pages/`) use Astro frontmatter to call `getPublishedPosts()` etc., transform data, then render layouts/components.
- `src/components/astro/` are SSR-only shared UI pieces; `src/components/react/` are interactive components with `client:*` hydration directives. Avoid importing `astro:content` into `.tsx`.
- OG generation in `src/lib/og.ts`; routes in `src/pages/og/**` build dynamic images via `satori` + `@resvg/resvg-js`.

## Developer workflow (must-track commands)
- `npm run dev` (local dev server, HMR on `localhost:4321`).
- `npm run build` (Astro build + `npx pagefind --site dist` indexer). must run before production test.
- `npm run preview` (serve built output for smoke test).
- `npm run typecheck` / `npx tsc --noEmit` (strict mode, no errors allowed).
- `npm run lint` / `npm run lint:fix` (ESLint `src`).
- `npm run test` / `npm run test:watch` (Vitest).
- `npm run buildcheck` (full pipe: `typecheck`, `lint`, `format:check`, `test`, `build`).

## Project-specific patterns
- One exported component per file (`PascalCase` file and symbol names): e.g. `src/components/react/ui/SearchModal.tsx`, `src/components/react/blog/PostsGrid.tsx`.
- Hook file location: `src/components/react/hooks/`; component uses `useTheme`, `usePrefersReducedMotion`, etc.
- `use` name prefix for hooks, `*Props` interface above React component.
- Always render data from backend in Astro frontmatter; pass prepared props to React components.
- Avoid inline object constructors in JSX; prefer const + direct Tailwind classes.
- Prefer `client:idle` / `client:visible` for hydration unless required on `load`.

## Integration and boundaries
- Static API endpoints: `src/pages/api/posts/**` and `src/pages/api/series/**` for client fetch from `PostsGrid` and `SeriesAccordion`.
- PWA and service worker via `@vite-pwa/astro`, `public/site.webmanifest`, `src/pages/offline.astro`.
- Contact form posts to `PUBLIC_CONTACT_API_URL/v1/contact` from `src/components/react/sections/ContactForm.tsx`.
- ICONS, fonts and assets in `public/`.

## Quick win areas for agents
- Adding a new content type: extend `src/lib/content.ts` + add `isPublished` checks + matching `src/pages/*` query.
- Adding UI controls: new `src/components/react/ui/*` + hook in `src/components/react/hooks/*` + consume in `src/components/astro/*` or page.
- Meta/SEO: `BaseLayout.astro`, `siteConfig` from `src/config/site.ts`.

## Test and commit expectations
- Before any push, verify: `npx tsc --noEmit`, `npm run lint`, `npm run test`, `npm run build`.
- PR title uses conventional commits (`feat(...)`, `fix(...)`, `docs(...)`).
- No `any` or `// eslint-disable` without justification.
- Add or update tests under `src/lib/__tests__/` or the matching component test file.

## What not to do
- Do not call `astro:content` from client components or generic React hook code.
- Do not use raw color values (`#fff`) in JSX style objects; use Tailwind theme tokens from `src/styles/global.css`.
- Do not add runtime dependencies unless needed for static/generated content path (OG process / Pagefind).
