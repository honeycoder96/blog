---
title: 'Week 1 Day 1: What is System Design? - The Big Picture'
description: 'Why do we need system design? Understanding scalability, reliability, and maintainability.'
pubDate: 'Sep 16 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week1", "foundations"]
series: "System Design Roadmap"
---

Welcome to **Week 1** of your System Design journey! 🚀

## What is System Design?
System Design is the process of defining the architecture, components, modules, interfaces, and data for a system to satisfy specified requirements.

It's not just about "making it work". It's about making it work **at scale**, **reliably**, and **efficiently**.

## The Three Pillars
When designing large systems, we care about three main things:

### 1. Scalability
Can the system handle growth?
- If users grow from 100 to 100 million, will the site crash?
- **Vertical Scaling**: Buying a bigger server (more RAM, CPU).
- **Horizontal Scaling**: Adding more servers (cluster).

### 2. Reliability
Does the system work correctly, even when things go wrong?
- Hardware fails, networks timeout, bugs happen.
- A reliable system is **fault-tolerant**. It continues to function (perhaps with reduced features) rather than collapsing entirely.

### 3. Maintainability
Is it easy for engineers to work on?
- Clean code, good documentation, automated testing.
- If it takes 2 weeks to add a simple button, the system is not maintainable.

## Real World Example: Designing a URL Shortener (Like Bit.ly)
Imagine you need to store 1 billion URLs.
- **Storage**: How much disk space? (1 billion * 100 bytes = 100GB). Easy.
- **Traffic**: If 1 million users click links every second, a single server will melt. You need a **Load Balancer**.
- **Latency**: Users want instant redirects. You need a **Cache** (Redis).

For the next 8 weeks, we will learn every single component needed to build this.

## Homework
Take a look at a website you use daily (e.g., Twitter). Try to guess:
- Where do they store tweets? (Database)
- Where do they store images? (Object Storage like S3)
- How do they show you a feed? (Algorithms + Cache)

See you on **Day 2**, where we explore the **Client-Server Model**! 💻


---

## Next Step

[**Next: The Client Server Model →**](/blog/system-design/week1/week-1-day-2-the-client-server-model)