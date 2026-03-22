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

  social: {
    /** Full GitHub profile URL */
    github: 'https://github.com/honeycoder96',
    /** GitHub handle shown as link text */
    githubHandle: '@honeycoder96',

    /** Full LinkedIn profile URL — set to '' to hide */
    linkedin: 'https://www.linkedin.com/in/honeycoder96/',

    /** Twitter / X handle including the @ sign — used for Twitter Card meta tags */
    twitter: '@honeyhimself',

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
    /** Displayed on the contact page, e.g. "UTC+5:30" */
    timezone: 'UTC+5:30',
    /** Displayed on the contact page, e.g. "6-12h" */
    responseTime: '6-12h',
  },

  // ── RSS feed ──────────────────────────────────────────────────────────────

  rss: {
    title: 'Honey Sharma — Blog',
    description: 'In-depth writing on web engineering, JavaScript, architecture, and the craft of building software.',
  },
} as const;
