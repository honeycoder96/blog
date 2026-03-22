/**
 * Shared content utilities — server-side only (uses astro:content).
 * Import from Astro pages and API routes; do NOT import in React components.
 */

import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { WORDS_PER_MINUTE } from './constants';

// ── Types ──────────────────────────────────────────────────────────

/** Standard display shape for a blog post — used by PostsGrid and the JSON API. */
export interface PostDisplayItem {
  slug: string;
  data: {
    title: string;
    date: string;
    category: string;
    summary: string;
    readingTime: number | null;
    tags: string[];
  };
}

/** Standard shape for a parsed series — used by SeriesAccordion and the JSON API. */
export interface SeriesItem {
  seriesSlug: string;
  title: string;
  description?: string;
  category: string;
  posts: {
    slug: string;
    title: string;
    summary?: string;
    readingTime?: number;
  }[];
}

// ── Blog ───────────────────────────────────────────────────────────

/** Returns all non-draft, visible blog posts sorted newest-first. */
export async function getPublishedPosts(): Promise<CollectionEntry<'blog'>[]> {
  const all = await getCollection('blog');
  return all
    .filter((p) => !p.data.draft && p.data.isVisible !== false)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** Maps a raw blog entry to the PostsGrid display shape. */
export function mapPostToDisplay(p: CollectionEntry<'blog'>): PostDisplayItem {
  return {
    slug: p.slug,
    data: {
      title: p.data.title,
      date: p.data.date,
      category: p.data.category,
      summary: p.data.summary,
      readingTime: p.data.readingTime ?? null,
      tags: p.data.tags,
    },
  };
}

/**
 * Resolves the reading time for a content entry.
 * Falls back to a word-count estimate when the remark plugin did not inject it.
 */
export function resolveReadingTime(readingTime: number | undefined, body: string): number {
  return readingTime ?? Math.max(1, Math.ceil(body.trim().split(/\s+/).filter(Boolean).length / WORDS_PER_MINUTE));
}

// ── Shared ─────────────────────────────────────────────────────────

/**
 * Builds a { category: count } map from a flat array of category strings.
 * Always includes 'All' as the total count.
 */
export function countByCategory(categories: string[]): Record<string, number> {
  const counts: Record<string, number> = { All: categories.length };
  for (const cat of categories) {
    counts[cat] = (counts[cat] ?? 0) + 1;
  }
  return counts;
}

// ── Series ─────────────────────────────────────────────────────────

/**
 * Splits the series collection into index entries and post entries.
 * Use this when you need raw entries (e.g. prev/next navigation, OG images).
 */
export async function splitSeriesEntries(): Promise<{
  indexEntries: CollectionEntry<'series'>[];
  postEntries: CollectionEntry<'series'>[];
}> {
  const all = await getCollection('series');
  return {
    indexEntries: all.filter((e) => e.id.endsWith('/index.md')),
    postEntries: all.filter((e) => !e.id.endsWith('/index.md')),
  };
}

/**
 * Returns up to `limit` related posts for a given post.
 * Prefers manually specified slugs from frontmatter; otherwise scores candidates
 * by tag overlap (2 pts each) and same-category match (1 pt), returning the top results.
 */
export function getRelatedPosts(
  post: CollectionEntry<'blog'>,
  allPosts: CollectionEntry<'blog'>[],
  limit = 2,
): CollectionEntry<'blog'>[] {
  if (post.data.relatedPosts.length > 0) {
    return allPosts
      .filter((p) => post.data.relatedPosts.includes(p.slug))
      .slice(0, limit);
  }

  const postTags = new Set(post.data.tags);
  return allPosts
    .filter((p) => p.slug !== post.slug && !p.data.draft)
    .map((p) => {
      const tagScore = p.data.tags.filter((t) => postTags.has(t)).length * 2;
      const catScore = p.data.category === post.data.category ? 1 : 0;
      return { post: p, score: tagScore + catScore };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post: p }) => p);
}

/**
 * Parses the series collection into fully structured SeriesItem objects.
 * Used by the series index page and the series JSON API.
 */
export async function parseSeriesCollection(): Promise<SeriesItem[]> {
  const { indexEntries, postEntries } = await splitSeriesEntries();

  return indexEntries.map((index) => {
    const seriesSlug = index.slug.replace('/index', '');
    const postOrder: string[] = index.data.postOrder ?? [];
    const posts = postOrder.flatMap((postSlug) => {
      const entry = postEntries.find((e) => e.slug === `${seriesSlug}/${postSlug}`);
      if (!entry) return [];
      return [{
        slug: postSlug,
        title: entry.data.title,
        summary: entry.data.summary,
        readingTime: entry.data.readingTime,
      }];
    });
    return {
      seriesSlug,
      title: index.data.title,
      description: index.data.description,
      category: index.data.category,
      posts,
    };
  });
}
