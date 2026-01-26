---
title: 'Week 2 Day 1: Vertical vs Horizontal Scaling - Growing Up vs Out'
description: 'The two main strategies to handle more traffic. When to upgrade a server vs adding more servers.'
pubDate: 'Sep 21 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week2", "scalability"]
series: "System Design Roadmap"
---

Your URL Shortener from Week 1 is getting popular.
It crashes when 100 people use it at once. What do you do?

## 1. Vertical Scaling (Scale Up)
**Concept**: Buy a bigger, stronger server.
- Upgrade RAM (4GB -> 64GB)
- Upgrade CPU (2 Cores -> 32 Cores)

### Pros
- **Simple**: No code changes needed. Just move the app to a new machine.
- **Data Consistency**: Everything is on one machine, so no synchronization needed.

### Cons
- **Limited Limit**: You can't upgrade forever. 128TB RAM servers exist but cost $$$.
- **Single Point of Failure**: If that one big server crashes, you are offline.

## 2. Horizontal Scaling (Scale Out)
**Concept**: Buy many small, cheap servers and distribute the load.
- Instead of 1 machine with 64GB RAM, use 16 machines with 4GB RAM each.

### Pros
- **Unlimited limit**: Need more power? Just add 10 more servers.
- **Resilient**: If one server dies, the others keep working.

### Cons
- **Complexity**: You need a **Load Balancer** to split traffic.
- **Data Consistency**: Data on Server A is not automatically on Server B. You need shared databases (DB scaling is hard, see Week 3).

## 3. Which one to choose?
- **Small DB / Early Stage**: Scale Vertically first. It's cheaper in engineering time.
- **Huge Traffic / Big Tech**: Scale Horizontally. It's the only way to reach millions of users.

Tomorrow: How do we actually split the traffic? Enter the **Load Balancer**. ⚖️


---

## Next Step

[**Next: Load Balancers →**](/blog/system-design/week2/week-2-day-2-load-balancers)