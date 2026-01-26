---
title: 'Week 5 Day 3: Background Jobs - Heavy Lifting'
description: 'Processing videos, PDFs, and reports without blocking the UI. BullMQ and Sidekiq.'
pubDate: 'Oct 08 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week5", "async"]
series: "System Design Roadmap"
---

Users hate waiting.
If a user uploads a 1GB video, you can't transcode it in the HTTP Request loop (Web servers timeout after ~60s).

## The Architecture
1. **API Server**:
   - Accepts Upload.
   - Saves file to S3.
   - Adds "Job" to Redis Queue: `{ type: 'transcode', file: 's3://...', id: 123 }`.
   - Returns "Processing..." to User.
2. **Job Queue (Redis)**: Holds the job.
3. **Worker Server**:
   - Pulls Job.
   - Downloads file, runs ffmpeg.
   - Uploads result, updates DB to "Done".

## Retry Logic
What if the worker crashes while processing?
- The job shouldn't be lost.
- Good queues (BullMQ, Sidekiq) have **Acknowledgements**.
- If worker doesn't say "Done", the job reappears in the queue after X minutes.
- **Dead Letter Queue (DLQ)**: If a job fails 5 times (maybe corrupt file), move it to DLQ so engineers can inspect it.

## Scheduling
"Send a report at 9 AM".
Queues can handle Delayed Jobs. You insert it now with `delay: 10 hours`. Redis holds it until then.

Tomorrow: Designing systems that react to change. **Event-Driven Architecture**. ⚡


---

## Next Step

[**Next: Event Driven Architecture →**](/blog/system-design/week5/week-5-day-4-event-driven-architecture)