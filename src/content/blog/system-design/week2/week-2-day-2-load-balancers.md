---
title: 'Week 2 Day 2: Load Balancers - The Traffic Cops'
description: 'Distributing traffic efficiently. Algorithms like Round Robin, Least Connections, and IP Hashing.'
pubDate: 'Sep 22 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week2", "scalability"]
series: "System Design Roadmap"
---

When you Scale Horizontally (Day 1), you have multiple servers (S1, S2, S3).
If a user requests `google.com`, which server should respond?

A **Load Balancer (LB)** sits between the client and servers. It forwards the request to the best available server.

## 1. Types of Load Balancers
1. **L4 (Transport Layer)**: Distributes based on IP addresses and TCP ports. Very fast, dumb.
2. **L7 (Application Layer)**: Distributes based on URL, Headers, Cookies. Smarter but slower. (e.g., Send `/images` to image servers).

## 2. Algorithms (How to choose?)
- **Round Robin**: S1, S2, S3, S1, S2... (Simple, fair if servers are equal).
- **Least Connections**: Send to the server with fewest active users. (Good for long tasks).
- **IP Hash**: The user's IP determines the server. (Good if you need the user to "stick" to one server for sessions).

## 3. Health Checks
The LB asks every server every 5 seconds: "Are you alive?"
If S2 doesn't reply (200 OK), the LB stops sending traffic there.
**Self-Healing**: When S2 comes back/restarts, the LB adds it back.

## 4. Software vs Hardware
- **Hardware**: F5 Big-IP (Expensive, Enterprise).
- **Software**: Nginx, HAProxy (Free, Standard).
- **Cloud**: AWS ELB (Elastic Load Balancer).

Tomorrow: We look at **Reverse Proxies**—which are basically Load Balancers plus security + caching! 🛡️


---

## Next Step

[**Next: Reverse Proxies →**](/blog/system-design/week2/week-2-day-3-reverse-proxies)