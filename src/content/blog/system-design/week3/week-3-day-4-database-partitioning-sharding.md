---
title: 'Week 3 Day 4: Database Partitioning (Sharding) - Breaking it Up'
description: 'Handling massive datasets by splitting them across servers. Horizontal Scaling for DBs.'
pubDate: 'Sep 29 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week3", "databases"]
series: "System Design Roadmap"
---

Replication scales Reads. **Sharding** scales Writes and Storage.
Sharding = Horizontal Partitioning.

## 1. Vertical Partitioning
Split by feature.
- User DB
- Product DB
- Payment DB
Easy to do, but each DB can still get too big.

## 2. Horizontal Partitioning (Sharding)
Split the *same table* into chunks.
- Users ID 1-1M -> Server A.
- Users ID 1M-2M -> Server B.

## 3. Sharding Strategies
- **Range Based**: (A-M on Server 1, N-Z on Server 2).
  - Issue: uneven load if everyone is named "Smith".
- **Hash Based**: `hash(UserID) % NumberOfServers`.
  - Even distribution.
  - Issue: Resharding is painful (Consistent Hashing helps).
- **Directory Based**: Custom lookup table.

## 4. The Pain of Sharding
- **Joins are impossible**: You can't join tables across servers.
- **Transactions limited**: Two-Phase Commit is slow.
- **Operational complexity**: Backups become a nightmare.

Use Sharding as a **last resort**. Try caching and read-replicas first.

Tomorrow: **Caching**. The secret to blazing fast systems! ⚡


---

## Next Step

[**Next: Mini Project →**](/blog/system-design/week3/week-3-day-5-mini-project)