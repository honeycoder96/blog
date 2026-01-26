---
title: 'Week 4 Day 2: Consensus Protocols - Paxos and Raft'
description: 'How distributed systems agree on the truth. Leader election and log replication.'
pubDate: 'Oct 02 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week4", "consistency"]
series: "System Design Roadmap"
---

Imagine 5 servers. One says "X is 5", the other says "X is 6". Who is right?
They need **Consensus**.

## 1. The Problem: Split Brain
If the network splits, Server A thinks it's the Master. Server B also thinks it's the Master. Both accept conflicting writes. This destroys data integrity.

## 2. Raft Protocol (Simplified)
Raft is designed to be understandable. It has 3 states: Leader, Follower, Candidate.

### Leader Election
1. Everyone starts as a Follower.
2. If they don't hear from a Leader (heartbeat timeout), they become a Candidate.
3. Candidate asks for votes.
4. If it gets a majority (3 out of 5), it becomes Leader.

### Log Replication
1. Leader gets a command ("Set X=5").
2. Leader logs it and sends to Followers.
3. Followers confirm.
4. Once Majority confirms, Leader "Commits" the value.

**Key Rule**: You always need a Majority (Quorum) to proceed. If 2 nodes are cut off, they can't form a majority (2 < 3), so they pause.

## 3. Paxos
The original consensus algorithm (Google Chubby, Spanner).
Mathematically proven, but notoriously hard to implement. Most modern systems (etcd, Consul) use Raft.

## 4. Where is this used?
- **etcd/ZooKeeper**: Config management for clusters (Kubernetes).
- **CockroachDB/TiKV**: Distributed SQL databases.

Tomorrow: The math of Majorities - **Quorums**. ⚖️


---

## Next Step

[**Next: Quorums →**](/blog/system-design/week4/week-4-day-3-quorums)