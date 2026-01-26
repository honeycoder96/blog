---
title: 'Mini Project: Building a Lightning Fast Product API'
description: 'Week 2 Finale! We build a Product Catalog API with advanced filtering and sorting, powered by Compound Indexes.'
pubDate: 'Aug 11 2025'
heroImage: 
  src: '/images/mongodb/week-2-day-5.png'
  alt: 'Product Catalog API Visualization'
tags: ["mongodb", "project", "api"]
series: "MongoDB Roadmap"
---

Welcome to the end of **Week 2**! 🏎️

We've learned about:
- **Single Field Indexes**
- **Compound Indexes** & **ESR Rule**
- **Multikey Indexes**
- **Explain Plans**

Today, we apply this to a real-world scenario: **E-Commerce Search**.

## 1. The Requirement

We need an API endpoint `GET /products` that supports:
- Filtering by **Category** (Equality)
- Filtering by **Price Range** (Range)
- Sorting by **Rating** (Sort)
- Sorting by **Creation Date** (Sort)

AND it must respond in under **50ms** for 1 million products.

## 2. The Data Model

```javascript
{
  "_id": ObjectId("..."),
  "name": "Gaming Laptop",
  "category": "Electronics",
  "price": 1200,
  "rating": 4.5,
  "tags": ["gaming", "computer"], // Array
  "createdAt": ISODate("...")
}
```

## 3. The Queries & Indexes

### Scenario A: Filter by Category, Sort by Price
`db.products.find({ category: "Electronics" }).sort({ price: 1 })`

**Strategy (ESR)**:
- **E**: `category`
- **S**: `price`
- **R**: -

**Index Needed:** `{ category: 1, price: 1 }`

### Scenario B: Filter by Category AND Rating > 4
`db.products.find({ category: "Electronics", rating: { $gt: 4 } })`

**Strategy (ESR)**:
- **E**: `category`
- **S**: -
- **R**: `rating`

**Index Needed:** `{ category: 1, rating: 1 }`

### Scenario C: Filter by Category, Sort by Date, Price < 500
`db.products.find({ category: "Electronics", price: { $lt: 500 } }).sort({ createdAt: -1 })`

**Strategy (ESR)**:
- **E**: `category`
- **S**: `createdAt`
- **R**: `price`

**Index Needed:** `{ category: 1, createdAt: -1, price: 1 }`

---

## 4. The "One Index to Rule Them All"

We can't create 50 indexes. Let's try to cover most bases with **Two Compound Indexes**.

**Index 1: The Browser**
`{ category: 1, rating: -1, price: 1 }`
Good for: "Show me Electronics, sorted by best rating, then cheapest."

**Index 2: The Newest Items**
`{ category: 1, createdAt: -1 }`
Good for: "Show me the newest Electronics."

## 5. Implementation in Node.js

```javascript
const getProducts = async (req, res) => {
  const { category, minPrice, sortBy } = req.query;
  const filter = {};
  const sort = {};

  // E - Equality
  if (category) filter.category = category;

  // R - Range
  if (minPrice) filter.price = { $gte: Number(minPrice) };

  // S - Sort
  if (sortBy === 'newest') sort.createdAt = -1;
  else if (sortBy === 'rating') sort.rating = -1;

  // Execute
  const products = await db.collection('products')
    .find(filter)
    .sort(sort)
    .limit(20)
    .toArray();

  res.json(products);
};
```

## 6. Week 2 Wrap Up

You now know how to stop the **COLLSCAN**.
You know that `{ a: 1, b: 1 }` is NOT the same as `{ b: 1, a: 1 }`.
You are ready to handle millions of documents.

**Next Week: Week 3 - The Aggregation Framework!** 📊
We will stop doing `find()` and start building complex data pipelines!

Have a great weekend! 🌞


---

## Next Step

[**Next: Aggregation Basics →**](/blog/mongodb/week-3-day-1-aggregation-basics)