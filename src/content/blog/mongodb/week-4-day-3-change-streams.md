---
title: 'Real-Time Apps with MongoDB Change Streams'
description: 'Who needs WebSockets when your database can push updates? Build real-time notifications with Change Streams.'
pubDate: 'Aug 19 2025'
heroImage: 
  src: '/blog-placeholder-3.jpg'
  alt: 'Change Streams'
tags: ["mongodb", "real-time", "websockets"]
series: "MongoDB Roadmap"
---

Welcome to **Day 3**! ✨

In the old days, to know if data changed, we had to **Poll** the database every 5 seconds.
`setInterval(() => checkForUpdates(), 5000)`
This kills your server and database.

MongoDB introduced **Change Streams**, which allows your app to **Subcribe** to database changes in real-time.

## 1. How it works

It uses the MongoDB **Oplog** (Operations Log). When a write happens, MongoDB pushes an event to all subscribers.

## 2. Basic Example (Node.js)

```javascript
const collection = db.collection('orders');
const changeStream = collection.watch();

changeStream.on('change', (next) => {
  console.log("Something changed!", next);
});
```

If you insert a document:
```javascript
{ operationType: 'insert', fullDocument: { ... } }
```

If you update a document:
```javascript
{ operationType: 'update', updateDescription: { updatedFields: { status: 'shipped' } } }
```

## 3. Filtering Changes

You don't want to listen to *every* change. Maybe you only care when an order is "cancelled".

```javascript
const pipeline = [
  { $match: { 'fullDocument.status': 'cancelled' } }
];

const changeStream = collection.watch(pipeline);
```

## 4. Use Cases

1.  **Notifications**: User A comments on a post -> Change Stream detects it -> Push Notification to User B.
2.  **Audit Logs**: Stream all changes to a separate `Audit` collection or ElasticSearch.
3.  **Cache Invalidation**: When data changes, clear the Redis cache key.

---

### 🧠 Daily Challenge
1. Open a terminal script that watches the `users` collection.
2. Open another terminal (or Compass) and manually update a user.
3. Watch your script print the update in real-time! ⚡

See you on **Day 4** for **TTL Indexes** (Self-destructing data)! 💣


---

## Next Step

[**Next: Ttl Indexes Lifecycle →**](/blog/mongodb/week-4-day-4-ttl-indexes-lifecycle)