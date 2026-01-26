---
title: 'Mastering $group and $project'
description: 'How to build powerful reports using MongoDB Aggregation. Summing, averaging, and reshaping your data.'
pubDate: 'Aug 13 2025'
heroImage: 
  src: '/blog-placeholder-2.jpg'
  alt: 'Grouping Data'
tags: ["mongodb", "aggregation", "reporting"]
series: "MongoDB Roadmap"
---

Welcome to **Day 2** of Aggregation Week!

Yesterday, we learned the basics. Today, we dive deeper into **Processing Data**.
The `$group` stage is where the magic happens. It allows you to pivot your data just like in Excel.

## 1. The Accumulators

When you group data, you usually want to calculate something.
- `$sum`: Adds up values (or counts if you use `1`).
- `$avg`: Calculates the average.
- `$min` / `$max`: Finds extremes.
- `$first` / `$last`: Useful for sorted groups.
- `$push`: Creates an array of values.

### Example: E-Commerce Report

Imagine a `Sales` collection.
```json
{ "item": "Laptop", "price": 1000, "category": "Electronics", "date": "2023-01-01" }
{ "item": "Mouse", "price": 50, "category": "Electronics", "date": "2023-01-02" }
```

**Goal:** Report Total Revenue and Average Price per Category.

```javascript
db.sales.aggregate([
  {
    $group: {
      _id: "$category", // Group Key
      totalRevenue: { $sum: "$price" },
      averagePrice: { $avg: "$price" },
      count: { $sum: 1 } // Count how many sales
    }
  }
])
```

## 2. Dealing with Dates

Grouping by date is tricky because `ISODate()` includes the exact millisecond.
You rarely want to group by millisecond. You want **"Sales per Day"** or **"Sales per Month"**.

Use `$dateToString` inside `$group`.

```javascript
db.sales.aggregate([
  {
    $group: {
      _id: { 
        $dateToString: { format: "%Y-%m-%d", date: "$date" } 
      },
      dailySales: { $sum: "$price" }
    }
  },
  { $sort: { _id: 1 } } // Sort by date
])
```

## 3. Reshaping with `$project`

Often, the output of `$group` (`_id`, `totalRevenue`) looks "database-y". The frontend wants clean JSON.
Use `$project` to rename fields.

```javascript
...
{
  $project: {
    _id: 0, // Hide the ID
    date: "$_id",
    revenue: "$dailySales"
  }
}
```

**Output:**
```json
{ "date": "2023-01-01", "revenue": 1000 }
```

---

### 🧠 Daily Challenge
You have a `Students` collection with `{ name: "Alice", grade: 90, subject: "Math" }`.
1. Calculate the **Average Grade** per **Subject**.
2. Find the **Highest Grade** in each **Subject**.
3. Use `$project` to make the output look like: `{ "subject": "Math", "average": 85, "best": 99 }`.

See you on **Day 3** for **$lookup**, where we finally join collections together! 🔗


---

## Next Step

[**Next: Lookups And Joins →**](/blog/mongodb/week-3-day-3-lookups-and-joins)