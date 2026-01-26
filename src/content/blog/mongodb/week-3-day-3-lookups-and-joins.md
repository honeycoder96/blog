---
title: 'Joins in MongoDB: The $lookup Stage'
description: 'Yes, MongoDB has joins! Learn how to combine data from multiple collections using the powerful $lookup stage.'
pubDate: 'Aug 14 2025'
heroImage: 
  src: '/blog-placeholder-3.jpg'
  alt: 'Joining Data'
tags: ["mongodb", "aggregation", "joins"]
series: "MongoDB Roadmap"
---

Welcome to **Day 3**!

"Does NoSQL mean NO Joins?" 🤔
**False.**
While we prefer embedding (Week 1), sometimes you simply MUST join data.
Enter `$lookup`.

## 1. The Anatomy of `$lookup`

This stage pulls in data from another collection.

```javascript
{
  $lookup: {
    from: "others_collection", // Target collection
    localField: "my_field",    // Field in THIS collection
    foreignField: "their_field", // Field in Target collection
    as: "output_array"         // Output field name
  }
}
```

**Crucial Note**: The result is ALWAYS an **Array**, because one document here might match multiple documents there.

### Example: Users and Orders
We have `Users` (id, name) and `Orders` (user_id, total).
We want to list all users and their orders.

```javascript
db.users.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "user_id",
      as: "user_orders"
    }
  }
])
```

**Output:**
```json
{
  "_id": 1,
  "name": "Alice",
  "user_orders": [
    { "order_id": 101, "total": 50 },
    { "order_id": 102, "total": 20 }
  ]
}
```

## 2. Unwinding the Array

Often, you don't want an array of orders. You want to flatten it to process each order individually.
Use `$unwind`.

```javascript
{ $unwind: "$user_orders" }
```

**Output:**
```json
// Alice appears twice now!
{ "name": "Alice", "user_orders": { "order_id": 101 } }
{ "name": "Alice", "user_orders": { "order_id": 102 } }
```

## 3. Advanced Lookups (Pipelines)

What if you only want to join the **last 5 shipped orders**?
Simple lookups can't filter the target.
You need the **Pipeline Lookup**.

```javascript
{
  $lookup: {
    from: "orders",
    let: { userId: "$_id" }, // Variables
    pipeline: [
      { $match: { 
          $expr: { $eq: ["$user_id", "$$userId"] },
          status: "shipped" 
      }},
      { $sort: { date: -1 } },
      { $limit: 5 }
    ],
    as: "recent_orders"
  }
}
```

This is incredibly powerful. You can run a full sub-query on the joined collection!

---

### 🧠 Daily Challenge
1. Create `Authors` and `Books` collections.
2. Join them so you see the Author with an array of their Books.
3. Try to join them "backwards": List all Books and show their Author object. (Hint: The author comes back as an array of 1. Use `$unwind` to make it an object!)

See you on **Day 4** for **Array Transformations**! 🧬


---

## Next Step

[**Next: Array Transformations →**](/blog/mongodb/week-3-day-4-array-transformations)