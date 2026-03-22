import type { GetStaticPaths, APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { generateOgImage } from '../../../../lib/og';

export const getStaticPaths: GetStaticPaths = async () => {
  const allEntries = await getCollection('series');
  const indexEntries = allEntries.filter((e) => e.id.endsWith('/index.md'));
  const postEntries = allEntries.filter((e) => !e.id.endsWith('/index.md'));

  return indexEntries.flatMap((index) => {
    const seriesSlug = index.slug.replace('/index', '');
    const postOrder: string[] = index.data.postOrder ?? [];

    return postOrder.flatMap((postSlug) => {
      const entry = postEntries.find((e) => e.slug === `${seriesSlug}/${postSlug}`);
      if (!entry) return [];
      return [{
        params: { seriesSlug, postSlug },
        props: {
          title: entry.data.title,
          category: entry.data.category,
          author: entry.data.author,
          readingTime: entry.data.readingTime ?? null,
        },
      }];
    });
  });
};

export const GET: APIRoute = async ({ props }) => {
  const png = await generateOgImage(props as Parameters<typeof generateOgImage>[0]);
  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
