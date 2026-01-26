---
title: 'High Availability: Mastering Replica Sets'
description: 'Sleep well knowing your database handles failures automatically. We explore the internals of MongoDB Replication and automatic failover.'
pubDate: 'Aug 27 2025'
heroImage: 
  src: '/blog-placeholder-1.jpg'
  alt: 'Replica Sets'
tags: ["mongodb", "scaling", "replication"]
series: "MongoDB Roadmap"
---

Welcome to **Week 6**! 🚀
This is the final leg of our journey: **Scaling**.

Your apps will grow. Your servers will crash.
How do you ensure 100% uptime? **Replication**.

## 1. How Replication Works

A Replica Set is usually 3 nodes:
1.  **Primary**: Accepts Writes and Reads.
2.  **Secondary A**: Copies data from Primary (OpLog).
3.  **Secondary B**: Copies data from Primary (OpLog).

Data flows asynchronously. The Primary doesn't wait for Secondaries to acknowledge the write (unless you use `w: "majority"`).

## 2. Automatic Failover 🚑

If the Primary crashes (or the network cable is cut):
1.  The Secondaries notice "Hey, the Primary is silent!".
2.  They hold an **Election**.
3.  The node with the most up-to-date data becomes the **New Primary**.
4.  Your app (using the MongoDB driver) automatically detects the new Primary and redirects traffic.

**Downtime?** usually 2-10 seconds.

## 3. Read Preference 📖

By default, all reads go to the **Primary** (Consistency > Latency).
But you can scale reads by reading from Secondaries.

```javascript
// Mongoose
const schema = new Schema({ ... }, { read: 'secondaryPreferred' });
```

**Modes:**
- `primary`: (Default). Strong consistency.
- `primaryPreferred`: Read primary, unless it's down.
- `secondary`: Read only from secondaries (Eventual Consistency).
- `nearest`: Read from the lowest latency node (Primary or Secondary).

## 4. Write Concern ✍️

How "safe" do you want your writes to be?

- `w: 1` (Default): Acknowledged by Primary.
- `w: 0`: Fire and forget (Fastest, risky).
- `w: "majority"`: Acknowledged by >50% of the nodes. (Safest).

```javascript
db.users.insertOne(
  { name: "Alice" },
  { writeConcern: { w: "majority", wtimeout: 5000 } }
)
```
*Use `w: "majority"` for financial data to prevent data rollbacks during failover.*

---

### 🧠 Daily Challenge
1. If you have Docker, spin up 3 mongo containers.
2. Configure them as a Replica Set (`rs.initiate()`).
3. Kill the Primary container (`docker stop mongo1`).
4. Watch `mongo2` or `mongo3` become the Primary!

See you on **Day 2** for the big one: **Sharding**! 🌐


---

## Next Step

[**Next: Sharding Concepts →**](/blog/mongodb/week-6-day-2-sharding-concepts)