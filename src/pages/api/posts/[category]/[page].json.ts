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
import { slugifyCategory } from '../../../../config/categories';
import { getPublishedPosts, mapPostToDisplay } from '../../../../lib/content';
import type { PostDisplayItem } from '../../../../lib/content';
import { IMMUTABLE_CACHE_HEADERS } from '../../../../lib/http';

const PAGE_SIZE = 10;

export interface PostsPagePayload {
  [key: string]: unknown;
  posts: PostDisplayItem[];
  total: number;
  totalPages: number;
  page: number;
  category: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = (await getPublishedPosts()).map(mapPostToDisplay);

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
    headers: { 'Content-Type': 'application/json', ...IMMUTABLE_CACHE_HEADERS },
  });
};
