---
title: 'Week 7 Day 2: Rate Limiting & Throttling - Traffic Control'
description: 'Token Bucket, Leaky Bucket. Preventing DDoS and abuse.'
pubDate: 'Oct 17 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week7", "security"]
series: "System Design Roadmap"
---

If you allow unlimited requests, a script can send 10,000 requests/sec and crash your DB.
You need **Rate Limiting**: "You can make 10 requests per minute."

## 1. Algorithms
### A. Token Bucket (Most Common)
- A bucket holds 10 tokens.
- Add 1 token every second.
- To make a request, user must take a token.
- If bucket empty, request rejected (429 Too Many Requests).
- **Allows bursting**: If you wait 10s, you can make 10 fast requests.

### B. Leaky Bucket
- A queue processes requests at a constant rate.
- If queue full, incoming requests spill over (discarded).
- **Smooths out traffic**: Good for stable outflow (e.g., writing to DB).

### C. Fixed Window
- "10 requests between 10:00 and 10:01".
- Issue: Spike at 10:00:59 and 10:01:00 allows 20 requests rapidly.

## 2. Distributed Rate Limiting
If you have 10 servers, you need a shared counter.
**Redis** is perfect for this.
`INCR user:123:requests`. `EXPIRE 60s`.

## 3. Throttling
Rate Limiting = "Stop abuse".
Throttling = "Degrade service".
Instead of error 429, you might just delay the response or serve a lower quality video.

Tomorrow: How do you know if your server is dying? **Logging & Monitoring**. 📊


---

## Next Step

[**Next: Logging Monitoring →**](/blog/system-design/week7/week-7-day-3-logging-monitoring)