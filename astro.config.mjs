// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

export default defineConfig({
  output: 'static',
  integrations: [react(), mdx()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      dedupe: ['react', 'react-dom', 'framer-motion'],
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'framer-motion', '@codesandbox/sandpack-react'],
    },
  },
  markdown: {
    shikiConfig: { theme: 'github-dark', wrap: true },
  },
});
