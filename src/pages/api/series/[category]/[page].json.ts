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
import { slugifyCategory } from '../../../../config/categories';
import { parseSeriesCollection } from '../../../../lib/content';
import type { SeriesItem } from '../../../../lib/content';
import { IMMUTABLE_CACHE_HEADERS } from '../../../../lib/http';

const PAGE_SIZE = 5;

export interface SeriesPagePayload {
  [key: string]: unknown;
  series: SeriesItem[];
  total: number;
  totalPages: number;
  page: number;
  category: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const allSeries = await parseSeriesCollection();

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
    headers: { 'Content-Type': 'application/json', ...IMMUTABLE_CACHE_HEADERS },
  });
};
