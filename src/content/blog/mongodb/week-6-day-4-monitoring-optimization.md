---
title: 'The Dashboard: Monitoring MongoDB Performance'
description: 'You can’t improve what you don’t measure. A tour of tools like Mongostat, Mongotop, and Atlas Charts.'
pubDate: 'Aug 30 2025'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: 'Monitoring Dashboard'
tags: ["mongodb", "monitoring", "devops"]
series: "MongoDB Roadmap"
---

Welcome to **Day 4**! 🛠️

Flying a plane without instruments is suicide.
Running a database without monitoring is negligence.

## 1. Built-in CLI Tools

These come installed with MongoDB.

### `mongostat`
Shows a real-time table of database status every second.
- **insert/query/update/delete**: Ops per second.
- **dirty**: % of cache that needs to be written to disk (High = Bad).
- **qr/qw**: Queue Read/Write. If > 0, your DB is overloaded!

### `mongotop`
Shows which **collections** are taking the most time reading/writing.
Great for spotting that one collection that is eating 90% of your resources.

## 2. MongoDB Compass Performance Tab
If you prefer UI, Compass has a "Performance" tab.
It shows live graphs of:
- Operations
- Memory Usage
- Hot Collections

## 3. The Professional Suite: MongoDB Atlas

If you use Atlas, you get:
- **Profiler**: Automatically captures slow queries (>100ms) and suggests indexes.
- **Alerts**: SMS/Email when CPU > 80% or Connections > 1000.
- **Charts**: Visual dashboards for your business metrics (not just server metrics).

## 4. Third-Party Tools

- **Datadog / New Relic**: Great if you want to see your DB metrics alongside your Node.js API metrics.
- **Percona Monitoring and Management (PMM)**: The best free, open-source tool for self-hosted instances.

---

### 🧠 Daily Challenge
1. Open your terminal.
2. Run `mongostat` while running your "Bulk Write" script from Week 4.
3. Watch the `insert` column spike!
4. Run `mongotop` and see your collection name appear at the top.

See you on **Day 5** for the **Grand Finale**: A **Distributed Chat App**! 🎓


---

## Next Step

[**Next: Mini Project Distributed Chat →**](/blog/mongodb/week-6-day-5-mini-project-distributed-chat)