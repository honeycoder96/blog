---
title: 'Week 3 Day 3: Database Replication - Master & Slaves'
description: 'How to scale reads and ensure backup. Master-Slave vs Multi-Master.'
pubDate: 'Sep 28 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week3", "databases"]
series: "System Design Roadmap"
---

A single database server is a Single Point of Failure (SPOF).
**Replication** solves this by keeping copies of data on multiple machines.

## 1. Master-Slave Replication (Leader-Follower)
One **Master** node handles all Writes.
Multiple **Slave** nodes replicate data from Master and handle Reads.

**Pros**:
- Scale Reads massively (add more slaves).
- Backup: If master dies, promote a slave.

**Cons**:
- **Replication Lag**: Slave might be few ms behind Master.
- **Single Master**: If Master goes down, you have downtime until failover.

## 2. Master-Master Replication
Two nodes can accept writes. They sync with each other.

**Pros**:
- High Availability for Writes.

**Cons**:
- **Conflicts**: User A updates name to "Bob" on Node 1. User B updates name to "Alice" on Node 2. Who wins? (Resolution is hard).

## 3. Synchronous vs Asynchronous
- **Sync**: Master waits for Slave to confirm write before telling client "Success".
  - Safe (Zero data loss). Slow.
- **Async**: Master returns "Success" immediately. Replicates in background.
  - Fast. Tiny risk of data loss on crash.

Tomorrow: What if the data is too big for one disk? **Sharding (Partitioning)**. 🍰


---

## Next Step

[**Next: Database Partitioning Sharding →**](/blog/system-design/week3/week-3-day-4-database-partitioning-sharding)