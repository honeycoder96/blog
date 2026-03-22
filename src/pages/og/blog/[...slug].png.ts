import type { GetStaticPaths, APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { generateOgImage } from '../../../lib/og';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('blog');
  return posts
    .filter((p) => !p.data.draft && p.data.isVisible !== false)
    .map((p) => ({
      params: { slug: p.slug },
      props: {
        title: p.data.title,
        category: p.data.category,
        author: p.data.author,
        readingTime: p.data.readingTime ?? null,
      },
    }));
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
