---
title: 'Week 3 Day 1: Relational vs NoSQL - Choosing the Right Database'
description: 'SQL vs NoSQL. When to use Postgres vs MongoDB vs Redis vs Cassandra.'
pubDate: 'Sep 26 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week3", "databases"]
series: "System Design Roadmap"
---

The most common question in system design interviews: "Which database should we use?"
The answer is always: "It depends."

## 1. Relational Databases (SQL)
**Examples**: PostgreSQL, MySQL, SQL Server.
**Structure**: Tables, Rows, Columns. Rigid Schema.
**Pros**:
- **ACID Transactions**: Data is always consistent.
- **Joins**: Powerful queries across tables.
- **Standard**: Everyone knows SQL.

**Use cases**: Financial systems, User Auth, E-commerce inventory.

## 2. NoSQL Databases
**Examples**: MongoDB, Cassandra, DynamoDB, Redis.
**Structure**: Documents, Key-Value, Wide-Column, Graph. Flexible Schema.
**Pros**:
- **Scalability**: Designed to scale horizontally (Sharding involved).
- **Flexibility**: Schema can change easily.
- **Speed**: Optimized for specific access patterns.

**Use cases**: Social Media feeds, Real-time analytics, Catalog data.

## 3. Types of NoSQL
1. **Document (MongoDB)**: Best for content management, catalogs.
2. **Key-Value (Redis)**: Caching, Session management.
3. **Wide-Column (Cassandra)**: Massive write loads (IoT, Chat logs).
4. **Graph (Neo4j)**: Social networks (Friends of friends).

## 4. The Decision Framework
- Need **ACID / Complex Transactions**? -> **SQL**.
- Unstructured data / High Write Throughput? -> **NoSQL**.
- Need fast lookups by ID? -> **Key-Value**.

Tomorrow: The theorem that proves you can't have it all—**CAP Theorem**. 🚫


---

## Next Step

[**Next: The Cap Theorem →**](/blog/system-design/week3/week-3-day-2-the-cap-theorem)