---
title: 'Authentication & Authorization: Securing MongoDB'
description: 'Stop using the root user! Learn how to create least-privilege users with RBAC.'
pubDate: 'Aug 23 2025'
heroImage: 
  src: '/blog-placeholder-2.jpg'
  alt: 'Security and Auth'
tags: ["mongodb", "security", "rbac"]
series: "MongoDB Roadmap"
---

Welcome to **Day 2**! 👮‍♂️

If you are connecting to your database using `mongodb://localhost:27017` without a username/password, **STOP**.
You are one mistake away from being hacked.

## 1. Enable Authentication

By default, MongoDB allows anyone to do anything.
To enable auth, start `mongod` with `--auth`.

```bash
mongod --auth --dbpath /data/db
```

## 2. Creating the Admin User

The first user must be an Admin.

```javascript
use admin
db.createUser({
  user: "superAdmin",
  pwd: "strongPassword123",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
})
```

## 3. Creating App Users (Leaast Privilege)

Your Node.js app shouldn't be an Admin. It should only have Read/Write access to **its own database**.

```javascript
use myAppDB
db.createUser({
  user: "appUser",
  pwd: "appPassword456",
  roles: [ { role: "readWrite", db: "myAppDB" } ]
})
```

**Common Roles:**
- `read`: Can only read data.
- `readWrite`: Can read and modify.
- `dbAdmin`: Can manage indexes and schema.
- `clusterAdmin`: Can manage huge server ops (sharding).

## 4. Network Security (Bind IP)

By default, MongoDB binds to `0.0.0.0` (All IPs) or `127.0.0.1`.
In `mongod.conf`, ensure you only bind to trusted IPs.

```yaml
net:
  bindIp: 127.0.0.1,192.168.1.5
```

## 5. Encryption at Rest

If someone steals your hard drive, they have your data.
MongoDB Enterprise supports **Encryption at Rest**.
For Community Edition, you should rely on **Full Disk Encryption** (LUKS, DM-Crypt) on your OS level.

---

### 🧠 Daily Challenge
1. Enable Auth on your local MongoDB.
2. Create a `readOnly` user.
3. Try to Insert a document with that user.
4. Watch permission denied! 🛑

See you on **Day 3** for **Deployment Strategies**! 🌍


---

## Next Step

[**Next: Deployment Staging Production →**](/blog/mongodb/week-5-day-3-deployment-staging-production)