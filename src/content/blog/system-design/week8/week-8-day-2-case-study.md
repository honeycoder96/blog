---
title: 'Week 8 Day 2: Case Study - Designing Twitter'
description: 'Handling 100M DAU. Feed Generation, Fan-out Service, and Hybrid Approaches.'
pubDate: 'Oct 22 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week8", "interview", "case-study"]
series: "System Design Roadmap"
---

**Problem**: Design a Twitter Feed.
**Scale**: 100M Daily Active Users.

## 1. The Core Problem: Feeds
User A follows B, C, D. When A opens the app, they see tweets from B, C, D sorted by time.

## 2. Approach 1: Pull Model (Read-Heavy)
- User A opens app.
- Query: `SELECT * FROM tweets WHERE user_id IN (B, C, D) ORDER BY time DESC`.
- **Issue**: If A follows 1000 people, this query is huge and slow.

## 3. Approach 2: Push Model (Write-Heavy)
- User B tweets.
- **Fan-out Service**: Finds all followers of B (User A included).
- Inserts Tweet ID into User A's **Home Feed Cache** (Redis List).
- When A opens app, read from Redis (O(1)).
- **Issue**: Justin Bieber (Celebrity) has 100M followers. Writing to 100M redis lists takes too long.

## 4. Hybrid Approach
- **Normal Users**: Use Push Model.
- **Celebrities**: Use Pull Model.
- When A opens feed:
  1. Fetch pre-computed feed (Push).
  2. Fetch tweets from Celebrities A follows (Pull).
  3. Merge them.

**Storage**:
- Tweets: Cassandra (Write heavy).
- User Profile: MySQL (Consistent).
- Images: S3 + CDN.

Tomorrow: Designing **YouTube**. Streaming 4K video at scale. 📺


---

## Next Step

[**Next: Case Study →**](/blog/system-design/week8/week-8-day-3-case-study)