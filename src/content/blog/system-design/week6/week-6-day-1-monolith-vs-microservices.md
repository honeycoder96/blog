---
title: 'Week 6 Day 1: Monolith vs Microservices - To Split or Not?'
description: 'The biggest debate in architecture. Benefits and pitfalls of distributed services.'
pubDate: 'Oct 11 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week6", "microservices"]
series: "System Design Roadmap"
---

Should you build one big app or 10 small ones?

## 1. Monolith
One codebase. One server deployment. One database (usually).
**Pros**:
- **Simple**: Easy to develop, test, and deploy.
- **Fast**: Function calls are faster than network calls.
**Cons**:
- **Scaling Limit**: To scale the checkout function, you must clone the entire app (with Search, Profile, etc).
- **Fragile**: A memory leak in "Image Upload" kills the whole server.

## 2. Microservices
Break the app into small, independent services (User Svc, Order Svc, Product Svc).
**Pros**:
- **Independent Scaling**: Scale "Order Svc" to 100 nodes, keep "Profile Svc" at 2 nodes.
- **Resilient**: If Image Svc crashes, users can still checkout.
- **Tech Stack Freedom**: Write Search in Python, API in Node, Analytics in Go.

**Cons**:
- **Complexity**: Monitoring, Logging, and Testing become nightmares.
- **Network Latency**: Services talk over network (slow).

## 3. When to use what?
- **Startups**: Use Monolith. "Don't pay the Microservice Tax until you have to."
- **Enterprise**: Microservices (when team > 50 engineers).

Tomorrow: How do these services talk to each other? **gRPC vs REST**. 🗣️


---

## Next Step

[**Next: Service Communication →**](/blog/system-design/week6/week-6-day-2-service-communication)