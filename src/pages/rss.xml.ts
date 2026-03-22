import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { siteConfig } from '../config/site';

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
    title: siteConfig.rss.title,
    description: siteConfig.rss.description,
    site: context.site!,
    items,
    customData: `<language>en-us</language>`,
  });
}
