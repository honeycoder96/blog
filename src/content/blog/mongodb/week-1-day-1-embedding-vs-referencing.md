---
title: 'Embedding vs Referencing in MongoDB'
description: 'The most fundamental schema design decision in MongoDB: Should you embed data in a single document or reference it across multiple documents? We explore the trade-offs, patterns, and code examples.'
pubDate: 'Aug 02 2025'
heroImage: 
  src: '/images/mongodb/week-1-day-1.png'
  alt: 'Embedding vs Referencing Visualization'
# 
tags: ["mongodb", "data-modeling", "schema-design"]
series: "MongoDB Roadmap"
---

Welcome to **Day 1** of our 6-Week MongoDB Roadmap! 🚀

Today, we tackle the most common question for anyone coming from a SQL background to MongoDB:  
**"Should I normalize my data (Reference) or denormalize it (Embed)?"**

In SQL, the answer is almost always "Normalize". In MongoDB, the answer is "It depends on how you access your data".

## 1. The Concepts

### Embedding
Embedding is the practice of storing related data in a single document. This is the "natural" MongoDB way.

**Example**: A `User` has an `Address`.

```json
// User Document
{
  "_id": "user123",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "zip": "10001"
  }
}
```

**Pros:**
- ✅ **Performance**: You get all the data (User + Address) in a single read query.
- ✅ **Atomicity**: You can update the user and address in a single atomic write operation.

**Cons:**
- ❌ **Document Size Limit**: MongoDB documents are limited to 16MB. You can't embed an infinite list effectively.
- ❌ **Duplication**: If many users share the same address update, you have to update every user document.

### Referencing
Referencing involves storing data in separate documents and linking them using an `_id`. This is similar to "Foreign Keys" in SQL.

**Example**: A `Publisher` has millions of `Books`.

```json
// Publisher Document
{
  "_id": "pub999",
  "name": "O'Reilly Media"
}

// Book Document
{
  "_id": "book888",
  "title": "MongoDB: The Definitive Guide",
  "publisher_id": "pub999" // Reference
}
```

**Pros:**
- ✅ **Flexibility**: Useful for "Many-to-Many" or "One-to-Many" relationships where the "Many" side is huge (unbounded).
- ✅ **No Duplication**: Update the publisher details in one place, and all books reflect it.

**Cons:**
- ❌ **Performance**: Requires application-level "joins" (multiple queries) or using `$lookup` aggregation, which is slower than a single read.

---

## 2. When to Use Which?

The decision often comes down to the **One-to-N** relationship rule.

| Relationship | Type | Recommendation |
| :--- | :--- | :--- |
| **One-to-Few** | 1 Person has ~5 Addresses | **Embed** |
| **One-to-Many** | 1 Blog Post has ~100 Comments | **Embed** (mostly) |
| **One-to-Squillions** | 1 App has 10M Activity Logs | **Reference** |

### The "One-to-Few" Rule (Embed)
If the related data is small and rarely changes independently, embed it.

**Example Code (Node.js/Mongoose):**

```javascript
const userSchema = new Schema({
  name: String,
  // Embedded schema
  addresses: [{
    street: String,
    city: String
  }]
});

// Storing data happens in one go
const user = new User({
  name: "Alice",
  addresses: [{ street: "123 Apple St", city: "Cupertino" }]
});
await user.save();
```

### The "One-to-Many" Rule (Embed... Carefully)
For things like comments on a blog post. It's great to read a post and its comments in one go. However, if a post can have 50,000 comments, embedding will hit the 16MB limit.

**Solution**: embed the first 100 comments for speed, and reference the rest! (Hybrid pattern).

### The "One-to-Squillions" Rule (Reference)
For massive datasets, like logs or sensor data, always use references.

```javascript
// Log Schema
const logSchema = new Schema({
  msg: String,
  timestamp: Date,
  // Reference to the source machine
  machine_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Machine' } 
});
```

Here, we store the `machine_id` in the Log document (Parent referencing), because the Machine document certainly can't hold an array of 10 million Log IDs!

---

## 3. Practical Summary

1. **Embed by default.** It leverages MongoDB's strength.
2. **Reference if** the embedded data would grow without bound (unbounded arrays).
3. **Reference if** the embedded data is accessed standalone frequently (e.g., you query "Comments" without looking at the "Post").
4. **Reference if** you need to manage many-to-many relationships with high data integrity requirements.

---

### 🧩 Challenge for Today

Look at your current project's database. Find one relationship (e.g., Users -> Orders).
- Are you referencing where you could be embedding?
- Are you embedding something that is growing out of control?

See you on **Day 2**, where we dissect the **One-to-One, One-to-Many, and Many-to-Many** patterns in code! 👨‍💻


---

## Next Step

[**Next: One To One One To Many →**](/blog/mongodb/week-1-day-2-one-to-one-one-to-many)