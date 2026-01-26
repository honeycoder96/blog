---
title: 'Week 8 Day 4: Interview Walkthrough - Design a Notification Service'
description: 'A step-by-step transcript of what a System Design interview looks like.'
pubDate: 'Oct 24 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week8", "interview"]
series: "System Design Roadmap"
---

**Interviewer (I)**: "Design a notification service that sends Emails and Push Notifications."

## Phase 1: Clarify
**You**: "Is this real-time? How many notifications?"
**I**: "Real-time. 10M notifications/day."
**You**: "Do we need retry logic?"
**I**: "Yes."

## Phase 2: High Level
**You**: "I propose:
1. **Notification Service**: Accepts request.
2. **Message Queue (Kafka)**: Decouples intake from sending.
3. **Workers**: Email Worker, Push Worker.
4. **Third Party integrations**: SendGrid (Email), APNS/FCM (Push)."

**I**: "Looks good. How do you prevent duplicate emails?"

## Phase 3: Deep Dive (Deduplication)
**You**: "We need a Distributed Lock or a Dedup Cache.
Before adding to Queue, we check Redis: `SET notification:{userId}:{type} NX EX 60`.
If it exists, we drop the request. This prevents spamming the user within 60s."

**I**: "What if SendGrid is down?"
**You**: "The Worker catches the error. It places the job into a **Retry Queue** with exponential backoff (retry in 1m, 2m, 4m)."

## Phase 4: Wrap Up
**You**: "To monitor, we track 'Delivery Rate' and 'Queue Lag' in Grafana."

**I**: "Great job."

Tomorrow: **Final Project**. A real-time chat app! 💬


---

## Next Step

[**Next: Mini Project →**](/blog/system-design/week8/week-8-day-5-mini-project)