import type { APIRoute } from 'astro';
import { siteConfig } from '../config/site';

export const GET: APIRoute = () => {
  const content = `User-agent: *
Allow: /
Disallow: /og/

# Block AI training crawlers
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: PerplexityBot
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: Amazonbot
Disallow: /

User-agent: FacebookBot
Disallow: /

User-agent: CCBot
Disallow: /

Sitemap: ${siteConfig.siteUrl}/sitemap-index.xml
`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
