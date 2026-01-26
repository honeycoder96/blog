---
title: 'Breaking Limits: Introduction to Sharding'
description: 'When your data exceeds 10TB or your RAM is full, you need Sharding. We explain the architecture of a sharded cluster.'
pubDate: 'Aug 28 2025'
heroImage: 
  src: '/blog-placeholder-2.jpg'
  alt: 'Sharding Architecture'
tags: ["mongodb", "scaling", "sharding"]
series: "MongoDB Roadmap"
---

Welcome to **Day 2**! 🌐

**Replication** solves High Availability (Read Scaling).
**Sharding** solves Massive Data (Write Scaling + Storage).

If you have 50TB of data, you can't buy a hard drive big enough.
You split the data across 5 servers (10TB each). This is Sharding.

## 1. The Architecture

A Sharded Cluster has 3 components:

1.  **Shard**: A Replica Set containing a subset of the data.
2.  **Config Server**: Stores the roadmap. "Which data lives on which shard?".
3.  **Mongos (Router)**: The doorman. The app connects here. It asks the Config Server where to find data and routes the query.

## 2. The Shard Key 🔑

The most important decision you will make.
MongoDB splits data based on the **Shard Key**.

### Example: Users Collection
If you shard by `zipcode`:
- **Shard A**: Zipcodes 00000-33333
- **Shard B**: Zipcodes 33333-66666
- **Shard C**: Zipcodes 66666-99999

## 3. Good vs Bad Keys

### Bad Key: `createdAt` (Monotonically Increasing)
New users always have the highest date.
All new inserts will hit the **Last Shard**.
**Result**: Hotspot. One shard works 100%, others 0%.

### Bad Key: `gender` (Low Cardinality)
Only 2-3 values. You can have at most 2-3 chunks.
You can't split "Female" into smaller pieces if it grows to 10TB.

### Good Key: `userId` (High Cardinality + Random)
Users are evenly distributed across all shards.
**Result**: Even load balancing.

## 4. Ranged Sharding vs Hashed Sharding

- **Ranged**: Good for range queries (`count users between ID 100 and 200`). But risks hotspots if data isn't random.
- **Hashed**: MongoDB hashes the key. `Hash(1)` might be on Shard A, `Hash(2)` on Shard B.
  - **Pros**: perfect distribution.
  - **Cons**: Range queries are slow (scatter-gather).

---

### 🧠 Daily Challenge
Think about your current app.
If you had to shard your biggest collection, what key would you pick?
- `_id`? (Hashed)
- `tenantId`? (If building SaaS)
- `country`? (If data privacy laws require it)

See you on **Day 3** for **Horizontal vs Vertical Scaling**! ⚖️


---

## Next Step

[**Next: Sharding In Practice →**](/blog/mongodb/week-6-day-3-sharding-in-practice)