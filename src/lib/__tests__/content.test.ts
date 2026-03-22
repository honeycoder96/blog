import { describe, it, expect } from 'vitest';
import { countByCategory, resolveReadingTime, mapPostToDisplay, getRelatedPosts } from '../content';
import type { CollectionEntry } from 'astro:content';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makePost(overrides: Partial<CollectionEntry<'blog'>['data']> & { slug?: string } = {}): CollectionEntry<'blog'> {
  const { slug = 'test/post', ...data } = overrides;
  return {
    slug,
    id: slug,
    body: 'Hello world content here for reading time estimation purposes yes yes yes',
    collection: 'blog',
    data: {
      title: 'Test Post',
      date: '2026-01-01',
      pubDate: new Date('2026-01-01'),
      category: 'Engineering',
      author: 'Test Author',
      summary: 'A summary.',
      featured: false,
      isVisible: true,
      draft: false,
      tags: [],
      relatedPosts: [],
      readingTime: undefined,
      ...data,
    },
  } as unknown as CollectionEntry<'blog'>;
}

// ---------------------------------------------------------------------------
// countByCategory
// ---------------------------------------------------------------------------

describe('countByCategory', () => {
  it('counts per-category and total', () => {
    expect(countByCategory(['Engineering', 'Engineering', 'DevOps'])).toEqual({
      All: 3,
      Engineering: 2,
      DevOps: 1,
    });
  });

  it('returns { All: 0 } for empty input', () => {
    expect(countByCategory([])).toEqual({ All: 0 });
  });

  it('handles a single category', () => {
    expect(countByCategory(['Design'])).toEqual({ All: 1, Design: 1 });
  });
});

// ---------------------------------------------------------------------------
// resolveReadingTime
// ---------------------------------------------------------------------------

describe('resolveReadingTime', () => {
  it('returns the explicit readingTime when provided', () => {
    expect(resolveReadingTime(7, '')).toBe(7);
  });

  it('estimates 1 minute for exactly 200 words', () => {
    const body = Array(200).fill('word').join(' ');
    expect(resolveReadingTime(undefined, body)).toBe(1);
  });

  it('returns minimum of 1 for very short content', () => {
    expect(resolveReadingTime(undefined, 'short')).toBe(1);
  });

  it('estimates correctly for longer content', () => {
    // 400 words → 2 minutes
    const body = Array(400).fill('word').join(' ');
    expect(resolveReadingTime(undefined, body)).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// mapPostToDisplay
// ---------------------------------------------------------------------------

describe('mapPostToDisplay', () => {
  it('maps a collection entry to PostDisplayItem shape', () => {
    const post = makePost({ slug: 'eng/my-post', readingTime: 3, tags: ['ts', 'react'] });
    const result = mapPostToDisplay(post);
    expect(result.slug).toBe('eng/my-post');
    expect(result.data.title).toBe('Test Post');
    expect(result.data.readingTime).toBe(3);
    expect(result.data.tags).toEqual(['ts', 'react']);
  });

  it('sets readingTime to null when not provided', () => {
    const post = makePost({ readingTime: undefined });
    expect(mapPostToDisplay(post).data.readingTime).toBeNull();
  });

  it('includes all required display fields', () => {
    const post = makePost({ category: 'DevOps', summary: 'A DevOps post.' });
    const result = mapPostToDisplay(post);
    expect(result.data.category).toBe('DevOps');
    expect(result.data.summary).toBe('A DevOps post.');
  });
});

// ---------------------------------------------------------------------------
// getRelatedPosts
// ---------------------------------------------------------------------------

describe('getRelatedPosts', () => {
  it('uses manual relatedPosts when specified', () => {
    const post = makePost({ slug: 'a', relatedPosts: ['b', 'c'] });
    const all = [post, makePost({ slug: 'b' }), makePost({ slug: 'c' }), makePost({ slug: 'd' })];
    const result = getRelatedPosts(post, all);
    expect(result.map((p) => p.slug)).toEqual(['b', 'c']);
  });

  it('scores by tag overlap when no manual relatedPosts', () => {
    const post = makePost({ slug: 'a', tags: ['ts', 'react'] });
    const high = makePost({ slug: 'b', tags: ['ts', 'react'] });    // 4pts (2 shared tags)
    const mid  = makePost({ slug: 'c', tags: ['ts'], category: 'Engineering' }); // 2pts tag + 1pt cat = 3
    const low  = makePost({ slug: 'd', tags: ['css'] });             // 0pts — filtered out
    const all = [post, high, mid, low];
    const result = getRelatedPosts(post, all);
    expect(result[0].slug).toBe('b');
    expect(result).not.toContain(low);
  });

  it('excludes the post itself', () => {
    const post = makePost({ slug: 'a', tags: ['ts'] });
    const other = makePost({ slug: 'b', tags: ['ts'] });
    const result = getRelatedPosts(post, [post, other]);
    expect(result.every((p) => p.slug !== 'a')).toBe(true);
  });

  it('excludes draft posts', () => {
    const post = makePost({ slug: 'a', tags: ['ts'] });
    const draft = makePost({ slug: 'b', tags: ['ts'], draft: true });
    const result = getRelatedPosts(post, [post, draft]);
    expect(result).toHaveLength(0);
  });

  it('respects the limit parameter', () => {
    const post = makePost({ slug: 'a', tags: ['ts'] });
    const others = ['b', 'c', 'd'].map((slug) => makePost({ slug, tags: ['ts'] }));
    const result = getRelatedPosts(post, [post, ...others], 1);
    expect(result).toHaveLength(1);
  });
});
