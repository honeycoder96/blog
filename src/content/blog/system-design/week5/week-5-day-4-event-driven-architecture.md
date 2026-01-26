---
title: 'Week 5 Day 4: Event-Driven Architecture - Reacting to Change'
description: 'Moving from Request-Driven to Event-Driven. Choreography vs Orchestration.'
pubDate: 'Oct 09 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week5", "architecture"]
series: "System Design Roadmap"
---

In a Monolith, Service A calls function B.
In Event-Driven, Service A shouts "Something happened!" and B reacts.

## Request-Driven (REST/gRPC)
- Order Svc calls Inventory Svc.
- Inventory Svc calls Shipping Svc.
- **Tight Coupling**: If Shipping is down, Order fails.

## Event-Driven
- Order Svc emits `OrderPlaced`.
- Inventory Svc consumes `OrderPlaced`, emits `InventoryReserved`.
- Shipping Svc consumes `InventoryReserved`, emits `PackageSent`.
- **Loose Coupling**: Services don't know each other exists.

## Choreography vs Orchestration
1. **Choreography**: Dancers knowing their own steps. (Services react to events independently).
   - Hard to visualize the whole flow.
   - Flexible.
2. **Orchestration**: A Conductor (Orchestrator Service) tells everyone what to do.
   - "Inventory, reserve items." -> "Done".
   - "Shipping, ship items." -> "Done".
   - Easier to debug.

## Pros & Cons
- **Pros**: Scalable, Resilient, Easy to add new features.
- **Cons**: Complexity. Hard to debug "Why didn't the shipping happen?" (Traceability).

Tomorrow: **Mini Project**. We build a robust Job Queue system! 👷


---

## Next Step

[**Next: Mini Project →**](/blog/system-design/week5/week-5-day-5-mini-project)