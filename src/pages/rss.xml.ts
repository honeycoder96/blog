import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');

  const items = posts
    .filter((p) => p.data.isVisible !== false)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .map((p) => ({
      title: p.data.title,
      pubDate: p.data.pubDate,
      description: p.data.summary,
      link: `/blog/${p.slug}/`,
    }));

  return rss({
    title: 'Honey Sharma — Blog',
    description: 'In-depth writing on web engineering, JavaScript, architecture, and the craft of building software.',
    site: context.site!,
    items,
    customData: `<language>en-us</language>`,
  });
}
