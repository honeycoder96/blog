import type { GetStaticPaths, APIRoute } from 'astro';
import { generateOgImage } from '../../../lib/og';
import { getPublishedPosts } from '../../../lib/content';
import { IMMUTABLE_CACHE_HEADERS } from '../../../lib/http';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({
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
  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png', ...IMMUTABLE_CACHE_HEADERS },
  });
};
