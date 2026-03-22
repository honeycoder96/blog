import { defineCollection, z } from 'astro:content';
import { siteConfig } from '../config/site';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    pubDate: z.coerce.date(),
    category: z.string(),
    author: z.string().default(siteConfig.author),
    summary: z.string(),
    featured: z.boolean().default(false),
    isVisible: z.boolean().default(true),
    draft: z.boolean().default(false),
    readingTime: z.number().optional(),
    tags: z.array(z.string()).default([]),
    relatedPosts: z.array(z.string()).default([]),
    prevPost: z.string().optional(),
    nextPost: z.string().optional(),
  }),
});

const seriesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    category: z.string(),
    // Index-only
    postOrder: z.array(z.string()).optional(),
    // Post-only
    date: z.string().optional(),
    pubDate: z.coerce.date().optional(),
    author: z.string().default(siteConfig.author),
    summary: z.string().optional(),
    readingTime: z.number().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog: blogCollection, series: seriesCollection };
