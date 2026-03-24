import type { GetStaticPaths, APIRoute } from 'astro';
import { generateOgImage } from '../../../../lib/og';
import { splitSeriesEntries } from '../../../../lib/content';
import { IMMUTABLE_CACHE_HEADERS } from '../../../../lib/http';

export const getStaticPaths: GetStaticPaths = async () => {
  const { indexEntries, postEntries } = await splitSeriesEntries();

  return indexEntries.flatMap((index) => {
    const seriesSlug = index.slug.replace('/index', '');
    const postOrder: string[] = index.data.postOrder ?? [];

    return postOrder.flatMap((postSlug) => {
      const entry = postEntries.find((e) => e.slug === `${seriesSlug}/${postSlug}`);
      if (!entry) return [];
      return [
        {
          params: { seriesSlug, postSlug },
          props: {
            title: entry.data.title,
            category: entry.data.category,
            author: entry.data.author,
            readingTime: entry.data.readingTime ?? null,
          },
        },
      ];
    });
  });
};

export const GET: APIRoute = async ({ props }) => {
  const png = await generateOgImage(props as Parameters<typeof generateOgImage>[0]);
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', ...IMMUTABLE_CACHE_HEADERS },
  });
};
