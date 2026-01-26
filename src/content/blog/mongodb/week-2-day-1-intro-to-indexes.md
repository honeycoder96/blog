---
title: 'MongoDB Indexing 101: Stop the Collection Scans'
description: 'Indexes are the difference between a 10ms query and a 10-second timeout. Learn how Single Field Indexes works under the hood.'
pubDate: 'Aug 07 2025'
heroImage: 
  src: '/images/mongodb/week-2-day-1.png'
  alt: 'Indexing Visualization Highway'
tags: ["mongodb", "indexing", "performance"]
series: "MongoDB Roadmap"
---

Welcome to **Week 2**! 🚀
This week is all about **Speed**.

You can have the best schema in the world (from Week 1), but if you don't index your data, your app will crash under load.

## 1. The "Collection Scan" (The Villain)

Imagine looking for "Waldo" in a book, but you have no index page. You have to flip through **every single page** until you find him.
In MongoDB, this is called a **COLLSCAN** (Collection Scan).

If you have 1 million users and you run:
`db.users.find({ email: "honey@example.com" })`

Without an index, MongoDB reads **1,000,000 documents** to find the one matching email. Ouch.

## 2. What is an Index? (The Hero)

An index is a small, sorted data structure (B-Tree) that stores a small portion of the collection's data.

If you index `email`:
`db.users.createIndex({ email: 1 })`

MongoDB creates a sorted list of emails pointing to the documents.
Now, finding "honey@example.com" is like using a phonebook. It takes **logarithmic time** (O(log N)). Instead of 1 million reads, it might take just **3 or 4 ops**.

## 3. Types of Indexes

### A. Single Field Index
The most basic type. Indexes one field.

```javascript
// Index on 'username' in ascending order (1)
db.users.createIndex({ username: 1 })
```
*Note: Sorting order (1 vs -1) doesn't matter much for single field indexes because MongoDB can traverse the index in either direction.*

### B. Unique Index
Enforces uniqueness. Good for emails, usernames, slugs.

```javascript
db.users.createIndex({ email: 1 }, { unique: true })
// Now, inserting a duplicate email throws an error!
```

### C. Default Index (`_id`)
MongoDB automatically indexes the `_id` field. You can't delete this one.

---

## 4. The Cost of Indexes

"Why not index everything?" 🤔

1.  **Write Penalty**: Every time you Insert, Update, or Delete a document, MongoDB must update the index too.
2.  **Storage Cost**: Indexes take up RAM and Disk space.

**Rule of Thumb:** Index fields that you **Query** or **Sort** by frequently.

---

## 5. Analyzing a Query

How do you know if an index is being used? Use `.explain("executionStats")`.

```javascript
db.users.find({ username: "honeycoder" }).explain("executionStats")
```

Look for:
- **`COLLSCAN`**: Bad! No index used.
- **`IXSCAN`**: Good! Index scan used.
- **`totalDocsExamined`**: Should match the number of results (ideally 1).

---

### 🧠 Daily Challenge
1. Open your project/terminal.
2. Pick a collection with some data (or generate dummy data).
3. Run a query with `.explain("executionStats")` and see the `COLLSCAN`.
4. Create an index on that field.
5. Run explain again and see the `IXSCAN` and the huge drop in `totalDocsExamined`.

See you on **Day 2**, where we level up to **Compound Indexes**! ⚡


---

## Next Step

[**Next: Compound And Multikey Indexes →**](/blog/mongodb/week-2-day-2-compound-and-multikey-indexes)