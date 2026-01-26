---
title: 'Week 8 Day 1: The Design Process - How to Ace Interviews'
description: 'A 4-step framework for solving any system design problem. Clarify, Design, Deep Dive, Wrap Up.'
pubDate: 'Oct 21 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week8", "interview"]
series: "System Design Roadmap"
---

You walk into an interview. The interviewer says: "Design Twitter".
Panic? No. Follow the **4-Step Process**.

## Step 1: Clarify Requirements (5-10 mins)
Don't start coding. Ask questions.
- **Functional**: "Can users post tweets? Retweet? Search?"
- **Non-Functional**: "How many DAU (Daily Active Users)? How fast must the feed load?"
- **Math**: 
  - 100M DAU.
  - 10 tweets/user/day = 1B tweets/day.
  - 1B * 1KB = 1TB Storage/day.

## Step 2: High-Level Design (10-15 mins)
Draw boxes.
- "We need a Load Balancer."
- "We need an App Server (Microservices: Tweet Svc, User Svc)."
- "We need a DB (SQL/NoSQL) and a Cache (Redis)."
- "We need Object Storage (S3) for images."

## Step 3: Deep Dive (15-20 mins)
Pick the hardest part and solve it.
- **Twitter Feed**: "How do we generate the home feed?"
  - Pull Model (Slow) vs Push Model (Fan-out).
  - Discuss Sharding strategy (User ID vs Tweet ID).

## Step 4: Wrap Up (5 mins)
- **Bottlenecks**: "What if the Cache fails?"
- **Monitoring**: "We need Prometheus."
- **Scalability**: "We can add more Read Replicas."

Tomorrow: Applying this process to **Twitter**. 🐦


---

## Next Step

[**Next: Case Study →**](/blog/system-design/week8/week-8-day-2-case-study)