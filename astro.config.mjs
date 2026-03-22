import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
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
    react(),
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/blog/hidden/'),
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
          item.lastmod = new Date();
        }
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    optimizeDeps: {
      include: ['react', 'react-dom'],
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
