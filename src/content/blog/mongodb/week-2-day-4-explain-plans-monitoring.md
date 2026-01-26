---
title: 'How to Read a MongoDB Explain Plan'
description: 'Don’t guess why your query is slow. Ask MongoDB. Learn how to debug performance issues like a detective.'
pubDate: 'Aug 10 2025'
heroImage: 
  src: '/images/mongodb/week-2-day-4.png'
  alt: 'Debugging with Explain Plan'
tags: ["mongodb", "performance", "debugging"]
series: "MongoDB Roadmap"
---

Welcome to **Day 4**! 🕵️‍♂️

You suspect your query is slow. But why?
Is it scanning too many documents? Is it sorting in memory? Is it using the wrong index?

To find out, we use `.explain()`.

## 1. How to run it

In the content of a query, just chain `.explain("executionStats")` to the end.

```javascript
db.users.find({ age: { $gt: 20 } }).explain("executionStats")
```

The output is a large JSON. Don't panic. You only need to check **3 Key Metrics**.

## 2. Key Metric #1: `executionStages`

This tells you **HOW** MongoDB executed the query.

- **`COLLSCAN`**: ❌ **BAD**. It scanned the whole collection.
- **`IXSCAN`**: ✅ **GOOD**. It used an index key scan.
- **`FETCH`**: ⚠️ **OK**. It scanned the index, then went to fetch the full document.
- **`PROJECTION_COVERED`**: 🚀 **BEST**. It got everything from the index. No fetch needed.

## 3. Key Metric #2: `nReturned` vs `totalDocsExamined`

This is the **Efficiency Ratio**.

- **nReturned**: How many documents matched.
- **totalDocsExamined**: How many documents MongoDB had to read to find them.

**Ideal Ratio:** 1:1. (To find 5 docs, it read 5 docs).
**Bad Ratio:** 1:1000. (To find 5 docs, it read 5000 docs).

**Example of a Bad Query:**
`nReturned: 5`
`totalDocsExamined: 1000000`
(*This means you are missing an index!*)

## 4. Key Metric #3: `totalKeysExamined`

This tells you if your index is efficient.
If you have an index on `{ age: 1 }` and you query `{ age: { $gt: 20 } }`:

- **nReturned**: 100
- **totalKeysExamined**: 100 (Perfect!)

If you query `{ limit: 5 }` but `totalKeysExamined` is 5000, your sort might be wrong (Scanning the index in the wrong order until it finds 5 matches).

## 5. Visualizing in Compass

If you hate reading JSON, use **MongoDB Compass**.
1. Go to the "Explain Plan" tab.
2. Paste your query.
3. Click "Explain".
4. It shows a visual tree! 🌳

- **Red Node**: Collection Scan (Fix this!)
- **Green Node**: Index Scan.

---

### 🧠 Daily Challenge
1. Pick a slow query in your app.
2. Run `.explain("executionStats")`.
3. What is the `nReturned` / `totalDocsExamined` ratio?
4. If it's bad, create an index and run it again. Watch the ratio drop to 1:1.

See you on **Day 5** for our **Mini Project**: Building a super-fast **Product Catalog Search API**! 🛍️


---

## Next Step

[**Next: Mini Project Product Catalog →**](/blog/mongodb/week-2-day-5-mini-project-product-catalog)