---
title: 'Bulk Writes: How to Insert 1 Million Docs Fast'
description: 'Stop using Promise.all() for database writes. Learn the art of Bulk Operations to supercharge your write performance.'
pubDate: 'Aug 18 2025'
heroImage: 
  src: '/blog-placeholder-2.jpg'
  alt: 'Bulk Operations'
tags: ["mongodb", "performance", "batch-processing"]
series: "MongoDB Roadmap"
---

Welcome to **Day 2**! 📦

A common mistake new developers make is running database operations in a loop.

**Bad Code:**
```javascript
// 10,000 requests to the DB! 🐢
for (const user of users) {
  await db.collection('users').insertOne(user);
}
```

Even with `Promise.all()`, you are flooding the network with 10,000 separate TCP packets.

## 1. Enter `bulkWrite()`

MongoDB allows you to send **one massive batch** of operations in a single network request.

```javascript
const bulkOps = users.map(user => ({
  insertOne: {
    document: user
  }
}));

// 1 request! 🚀
await db.collection('users').bulkWrite(bulkOps);
```

## 2. It's not just for Inserts

You can mix and match operations!

```javascript
db.collection('products').bulkWrite([
  { insertOne: { document: { name: "New Product" } } },
  { updateOne: { filter: { id: 1 }, update: { $set: { price: 99 } } } },
  { deleteOne: { filter: { status: "defective" } } }
]);
```

## 3. Ordered vs Unordered

By default, `bulkWrite` is **Ordered** (`ordered: true`).
- Operations execute in sequence (1, then 2, then 3).
- If Op #5 fails, **it stops**. Operations 6-10 are NOT executed.

If you don't care about order (e.g., importing independent log entries), use **Unordered**.
- `ordered: false`
- MongoDB creates parallel threads to execute them.
- If Op #5 fails, it continues with the rest. **Faster!**

```javascript
await db.collection('logs').bulkWrite(ops, { ordered: false });
```

---

### 🧠 Daily Challenge
1. Create a script that generates 10,000 dummy products.
2. Measure the time it takes to insert them using a `for...of` loop with `await`.
3. Measure the time it takes using `bulkWrite`.
4. Be amazed. (Usually 10x-50x faster).

See you on **Day 3** for **Change Streams**! (Real-time magic) ✨


---

## Next Step

[**Next: Change Streams →**](/blog/mongodb/week-4-day-3-change-streams)