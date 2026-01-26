---
title: 'Week 3 Day 2: The CAP Theorem - You Can’t Have It All'
description: 'Consistency, Availability, Partition Tolerance. Pick two.'
pubDate: 'Sep 27 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week3", "databases"]
series: "System Design Roadmap"
---

In a distributed system, things break. The Network fails.
The **CAP Theorem** states that in the event of a network failure (Partition), you must choose between:
**Consistency** (C) OR **Availability** (A).

## 1. The Three Letters
- **Consistency (C)**: Every read receives the most recent write or an error. (All nodes see same data).
- **Availability (A)**: Every request receives a (non-error) response, without the guarantee that it contains the most recent write.
- **Partition Tolerance (P)**: The system continues to operate despite an arbitrary number of messages being dropped or delayed by the network.

## 2. P is Mandatory
Since networks *will* fail, you cannot choose to not have P.
So the real choice is **CP vs AP**.

## 3. CP Architectures (Consistency > Availability)
**Example**: Banking System.
- If a network cut separates the ATM from the Bank Server, the ATM should **stop working** (Reject card) rather than letting you withdraw money that hasn't been deducted.
- **Tech**: PostgreSQL, MongoDB (Default).

## 4. AP Architectures (Availability > Consistency)
**Example**: Facebook Feed.
- If a server in Asia is disconnected from US, users in Asia can still see posts (even if they are 5 minutes old). Better to show *something* than an error.
- **Tech**: Cassandra, DynamoDB.

## 5. PACELC
An extension of CAP.
"Else (E), when there is no partition, choose between Latency (L) and Consistency (C)."
- **DynamoDB**: Tunable consistency. You can choose to be CP or AP per query.

Tomorrow: How do we keep data safe and readable? **Replication**. 👯


---

## Next Step

[**Next: Database Replication →**](/blog/system-design/week3/week-3-day-3-database-replication)