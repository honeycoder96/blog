import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import AstroPWA from '@vite-pwa/astro';
import { remarkReadingTime } from './src/lib/remark-reading-time.ts';
import { siteConfig } from './src/config/site.ts';

export default defineConfig({
  site: siteConfig.siteUrl,
  output: 'static',
  prefetch: true,
  build: {
    // Inline stylesheets smaller than 12 KiB directly into the HTML response.
    // This eliminates the render-blocking <link rel="stylesheet"> round-trip
    // for page-specific CSS chunks (e.g. _slug_.css at ~9.6 KiB).
    // The global CSS (Tailwind) is larger and stays as a separate cached file.
    inlineStylesheets: 'auto',
  },
  integrations: [
    preact({ compat: true }),
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/blog/hidden/') && !page.includes('/preview/'),
      serialize(item) {
        // Homepage and listing pages — checked more frequently
        if (item.url === `${siteConfig.siteUrl}/` ||
            item.url.endsWith('/blog/') ||
            item.url.endsWith('/series/')) {
          item.changefreq = 'weekly';
          item.priority = 0.9;
        } else {
          // Individual posts — stable content, monthly check is enough
          item.changefreq = 'monthly';
          item.priority = 0.7;
        }
        return item;
      },
    }),
    AstroPWA({
      registerType: 'autoUpdate',
      // Service worker is written to dist/ during build; Pagefind runs after,
      // so pagefind assets are handled via runtime caching only (not precache).
      manifest: false, // We manage site.webmanifest manually in public/
      workbox: {
        // Offline fallback for navigation requests to uncached pages
        navigateFallback: '/offline',
        // Don't apply navigateFallback to API routes, OG images, or pagefind
        navigateFallbackDenylist: [/^\/api\//, /^\/og\//, /^\/pagefind\//],
        // Precache all Astro build output (hashed JS/CSS/HTML)
        globPatterns: ['**/*.{html,js,css,woff2,ico,svg,png}'],
        // Don't precache OG images (large, not needed offline)
        globIgnores: ['og/**'],
        runtimeCaching: [
          // Paginated JSON API — cache-first (immutable, 1 year)
          {
            urlPattern: /^\/api\/posts\/.+\.json$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'posts-api',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Series JSON API — cache-first (immutable, 1 year)
          {
            urlPattern: /^\/api\/series\/.+\.json$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'series-api',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Pagefind search files — network-first (generated post-build, not precached)
          {
            urlPattern: /^\/pagefind\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pagefind',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // Self-hosted fonts — cache-first (never change between deploys)
          {
            urlPattern: /^\/fonts\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      // Dedupe both preact and its react-compat aliases so all packages share
      // one instance, avoiding symbol mismatches (e.g. forwardRef $$typeof).
      dedupe: ['preact', 'preact/compat', 'react', 'react-dom'],
    },
    optimizeDeps: {
      // Pre-bundle at dev-server startup so Vite does not re-transform these
      // on every navigation request.
      include: [
        'preact',
        'preact/compat',
        'preact/jsx-runtime',
      ],
    },
    build: {
      // Threshold that Astro's inlineStylesheets:'auto' uses.
      // 12288 = 12 KiB — covers _slug_.css (~9.6 KiB) but not the global bundle.
      assetsInlineLimit: 12288,
      rollupOptions: {
        // pagefind.js is generated post-build and does not exist during Vite's
        // bundle phase — mark it external so Rollup skips resolution entirely.
        external: ['/pagefind/pagefind.js'],
      },
    },
  },
  markdown: {
    shikiConfig: {
      // Dual-theme: Shiki emits --shiki-dark / --shiki-light CSS vars per token.
      // global.css switches between them based on [data-theme] on <html>.
      themes: { dark: 'github-dark', light: 'github-light' },
      wrap: true,
    },
    remarkPlugins: [remarkReadingTime],
  },
});
