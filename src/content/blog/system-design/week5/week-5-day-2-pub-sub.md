---
title: 'Week 5 Day 2: Pub/Sub - Fan-out Architecture'
description: 'Publish once, Subscribe many times. Kafka and SNS patterns.'
pubDate: 'Oct 07 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week5", "async"]
series: "System Design Roadmap"
---

In a **Message Queue** (Point-to-Point), one message is processed by **one** worker.
In **Pub/Sub** (Publish/Subscribe), one message is processed by **many** subscribers.

## Scenario: New Order Placed
When an order is placed, we need to:
1. Deduct Inventory.
2. Notify Warehouse.
3. Send Email Receipt.
4. Update Analytics Dashboard.

We create a **Topic** called `order_created`.
The "Order Service" publishes a message to this topic.
- **Subscriber 1 (Inventory)**: Listens and updates stock.
- **Subscriber 2 (Warehouse)**: Listens and prints shipping label.
- **Subscriber 3 (Email)**: Listens and sends email.

## Filtering
Subscribers can choose what they want to hear.
- Analytics Service might listen to `order_*` (Created, Cancelled, Shipped).
- Email Service might listen only to `order_shipped`.

## Tech Stack
- **Kafka**: Uses partitioned logs/consumer groups for massive scale.
- **Redis Pub/Sub**: Fast, fire-and-forget (delivery not guaranteed).
- **Google Pub/Sub**: Managed, global.

Tomorrow: Handling long-running tasks like Video Processing. **Background Jobs**. 🏋️


---

## Next Step

[**Next: Background Jobs →**](/blog/system-design/week5/week-5-day-3-background-jobs)