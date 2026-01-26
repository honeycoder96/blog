---
title: 'Disaster Recovery: Backups & Replica Sets'
description: 'What happens if your server catches fire? Learn how Replica Sets provide high availability and how to handle backups properly.'
pubDate: 'Aug 25 2025'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: 'Backup and Replication'
tags: ["mongodb", "devops", "backup"]
series: "MongoDB Roadmap"
---

Welcome to **Day 4**! 🚑

Servers die. Disks fail. Interns drop tables.
You need a plan.

## 1. High Availability (Replica Sets)

A single MongoDB node is a Single Point of Failure.
A **Replica Set** is a group of `mongod` instances that maintain the same data.

- **Primary**: Receives all Writes. Replicates to Secondaries.
- **Secondary**: Replicates data. Can serve Reads (if configured). 
- **Arbiter**: No data. Just votes in elections.

**Failover**: If the Primary dies, the Secondaries hold an election. One becomes the new Primary automatically. Your app just reconnects.

## 2. Backup Strategies

Replication is NOT a backup.
*If you delete a collection on the Primary, it deletes on the Secondary instantly.*

You need **Point-in-Time** backups.

### A. `mongodump` & `mongorestore`
Standard logical backups.
```bash
# Backup
mongodump --uri="mongodb://..." --out=/backups/date
# Restore
mongorestore --uri="mongodb://..." /backups/date
```
*Pros: Simple. Cons: Slow on large datasets.*

### B. Filesystem Snapshots (LVM / EBS)
If you run on AWS/GCP, snapshot the disk volume.
*Pros: Instant. Cons: Requires OS-level access.*

### C. Atlas Backups
Continuous Cloud Backups. You can restore to any specific minute in the last 7 days.

## 3. Testing Restores

A backup is useless if you can't restore it.
**The "Schrödinger's Backup" Rule:**
> A backup is neither good nor bad until you attempt to restore it. 

Perform a **Dry Run** restore every month to a staging environment.

---

### 🧠 Daily Challenge
1. Create a dummy folder `backup_test`.
2. Use `mongodump` to backup your local database.
3. Drop a collection! 😱
4. Use `mongorestore` to bring it back.

See you on **Day 5** for our **Mini Project**: A **Secure Notes App** with Encryption! 🔐


---

## Next Step

[**Next: Mini Project Secure Notes App →**](/blog/mongodb/week-5-day-5-mini-project-secure-notes-app)