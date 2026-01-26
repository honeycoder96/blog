---
title: 'Week 2 Day 4: CDNs - The Global Cache'
description: 'Content Delivery Networks. Storing your content closer to your users.'
pubDate: 'Sep 24 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week2", "scalability"]
series: "System Design Roadmap"
---

If your server is in New York, a user in Tokyo has to wait 200ms for every request (speed of light limits).
A **Content Delivery Network (CDN)** (Cloudflare, Akamai, AWS CloudFront) solves this.

## 1. How it works
You store your static assets (Images, CSS, JS, Videos) on the CDN.
The CDN has "Edge Servers" in 100+ cities worldwide.

When a Tokyo user asks for `logo.png`:
1. They ask the CDN.
2. The CDN checks its Tokyo server cache.
3. If found (**Hit**): Returns instantly (10ms).
4. If missing (**Miss**): CDN fetches it from your NY server, saves it in Tokyo, and returns it.

## 2. Push vs Pull
- **Pull (Standard)**: CDN fetches content only when a user asks for it. Easy to set up.
- **Push**: You manually upload files to the CDN. Good for large files (Netflix movies).

## 3. Dynamic Content?
CDNs are mostly for **static** content.
However, modern CDNs (like Cloudflare) act as a Reverse Proxy for dynamic content too—protecting you from DDoS attacks and optimizing the TCP connection.

Tomorrow: **Mini Project**. We will simulate a Load Balancer environment! ⚖️


---

## Next Step

[**Next: Mini Project →**](/blog/system-design/week2/week-2-day-5-mini-project)