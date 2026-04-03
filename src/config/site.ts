/**
 * site.ts — Single source of truth for all personal and site configuration.
 *
 * Anyone cloning this repo should only need to edit this file (and .env)
 * to fully personalise the blog. Every component, layout, and page reads
 * from here instead of having values scattered across the codebase.
 */

export const siteConfig = {
  // ── Identity ──────────────────────────────────────────────────────────────

  /** Your full name — used in meta tags, RSS feed title, and default post author */
  author: 'Honey Sharma',

  /** Short author bio shown at the bottom of every post */
  bio: 'Software engineer focused on web engineering, TypeScript, and distributed systems.',

  // ── Site URL & branding ───────────────────────────────────────────────────

  /** Canonical URL of your deployed site — no trailing slash */
  siteUrl: 'https://blog.honeyhimself.com',

  /** Short display name shown in the navbar and footer logo */
  siteName: 'blog.honeyhimself',

  /** Full title used on the homepage <title> tag and OG title */
  siteTitle: 'blog.honeyhimself — Engineering Blog',

  /** Default meta description for pages that don't provide one */
  description: 'A blog about web engineering, architecture, and the craft of building software.',

  // ── Social links ──────────────────────────────────────────────────────────

  /** URL of this blog's source code repository — shown as GitHub icon in navbar */
  repoUrl: 'https://github.com/honeycoder96/blog',

  social: {
    /** Full GitHub profile URL */
    github: 'https://github.com/honeycoder96',
    /** GitHub handle shown as link text */
    githubHandle: '@honeycoder96',

    /** Full LinkedIn profile URL — set to '' to hide */
    linkedin: 'https://www.linkedin.com/in/honeycoder96/',

    /** Twitter / X handle including the @ sign — used for Twitter Card meta tags */
    twitter: '',

    /** Contact / reply-to email address */
    email: 'contact@honeyhimself.com',

    /**
     * Personal website or portfolio — shown as the "About" nav link.
     * Set to '' to remove the About link from the navbar.
     */
    website: 'https://honeyhimself.com/',
  },

  // ── Contact page ──────────────────────────────────────────────────────────

  contact: {
    /** API endpoint for the contact form — set to '' to disable */
    endpoint: 'https://talentsyncapi.honeyhimself.com/v1/contact',
    /** Displayed on the contact page, e.g. "UTC+5:30" */
    timezone: 'UTC+5:30',
    /** Displayed on the contact page, e.g. "6-12h" */
    responseTime: '6-12h',
  },

  // ── Newsletter ────────────────────────────────────────────────────────────

  newsletter: {
    /** API endpoint for newsletter subscriptions — set to '' to disable the form */
    endpoint: 'https://talentsyncapi.honeyhimself.com/v1/newsletter',
    /** Source tag sent with every subscription so you know where signups came from */
    source: 'blog-footer',
  },

  // ── Analytics ─────────────────────────────────────────────────────────────

  analytics: {
    /** Google Analytics 4 Measurement ID — set to '' to disable */
    gaMeasurementId: 'G-TWCRF7WF92',
  },

  // ── RSS feed ──────────────────────────────────────────────────────────────

  rss: {
    title: 'Honey Sharma — Blog',
    description:
      'In-depth writing on web engineering, JavaScript, architecture, and the craft of building software.',
  },

  // ── Comments (Giscus) ─────────────────────────────────────────────────────
  // Generate your values at https://giscus.app — enable Discussions on your
  // GitHub repo first, then paste the values here.

  comments: {
    giscus: {
      /** GitHub repo in "owner/repo" format */
      repo: 'honeycoder96/blog',

      /** Repo ID — shown on giscus.app after you configure your repo */
      repoId: 'R_kgDOL9ylkQ',

      /** Discussion category to post comments in */
      category: 'Q&A',

      /** Category ID — shown on giscus.app */
      categoryId: 'DIC_kwDOL9ylkc4C5AqS',

      /**
       * How each page is mapped to a GitHub Discussion.
       * 'url' | 'pathname' | 'title' | 'og:title'
       */
      mapping: 'url',

      /** Enable strict title matching to avoid false Discussion matches */
      strict: true,

      /** Show emoji reactions on the top-level comment */
      reactionsEnabled: true,

      /** Where the comment input box appears: 'top' | 'bottom' */
      inputPosition: 'top',

      /**
       * Giscus theme to use when the blog is in dark mode.
       * Any value from https://giscus.app/themes e.g. 'dark', 'dark_dimmed', 'dark_tritanopia'
       */
      themeDark: 'dark_tritanopia',

      /**
       * Giscus theme to use when the blog is in light mode.
       * Any value from https://giscus.app/themes e.g. 'light', 'light_protanopia'
       */
      themeLight: 'light_tritanopia',

      /** Widget UI language, e.g. 'en', 'fr', 'de' */
      lang: 'en',
    },
  },
} as const;
