import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    pubDate: z.coerce.date(),
    category: z.enum(['Architecture', 'Deep Dive', 'Engineering']),
    author: z.string().default('Honey Sharma'),
    summary: z.string(),
    featured: z.boolean().default(false),
    readingTime: z.number().optional(),
    tags: z.array(z.string()).default([]),
    relatedPosts: z.array(z.string()).default([]),
  }),
});

export const collections = { blog: blogCollection };
