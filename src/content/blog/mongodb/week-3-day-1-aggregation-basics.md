---
title: 'The Aggregation Pipeline: SQL Power in MongoDB'
description: 'Forget find(). If you want to do analytics, reports, or complex transformations, you need the Aggregation Framework. We cover $match, $group, and $sort.'
pubDate: 'Aug 12 2025'
heroImage: 
  src: '/blog-placeholder-1.jpg'
  alt: 'Aggregation Pipeline Visualization'
tags: ["mongodb", "aggregation", "analytics"]
series: "MongoDB Roadmap"
---

Welcome to **Week 3**! 📊
This week we unlock the real power of MongoDB: **The Aggregation Framework**.

If `find()` is like selecting rows in Excel, `aggregate()` is like Pivot Tables and Macros on steroids.

## 1. The Pipeline Concept

Think of it like a factory assembly line.
Documents go in one end -> pass through a series of **Stages** -> Result comes out the other end.

`[ Stage 1 ] -> [ Stage 2 ] -> [ Stage 3 ]`

## 2. Basic Stages

### A. `$match` (Filter)
It's just like `find()`, but inside a pipeline. Always put this **FIRST** to reduce the amount of data processing.

```javascript
{ $match: { status: "active" } }
```

### B. `$group` (Summarize)
This is your `GROUP BY`. You can calculate sums, averages, counts, etc.

```javascript
{
  $group: {
    _id: "$category", // Group by Category
    totalSales: { $sum: "$amount" }, // Sum the prices
    avgPrice: { $avg: "$price" } // Average price
  }
}
```

### C. `$sort` (Order)
Sorts the result.

```javascript
{ $sort: { totalSales: -1 } } // Highest sales first
```

### D. `$project` (Reshape)
Selects which fields to keep, rename, or calculate new ones.

```javascript
{
  $project: {
    _id: 0,
    categoryName: "$_id",
    revenue: "$totalSales"
  }
}
```

## 3. Putting it Together

Let's say we have a `Orders` collection. We want to find the **Top 3 Selling Products** that are "Shipped".

```javascript
db.orders.aggregate([
  // Stage 1: Filter only shipped orders
  { $match: { status: "shipped" } },

  // Stage 2: Group by Product and Sum the Quantity
  {
    $group: {
      _id: "$product_name",
      totalQuantity: { $sum: "$quantity" }
    }
  },

  // Stage 3: Sort by Quantity Descending
  { $sort: { totalQuantity: -1 } },

  // Stage 4: Limit to top 3
  { $limit: 3 }
])
```

## 4. Why not just use MapReduce?
MapReduce is deprecated in MongoDB. The Aggregation Framework is written in C++ and is much, much faster.

---

### 🧠 Daily Challenge
1. Open up Compass or Shell.
2. Run an aggregation on your `User` collection.
3. Group by `address.city` and count how many users live in each city.
   `{ $group: { _id: "$address.city", count: { $sum: 1 } } }`

See you on **Day 2** for **Lookups** (Joins) and more complex pipelines! 🔗


---

## Next Step

[**Next: Grouping And Counting →**](/blog/mongodb/week-3-day-2-grouping-and-counting)