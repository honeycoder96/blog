// @ts-check
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
      dedupe: ['react', 'react-dom', 'framer-motion'],
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'framer-motion'],
    },
    build: {
      rollupOptions: {
        // pagefind.js is generated post-build and does not exist during Vite's
        // bundle phase — mark it external so Rollup skips resolution entirely.
        external: ['/pagefind/pagefind.js'],
      },
    },
  },
  markdown: {
    shikiConfig: { theme: 'github-dark', wrap: true },
    remarkPlugins: [remarkReadingTime],
  },
});
