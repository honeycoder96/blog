# astro-cody-blog

A minimal, fast, dark-mode-first engineering blog built with Astro 5, React, Tailwind CSS v4, and Pagefind. Clone it, edit one config file, and you have your own blog.

## Features

- **Static output** — fully pre-rendered, deployable to Vercel, Netlify, Cloudflare Pages, or any CDN
- **Pagefind search** — client-side full-text search, zero backend required
- **MDX content** — write posts in Markdown with JSX component support
- **Blog + Series** — standalone posts and ordered multi-part series, each with their own routing
- **Reading progress bar** — thin indicator at the top of every post
- **Table of contents** — sticky sidebar with active-section tracking via IntersectionObserver
- **OG image generation** — per-post Open Graph images generated at build time with Satori
- **RSS feed** — auto-generated from published posts
- **Sitemap** — auto-generated with customisable changefreq and priority
- **Dark / light theme** — persisted in localStorage, no flash on load
- **Custom cursor** — smooth cursor with spring lerp, respects `prefers-reduced-motion`
- **Contact form** — connects to any REST API via `PUBLIC_CONTACT_API_URL` env var
- **View Transitions** — page-to-page transitions via Astro's built-in View Transitions API

## Quick start

```bash
git clone https://github.com/your-username/astro-cody-blog.git
cd astro-cody-blog
npm install
cp .env.example .env.development
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Configuration

**All personal information lives in one file:** `src/config/site.ts`

```ts
export const siteConfig = {
  author: 'Your Name',
  siteUrl: 'https://your-blog.example.com',
  siteName: 'blog.yourname',
  siteTitle: 'blog.yourname — Engineering Blog',
  description: 'A blog about ...',

  social: {
    github: 'https://github.com/your-handle',
    githubHandle: '@your-handle',
    linkedin: 'https://www.linkedin.com/in/your-handle/',
    twitter: '@yourhandle',
    email: 'you@example.com',
    website: 'https://yoursite.com/', // shown as "About" nav link; set to '' to hide
  },

  contact: {
    timezone: 'UTC+0:00',
    responseTime: '24-48h',
  },

  rss: {
    title: 'Your Name — Blog',
    description: 'Writing about ...',
  },
};
```

No other files need to change to personalise the blog.

## Environment variables

Copy `.env.example` to `.env.development` (local) and `.env.production` (deployment):

```
PUBLIC_CONTACT_API_URL=https://your-api.example.com
```

The contact form POSTs to `${PUBLIC_CONTACT_API_URL}/v1/contact` with `{ name, email, message, origin: 'blog' }`. If the variable is not set, the form silently succeeds so the page still renders during development.

## Writing content

### Blog post

Create `src/content/blog/<category>/<slug>.mdx`:

```mdx
---
title: 'Your Post Title'
date: '2026-01-15'
pubDate: 2026-01-15
category: Engineering
author: Your Name
summary: 'A one-line summary for cards and OG tags.'
featured: false
draft: false
tags: [typescript, performance]
relatedPosts: []
---

Your content here.
```

### Series

1. Create `src/content/series/<series-slug>/index.md` — the series index:

```md
---
title: 'Series Title'
description: 'What the series covers.'
category: Engineering
postOrder:
  - part-1-slug
  - part-2-slug
---
```

2. Create one MDX file per part: `src/content/series/<series-slug>/<part-slug>.mdx`:

```mdx
---
title: 'Part 1: Getting Started'
date: '2026-01-15'
pubDate: 2026-01-15
category: Engineering
summary: 'Part summary.'
tags: []
---
```

## Categories

Categories are defined in `src/config/categories.ts`. Add or remove entries there to change the filter tabs on the blog and series pages.

## Commands

| Command | Action |
|---|---|
| `npm run dev` | Start dev server at `localhost:4321` |
| `npm run build` | Build to `./dist/` and run Pagefind indexing |
| `npm run preview` | Preview the production build locally |

## Deployment

### Vercel

Push to GitHub and import the repo in Vercel. Add `PUBLIC_CONTACT_API_URL` in Project → Settings → Environment Variables.

### Other platforms

Run `npm run build` — output is in `dist/`. The build also runs Pagefind to index the built HTML. The `dist/` folder is self-contained and can be served from any static host.

## Project structure

```
src/
├── config/
│   ├── site.ts          ← edit this to personalise
│   └── categories.ts    ← blog/series category definitions
├── content/
│   ├── blog/            ← blog posts (MDX)
│   └── series/          ← series posts + index files (MDX/MD)
├── layouts/
│   ├── BaseLayout.astro ← <head>, meta tags, global scripts
│   ├── BlogLayout.astro ← post layout (TOC, prev/next, OG image)
│   └── PageLayout.astro ← general page layout (navbar, footer)
├── pages/
│   ├── index.astro
│   ├── blog/
│   ├── series/
│   ├── contact.astro
│   └── rss.xml.ts
├── components/
│   ├── astro/           ← Navbar, Footer, ThemeToggle
│   └── react/           ← interactive UI components
└── styles/
    └── global.css       ← Tailwind v4 + theme tokens + prose styles
```

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Astro 5 |
| UI components | React 19 |
| Styling | Tailwind CSS v4 |
| Content | MDX |
| Search | Pagefind |
| OG images | Satori + @resvg/resvg-js |
| Icons | Lucide React |

## License

MIT
