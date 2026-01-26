---
title: 'Week 4 Day 4: Availability & Reliability - The Nines'
description: 'What is 99.999% uptime? Difference between Fault Tolerance and High Availability.'
pubDate: 'Oct 04 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week4", "reliability"]
series: "System Design Roadmap"
---

We want our system to be "Up" all the time. But what does that mean?

## 1. Reliability vs Availability
- **Reliability**: "Does the system do the right thing?" (Bug free, accurate data).
- **Availability**: "Is the system accessible?" (Not 502/503 errors).

## 2. Measuring Availability (The Nines)
- **99% (2 Nines)**: Down 3.65 days/year. (Okay for hobby).
- **99.9% (3 Nines)**: Down 8.7 hours/year. (Good for business).
- **99.99% (4 Nines)**: Down 52 mins/year. (Enterprise).
- **99.999% (5 Nines)**: Down 5 mins/year. (Critical Infrastructure like AWS S3).

## 3. Achieving HA (High Availability)
The only way to achieve HA is **Redundancy**.
- **No SPOF**: Eliminate Single Points of Failure.
- **Active-Passive**: Main server runs. Hot Standby waits. If Main dies, Standby takes over.
- **Active-Active**: Both servers run. If one dies, usage sends to the other.

## 4. Mean Time (Metrics)
- **MTBF (Mean Time Between Failures)**: How long it runs before crashing. (Target: High).
- **MTTR (Mean Time To Recovery)**: How fast you fix it. (Target: Low).
- Availability = MTBF / (MTBF + MTTR).

**Lesson**: You can improve availability by fixing things faster (Automated restarts), not just preventing crashes.

Tomorrow: **Mini Project**. We implement a Quorum-based store! 🗳️


---

## Next Step

[**Next: Mini Project →**](/blog/system-design/week4/week-4-day-5-mini-project)