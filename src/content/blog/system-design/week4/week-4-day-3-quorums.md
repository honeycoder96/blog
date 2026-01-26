---
title: 'Week 4 Day 3: Quorums - The Majority Rules'
description: 'Configuring R + W > N to guarantee consistency in leaderless systems.'
pubDate: 'Oct 03 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week4", "consistency"]
series: "System Design Roadmap"
---

In Leaderless databases (like Cassandra/Dynamo), any node can accept a write.
How do we ensure we read the latest data?

## The Formula: R + W > N
- **N**: Number of replicas (e.g., 3).
- **W**: Write Quorum (How many nodes must confirm write).
- **R**: Read Quorum (How many nodes must return data).

If $R + W > N$, you are guaranteed to see the latest write.

### Example: N=3, W=2, R=2
- Write to Node A, Node B (Success). Node C is old.
- Read from any 2 nodes:
  - {A, B} -> Both new.
  - {A, C} -> A is new, C is old. DB compares timestamps and returns A.
  - {B, C} -> B is new, C is old. DB returns B.
- **Overlap ensures consistency.**

### Tunable Consistency
1. **Fast Write**: $W=1, R=3$. (Risk: Read might miss).
2. **Fast Read**: $W=3, R=1$. (Risk: Write slow).
3. **Balanced**: $W=2, R=2$. (Strong consistency).

## Sloppy Quorum (Hinted Handoff)
If Node A is down, write to Node D temporarly (with a note "Give this to A later").
This keeps availability high (AP system) but breaks strong consistency.

Tomorrow: **Availability**. Measuring 99.999% uptime. ⏱️


---

## Next Step

[**Next: Availability Reliability →**](/blog/system-design/week4/week-4-day-4-availability-reliability)