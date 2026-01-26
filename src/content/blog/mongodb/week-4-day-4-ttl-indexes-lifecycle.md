---
title: 'Self-Destructing Data: TTL Indexes'
description: 'Building a Cache or OTP system? Learn how to make documents automatically expire and delete themselves.'
pubDate: 'Aug 20 2025'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: 'TTL Indexes'
tags: ["mongodb", "indexes", "ttl"]
series: "MongoDB Roadmap"
---

Welcome to **Day 4**! 💣

Sometimes, you want data to disappear.
- **Session Tokens** (Expire after 24 hours)
- **OTP Codes** (Expire after 5 minutes)
- **Temporary Logs** (Expire after 7 days)

You *could* run a cron job to `deleteMany()` every hour.
Or, you could let MongoDB do it for you using **TTL (Time-To-Live) Indexes**.

## 1. Creating a TTL Index

It only works on **Date** fields.

```javascript
// Expire documents 3600 seconds (1 hour) after 'createdAt'
db.sessions.createIndex(
  { "createdAt": 1 },
  { expireAfterSeconds: 3600 }
)
```

## 2. Dynamic Expiration

What if different documents need different expiration times?
Method: Set `expireAfterSeconds: 0`, and set the Date field to the **future** expiration date.

```javascript
db.coupons.createIndex({ "expireDate": 1 }, { expireAfterSeconds: 0 })

// This coupon dies tomorrow
db.coupons.insertOne({
  code: "SALE50",
  expireDate: new Date("2025-08-21T10:00:00Z")
})
```

## 3. Important Caveats

1.  **Single Field Only**: You can't make a compound index a TTL index.
2.  **Not Real-Time**: The background thread runs every **60 seconds**. Data might live up to a minute longer than expected. Do not rely on it for millisecond-precision timing.
3.  **Replica Sets**: The delete only happens on the **Primary**, then replicates to Secondaries.

---

### 🧠 Daily Challenge
Create a `PasswordReset` collection.
Documents should store `{ email, token, createdAt }`.
Make sure the token automatically deletes itself after **15 minutes**.

See you on **Day 5** for our **Mini Project**: A **Banking API** with Transactions! 💰


---

## Next Step

[**Next: Mini Project Banking Api →**](/blog/mongodb/week-4-day-5-mini-project-banking-api)