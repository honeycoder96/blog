---
title: 'Week 6 Day 3: API Gateway - The Front Door'
description: 'Routing, Auth, and Rate Limiting centrally. Zuul, Kong, and AWS API Gateway.'
pubDate: 'Oct 13 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week6", "microservices"]
series: "System Design Roadmap"
---

If you have 50 microservices, you don't want the Client (Mobile App) to know 50 IP addresses.
Client sends ALL requests to **API Gateway**.

## 1. Responsibilities
1. **Routing**: `GET /users` -> User Service. `POST /orders` -> Order Service.
2. **Authentication**: Check JWT Token *once* here. Don't implement Auth in every service.
3. **Rate Limiting**: Block spam requests here.
4. **SSL Termination**: Decrypt HTTPS here.

## 2. Pattern: Backend for Frontend (BFF)
Create specific Gateways for specific clients.
- Mobile Gateway: Strips out heavy data.
- Desktop Gateway: Full data.
- Public API Gateway: Rate limited.

## 3. Tools
- **Kong**: Open source, Lua based.
- **AWS API Gateway**: Managed, serverless.
- **Zuul**: Netflix's gateway (Java).

Tomorrow: How does the Gateway know where "User Service" is living? **Service Discovery**. 🗺️


---

## Next Step

[**Next: Service Discovery →**](/blog/system-design/week6/week-6-day-4-service-discovery)