---
title: 'Week 4 Day 1: Consistency Models - Strong vs Eventual'
description: 'Understanding the trade-offs between data accuracy and system speed. Strong, Eventual, and Causal consistency.'
pubDate: 'Oct 01 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week4", "consistency"]
series: "System Design Roadmap"
---

When you have multiple replicas of a database, how do you ensure they all agree?
There is a spectrum of **Consistency Models**.

## 1. Strong Consistency (Linearizability)
**Definition**: Once a write is confirmed, ALL subsequent reads see that write.
**How**: When you write to Master, it updates all Slaves *before* returning success.
**Pros**: Easy to program (works like a single machine).
**Cons**: Slow / High Latency. If one slave is down, the Write fails.

**Use Case**: Bank Balances.

## 2. Eventual Consistency
**Definition**: If no new updates are made, eventually all accesses will return the last updated value.
**How**: Update Master, return success immediately. Replicate in background.
**Pros**: Single-digit ms latency. Highly Available.
**Cons**: User A might see "New Post" while User B doesn't see it yet.

**Use Case**: Social Media Likes, comments.

## 3. Causal Consistency
**Definition**: Writes that are causally related must be seen by all processes in the same order.
**Scenario**:
- User A posts: "I love cats". (Write 1)
- User B replies: "Me too". (Write 2)
- User C should never see "Me too" before "I love cats".

## 4. Tuning Consistency (DynamoDB)
You can choose per-request!
`Read(Consistent=True)` -> Slower, costs 2x.
`Read(Consistent=False)` -> Faster, might be stale.

Tomorrow: How do distributed machines agree on a value? **Consensus Protocols**. 🤝


---

## Next Step

[**Next: Consensus Protocols →**](/blog/system-design/week4/week-4-day-2-consensus-protocols)