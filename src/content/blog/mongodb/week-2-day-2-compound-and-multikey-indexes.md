---
title: 'Compound Indexes & The ESR Rule'
description: 'Filtering by multiple fields? A single index won’t cut it. Learn how to chain indexes together like a pro using the ESR Rule.'
pubDate: 'Aug 08 2025'
heroImage: 
  src: '/images/mongodb/week-2-day-2.png'
  alt: 'Compound Index Conveyor Belt'
tags: ["mongodb", "indexing", "performance"]
series: "MongoDB Roadmap"
---

Welcome to **Day 2** of Indexing Week!

Yesterday, we learned that an index is like a sorted list. But what if you query by **two** things?
`db.products.find({ category: "Electronics", price: { $gt: 1000 } })`

If you only index `category`, MongoDB finds all "Electronics", but then has to scan them one-by-one to check the price.
If you only index `price`, MongoDB finds all items > 1000, but then checks if they are "Electronics".

We need a **Compound Index**.

## 1. What is a Compound Index?

It indexes two or more fields *in a specific order*.

```javascript
db.products.createIndex({ category: 1, price: 1 })
```

Think of a Phonebook. It's sorted by **Last Name**, then by **First Name**.
- If you look for "Smith, John", it's instant.
- If you look for "Smith", it's instant.
- If you look for "John", it's USELESS. You can't find all "Johns" without reading the whole book.

**Rule:** Prefixes matter. An index on `{ a: 1, b: 1 }` supports queries on `{ a: 1 }`, but NOT on `{ b: 1 }`.

## 2. The ESR Rule (Equality, Sort, Range)

This is the **Golden Rule** for designing compound indexes.
Order your index fields like this:

1.  **E - Equality**: Fields you match exactly (`manufacturer: "Apple"`).
2.  **S - Sort**: Fields you sort by (`createdAt: -1`).
3.  **R - Range**: Fields you filter by range (`price: { $gt: 500 }`).

**Why?**
- **Equality** filters narrow down the list first.
- **Sort** works best after equality because the subset is already sorted in the index.
- **Range** filters should be last because once you hit a range, the sort order effectively breaks for subsequent fields.

### Example:
Query:
```javascript
db.cars.find({
  manufacturer: "Tesla",     // Equality
  price: { $gt: 50000 }      // Range
}).sort({ year: -1 })        // Sort
```

**Bad Index:** `{ manufacturer: 1, price: 1, year: 1 }`
*Why?* It does Equality, then Range. The Sort cannot use the index because "price > 50000" selects a chunk of the index where `year` is mixed up.

**Good Index (ESR):** `{ manufacturer: 1, year: 1, price: 1 }`
- **E**: Match "Tesla".
- **S**: The "Tesla" section is already sorted by `year`. We just walk down.
- **R**: We filter by `price` as we walk.

## 3. Covered Queries (The Holy Grail)

If your index contains **ALL** the fields you need for the query *and* the projection, MongoDB doesn't even need to look at the document!

```javascript
db.users.createIndex({ username: 1 })

// Query
db.users.find({ username: "honey" }, { _id: 0, username: 1 })
```
Since we only asked for `username` (which is in the index) and excluded `_id` (so we don't need the doc), this query is **Lightning Fast ⚡**.
`explain()` will show `totalDocsExamined: 0`.

---

### 🧠 Daily Challenge
Check one of your collections.
1. Find a query that sorts by `date` and filters by `status`.
2. Do you have an index? Is it `{ date: 1, status: 1 }`?
3. Try changing it to `{ status: 1, date: 1 }` (Equality, then Sort).
4. Measure the difference!

See you on **Day 3** for **Multikey Indexes** (Indexing Arrays)!


---

## Next Step

[**Next: Indexing Best Practices →**](/blog/mongodb/week-2-day-3-indexing-best-practices)