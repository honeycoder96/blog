---
title: 'Week 7 Day 3: Logging & Monitoring - Eyes on the System'
description: 'ELK Stack, Prometheus, Grafana. Why console.log isn’t enough.'
pubDate: 'Oct 18 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week7", "monitoring"]
series: "System Design Roadmap"
---

When a user says "It's not working", how do you debug it?
You can't SSH into production servers. You need centrally collected data.

## 1. Logging (The "What")
Records individual events.
- "User 123 logged in".
- "Error: DB timeout on query X".
**Tools**:
- **ELK Stack**: ElasticSearch (Store), Logstash (Ingest), Kibana (Visualize).
- **Structured Logging**: Log JSON, not text.
  `{ "level": "error", "userId": 123, "msg": "DB fail" }`. Easier to search.

## 2. Monitoring (The "How")
Records aggregated metrics over time.
- "CPU usage is 80%".
- "Requests per second is 500".
- "P99 Latency is 200ms".
**Tools**:
- **Prometheus**: Scrapes metrics from your app.
- **Grafana**: Beautiful dashboards.

## 3. Tracing (The "Where")
In Microservices, a request hits 10 services.
**Distributed Tracing** (Jaeger / OpenTelemetry) assigns a `TraceID` to the request. You can see the full waterfall:
- API Gateway (10ms) -> Auth Svc (50ms) -> DB (200ms).

Tomorrow: What happens when the CPU hits 99%? **Alerts**. 🚨


---

## Next Step

[**Next: Alerts Health Checks →**](/blog/system-design/week7/week-7-day-4-alerts-health-checks)