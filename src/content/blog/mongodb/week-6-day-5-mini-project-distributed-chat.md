---
title: 'Mini Project: Global Chat App (Sharded)'
description: 'The Grand Finale! We design a chat architecture that can scale to 1 billion users using Sharding and Change Streams.'
pubDate: 'Aug 31 2025'
heroImage: 
  src: '/blog-placeholder-5.jpg'
  alt: 'Distributed Chat Architecture'
tags: ["mongodb", "project", "scaling"]
series: "MongoDB Roadmap"
---

Welcome to the **End of the Roadmap**! 🎓

We are going to architect a **Global Chat App** (like WhatsApp) that needs to store billions of messages.
A single server won't handle the writes. We must **Shard**.

## 1. The Strategy

- **Sharding Key**: `chatId` (Hashed).
- **Reason**: Messages for a specific chat should live together (Locality), but we have millions of chats, so we distribute them evenly across shards.

## 2. The Schema

```json
{
  "_id": ObjectId("msg1"),
  "chatId": ObjectId("chatA"), // SHARD KEY
  "senderId": ObjectId("user1"),
  "text": "Hello World",
  "k": ISODate("...")
}
```

## 3. Enable Sharding (Command Line)

```javascript
// 1. Enable sharding on DB
sh.enableSharding("chatDB")

// 2. Hash index on Key
db.messages.createIndex({ chatId: "hashed" })

// 3. Shard Collection
sh.shardCollection("chatDB.messages", { chatId: "hashed" })
```

Now, when User A sends a message to Chat Z, Mongo automatically routes it to the correct shard (e.g., Shard 3).
User B sends a message to Chat Y, it goes to Shard 1.

## 4. Real-Time Delivery

We use **Change Streams** on the `messages` collection.
Because it's a sharded cluster, the `mongos` router aggregates the change stream from all shards for us!

```javascript
const stream = db.collection('messages').watch();
stream.on('change', (change) => {
  if (change.operationType === 'insert') {
    // Send via WebSocket to users in change.fullDocument.chatId
    io.to(change.fullDocument.chatId).emit('msg', change.fullDocument);
  }
});
```

## 5. Graduation 🎓

You have completed the **6-Week MongoDB Roadmap**.

You started by wondering "Embed vs Reference?".
You are now architecting **Sharded Clusters** with **Real-Time Streams**.

### What's Next?
- Build something real.
- Break something real.
- Fix it.

That is the only way to learn.
**Happy Coding!** 🚀


---

## 🎉 Series Complete!

You have finished the **MongoDB** roadmap.

👉 **Next Challenge: [System Design Roadmap](/blog/system-design-roadmap)**