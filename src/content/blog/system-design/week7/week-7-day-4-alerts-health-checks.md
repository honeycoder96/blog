---
title: 'Week 7 Day 4: Alerts & Health Checks - Wake Up Call'
description: 'Designing meaningful alerts. Liveness vs Readiness probes.'
pubDate: 'Oct 19 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week7", "monitoring"]
series: "System Design Roadmap"
---

Monitoring is useless if nobody looks at it.
**Alerting** notifies a human when things break.

## 1. Health Checks
Your API should expose endpoints for the Load Balancer/Kubernetes.
- **/health/live**: "Am I running?" (If no, restart me).
- **/health/ready**: "Can I accept traffic?" (e.g., Connected to DB? If no, don't send traffic yet).

## 2. Alert Fatigue
If you get 100 emails a day saying "CPU is high", you will ignore them.
**Good Alerts**:
- "Error rate > 5% for 5 minutes". (Actionable: Something is broken).
- "Disk space < 10%". (Actionable: Clean up or expand).

**Bad Alerts**:
- "Server restarted". (Self-healing usually handles this).
- "CPU > 80%". (Maybe it's just busy processing a job. Only alert if stays high).

## 3. PagerDuty
In Enterprise, Critical alerts go to **PagerDuty**.
It calls your phone at 3 AM.
"The website is down. Fix it."

Tomorrow: **Mini Project**. We implement Rate Limiting and Logging middleware! 🛡️


---

## Next Step

[**Next: Mini Project →**](/blog/system-design/week7/week-7-day-5-mini-project)