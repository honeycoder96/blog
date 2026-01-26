---
title: 'Week 6 Day 4: Service Discovery - Where are you?'
description: 'Dynamic IP management with Consul and Eureka. Client-side vs Server-side discovery.'
pubDate: 'Oct 14 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week6", "microservices"]
series: "System Design Roadmap"
---

In modern cloud (Kubernetes), services restart often. Their IP addresses change dynamically.
Hardcoding IPs in `.env` files doesn't work.

## 1. The Service Registry
A database of active services.
- User Service starts -> Registers: "I am 'user-service' at 10.0.0.5".
- User Service dies -> Registry removes it (after missed heartbeat).

## 2. Discovery Patterns
### A. Client-Side Discovery
Client asks Registry: "Where is user-service?"
Registry returns "10.0.0.5".
Client calls 10.0.0.5.
(e.g., Netflix Eureka).

### B. Server-Side Discovery
Client calls Load Balancer: "Call user-service".
LB asks Registry and forwards request.
(e.g., AWS Elastic Load Balancer + Kubernetes DNS).

## 3. Technology
- **Consul**: Service mesh & discovery.
- **Etcd**: Key-value store used by Kubernetes.
- **Zookeeper**: Old school, reliable.

Tomorrow: **Mini Project**. We build 2 microservices communicating! 🧱


---

## Next Step

[**Next: Mini Project →**](/blog/system-design/week6/week-6-day-5-mini-project)