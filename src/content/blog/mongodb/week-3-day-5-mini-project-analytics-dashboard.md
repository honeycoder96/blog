---
title: 'Mini Project: E-Commerce Analytics Dashboard'
description: 'Week 3 Finale! We compute Daily Revenue, Top Selling Categories, and User Spending Habits using one massive Aggregation Pipeline.'
pubDate: 'Aug 16 2025'
heroImage: 
  src: '/blog-placeholder-5.jpg'
  alt: 'Analytics Dashboard'
tags: ["mongodb", "project", "analytics"]
series: "MongoDB Roadmap"
---

Welcome to the **Week 3 Finale**! 🏆

We've mastered `$match`, `$group`, `$project`, and `$lookup`.
Now, we build a **Real-Time Analytics Dashboard** backend.

## 1. The Dataset

We have an `Orders` collection.
```json
{
  "_id": 1,
  "date": ISODate("2025-08-16T10:00:00Z"),
  "status": "completed",
  "items": [
    { "product": "Laptop", "price": 1000, "qty": 1, "category": "Electronics" },
    { "product": "Mouse", "price": 50, "qty": 2, "category": "Electronics" }
  ],
  "userId": 101
}
```

## 2. Requirement: The "Boss" Dashboard 👔

The CEO wants an API that returns:
1.  **Total Items Sold** (All time).
2.  **Top 3 Categories** by Revenue.
3.  **Average Order Value (AOV)** per Day.

## 3. The Mega Pipeline

We can do this in **ONE** database call using `$facet` (Multi-pipeline).

```javascript
db.orders.aggregate([
  // 1. Filter out cancelled orders first
  { $match: { status: "completed" } },

  // 2. Facet: Fork the pipeline into 3 parallel processes
  {
    $facet: {
      "totalItems": [
        { $unwind: "$items" },
        { $group: { _id: null, count: { $sum: "$items.qty" } } }
      ],
      "topCategories": [
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.category",
            revenue: { $sum: { $multiply: ["$items.price", "$items.qty"] } }
          }
        },
        { $sort: { revenue: -1 } },
        { $limit: 3 }
      ],
      "dailyAOV": [
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            dailyRevenue: { $sum: { $sum: { $map: { input: "$items", as: "i", in: { $multiply: ["$$i.price", "$$i.qty"] } } } } },
            orderCount: { $sum: 1 }
          }
        },
        {
          $project: {
            date: "$_id",
            avgOrderValue: { $divide: ["$dailyRevenue", "$orderCount"] }
          }
        },
        { $sort: { date: -1 } }
      ]
    }
  }
])
```

## 4. The Result

```json
{
  "totalItems": [ { "count": 5420 } ],
  "topCategories": [
    { "_id": "Electronics", "revenue": 50000 },
    { "_id": "Books", "revenue": 12000 },
    { "_id": "Home", "revenue": 8000 }
  ],
  "dailyAOV": [
    { "date": "2025-08-16", "avgOrderValue": 150.50 }
  ]
}
```

## 5. Week 3 Wrap Up

You have graduated from "basic queries". You are now an **Aggregation Pro**. 🎓
You can filter, group, join, and reshape data without writing a single loop in Node.js.

**Next Week: Week 4 - Transactions & Advanced Ops!** 💳
We will handle money, atomic updates, and time-to-live data!

Enjoy your weekend! 🍹


---

## Next Step

[**Next: Acid Transactions →**](/blog/mongodb/week-4-day-1-acid-transactions)