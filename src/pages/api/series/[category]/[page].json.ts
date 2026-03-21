/**
 * Static JSON API — paginated series listings.
 *
 * Generates one JSON file per category × page at build time:
 *   /api/series/all/1.json
 *   /api/series/javascript/1.json
 *   ... etc.
 *
 * SeriesAccordion fetches these on demand instead of receiving the full list as props.
 */

import type { GetStaticPaths, APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { slugifyCategory } from '../../../../config/categories';

const PAGE_SIZE = 5;

export interface SeriesPagePayload {
  series: {
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
  }[];
  total: number;
  totalPages: number;
  page: number;
  category: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allEntries = await getCollection('series');
  const indexEntries = allEntries.filter((e) => e.id.endsWith('/index.md'));
  const postEntries = allEntries.filter((e) => !e.id.endsWith('/index.md'));

  const allSeries = indexEntries.map((index) => {
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

  const uniqueCategories = [...new Set(allSeries.map((s) => s.category))];

  const groups: Array<{ slug: string; label: string; items: typeof allSeries }> = [
    { slug: 'all', label: 'All', items: allSeries },
    ...uniqueCategories.map((cat) => ({
      slug: slugifyCategory(cat),
      label: cat,
      items: allSeries.filter((s) => s.category === cat),
    })),
  ];

  const paths = [];

  for (const group of groups) {
    const totalPages = Math.max(1, Math.ceil(group.items.length / PAGE_SIZE));
    for (let page = 1; page <= totalPages; page++) {
      const payload: SeriesPagePayload = {
        series: group.items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
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
  return new Response(JSON.stringify(props as SeriesPagePayload), {
    headers: {
      'Content-Type': 'application/json',
      // #10 — content-addressed static files; safe to cache at edge indefinitely
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
