---
title: 'Week 8 Day 3: Case Study - Designing YouTube'
description: 'Video processing, CDN optimization, and Adaptive Bitrate Streaming.'
pubDate: 'Oct 23 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week8", "interview", "case-study"]
series: "System Design Roadmap"
---

**Problem**: Design a Video Streaming Service.
**Scale**: 1B Users. 500 hours of video uploaded per minute.

## 1. The Core Problem: Processing & Storage
Raw video is huge. We can't just save it. We must **Transcode** it.

## 2. Upload Flow
1. User uploads raw video -> S3 (Temp bucket).
2. API triggers **Video Processing Service** (Job Queue).
3. Service splits video into chunks (GOP).
4. Transcodes chunks into multiple resolutions (360p, 720p, 1080p, 4K) and codecs (H.264, VP9).
5. Saves processed chunks to S3 (Final bucket).

## 3. Streaming Flow (Adaptive Bitrate)
- We use **HLS** or **DASH** protocols.
- The player downloads a "Manifest" file acting as a menu.
- Player detects bandwidth.
  - Internet fast? Download 4K chunk.
  - Internet slow? Download 360p chunk.
- **CDN is critical**: All chunks cached at the edge. S3 is only the "Origin".

## 4. Data Model
- **Metadata DB (Postgres/Cassandra)**: Title, Description, Like count.
- **Blob Storage (S3)**: Video files, Thumbnails.

Tomorrow: **The Mock Interview**. I'll walk you through a full scenario. ♟️


---

## Next Step

[**Next: Interview Walkthrough →**](/blog/system-design/week8/week-8-day-4-interview-walkthrough)