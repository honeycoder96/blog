---
title: 'Week 6 Day 2: Service Communication - APIs & RPC'
description: 'REST vs gRPC vs GraphQL. How microservices talk.'
pubDate: 'Oct 12 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week6", "microservices"]
series: "System Design Roadmap"
---

In a Monolith, you call `userService.getUser(id)`.
In Microservices, you make a network request.

## 1. REST (JSON over HTTP)
- **Format**: JSON text. Human readable.
- **Pros**: Standard, easy to debug, works in browser.
- **Cons**: Slow (Filesize large, parsing text is slow).

## 2. gRPC (Protocol Buffers)
- **Format**: Binary. Not human readable.
- **Pros**: Extremely fast (smaller payload), Type-Safe (generates code).
- **Cons**: Harder to debug, browser support is limited (needs proxy).
- **Use Case**: Internal service-to-service communication.

## 3. GraphQL
- **Format**: Query Language.
- **Pros**: Client fetches exactly what it needs (No over-fetching).
- **Cons**: Complexity on server side.
- **Use Case**: Public API for Frontends.

## 4. Sync vs Async
- **Sync (Request/Response)**: "I need user data *now*." (User waits).
- **Async (Events)**: "User signed up. Do whatever you need to." (Fire and forget).

Tomorrow: Who controls traffic to all these services? **API Gateway**. 🚪


---

## Next Step

[**Next: Api Gateway →**](/blog/system-design/week6/week-6-day-3-api-gateway)