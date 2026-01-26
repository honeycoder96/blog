---
title: 'Week 5 Day 1: Message Queues - Decoupling Components'
description: 'Stop waiting for APIs. Use Async messaging with Kafka, RabbitMQ, and SQS.'
pubDate: 'Oct 06 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week5", "async"]
series: "System Design Roadmap"
---

When User A registers, you need to:
1. Create DB entry (50ms).
2. Send Welcome Email (2000ms).
3. Update CRM (500ms).

If you do this **Synchronously**, user waits 2.5s.
If Email Service is down, Registration fails.

## Solution: Message Queues
1. User Registers -> Create DB entry (50ms).
2. **Publish Event**: "UserCreated" -> Queue (5ms).
3. Return "Success" to user (Total 55ms).
4. **Worker Service** picks up event from Queue and sends email in background.

## Benefits
- **Decoupling**: The Email service can be down, but registration still works. Messages just pile up in the Queue until it recovers.
- **Traffic Spikes**: If 1M users join at once, the queue acts as a buffer. Workers consume at their own pace.

## Common Technologies
- **RabbitMQ**: Traditional AMQP. Good for complex routing.
- **Kafka**: High throughput log. Good for streaming data.
- **AWS SQS**: Simple, managed, infinite scaling.

Tomorrow: What if multiple services need to hear the same message? **Pub/Sub**. 📢


---

## Next Step

[**Next: Pub Sub →**](/blog/system-design/week5/week-5-day-2-pub-sub)