/**
 * Static JSON API — paginated post listings.
 *
 * Generates one JSON file per category × page at build time:
 *   /api/posts/all/1.json
 *   /api/posts/all/2.json
 *   /api/posts/engineering/1.json
 *   /api/posts/deep-dive/1.json
 *   ... etc.
 *
 * PostsGrid fetches these on demand instead of receiving the full list as props.
 * URLs on /blog never change — this is purely a data-loading optimization.
 */

import type { GetStaticPaths, APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { slugifyCategory } from '../../../../config/categories';

const PAGE_SIZE = 10;

export interface PostsPagePayload {
  posts: {
    slug: string;
    data: {
      title: string;
      date: string;
      category: string;
      summary: string;
      readingTime: number | null;
      tags: string[];
    };
  }[];
  total: number;
  totalPages: number;
  page: number;
  category: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allPosts = await getCollection('blog');

  const posts = allPosts
    .filter((p) => p.data.isVisible !== false)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .map((p) => ({
      slug: p.slug,
      data: {
        title: p.data.title,
        date: p.data.date,
        category: p.data.category,
        summary: p.data.summary,
        readingTime: p.data.readingTime ?? null,
        tags: p.data.tags,
      },
    }));

  const uniqueCategories = [...new Set(posts.map((p) => p.data.category))];

  // One group for "all posts" + one group per category
  const groups: Array<{ slug: string; label: string; items: typeof posts }> = [
    { slug: 'all', label: 'All', items: posts },
    ...uniqueCategories.map((cat) => ({
      slug: slugifyCategory(cat),
      label: cat,
      items: posts.filter((p) => p.data.category === cat),
    })),
  ];

  const paths = [];

  for (const group of groups) {
    const totalPages = Math.max(1, Math.ceil(group.items.length / PAGE_SIZE));
    for (let page = 1; page <= totalPages; page++) {
      const payload: PostsPagePayload = {
        posts: group.items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
        total: group.items.length,
        totalPages,
        page,
        category: group.label,
      };
      paths.push({
        params: { category: group.slug, page: String(page) },
        props: payload,
      });
    }
  }

  return paths;
};

export const GET: APIRoute = ({ props }) => {
  return new Response(JSON.stringify(props as PostsPagePayload), {
    headers: {
      'Content-Type': 'application/json',
      // #10 — content-addressed static files; safe to cache at edge indefinitely
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
