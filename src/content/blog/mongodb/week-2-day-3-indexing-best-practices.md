---
title: '7 Golden Rules of MongoDB Indexing'
description: 'Indexes are powerful, but they cost RAM and Write speed. Here is your checklist for what NOT to do.'
pubDate: 'Aug 09 2025'
heroImage: 
  src: '/images/mongodb/week-2-day-3.png'
  alt: 'Indexing Control Panel'
tags: ["mongodb", "indexing", "best-practices"]
series: "MongoDB Roadmap"
---

Welcome to **Day 3**!

We know how Single and Compound indexes work. Now, let's talk about **Strategy**.
Bad indexing is the #1 reason for MongoDB performance issues.

## Rule 1: Indexes must fit in RAM
Indexes are stored in memory (RAM) for speed. If your indexes are larger than your available RAM, MongoDB starts swapping to disk.
**Result:** Performance drops off a cliff. 📉
**Fix:** Only index what you need. Eliminate unused indexes.

## Rule 2: ESR (Equality, Sort, Range)
Always order your compound index fields as:
1.  **Equality** (exact matches)
2.  **Sort** (ordering)
3.  **Range** (filters like `>`, `<`)

## Rule 3: Don't OD on Indexes
Every index you add makes **Writes slower**.
- On Insert: MongoDB writes the document AND updates every index.
- **Guideline:** Try to keep indexes under 5 per collection unless necessary.

## Rule 4: Use Partial Indexes
Why index "deleted" users if you never query them?
**Partial Indexes** only index documents that match a filter.

```javascript
// Only index active users
db.users.createIndex(
  { email: 1 },
  { partialFilterExpression: { status: "active" } }
)
```
**Benefit:** Smaller index size, less RAM usage!

## Rule 5: Avoid Regular Expressions (at start)
Querying `{ name: /^Honey/ }` (Starts with) uses the index efficiently.
Querying `{ name: /Honey/ }` (Contains) CANNOT use the index efficiently. It has to scan every entry.
**Fix:** Use Text Search or Atlas Search for full-text needs.

## Rule 6: No Low-Cardinality Indexes
Cardinality = Number of unique values.
- **High Cardinality:** Emails, Usernames (Good for Indexing)
- **Low Cardinality:** Gender, Boolean Flags (Bad for Indexing)

Indexing a boolean (`isActive: true`) is usually useless because it returns 50% of the collection, so MongoDB might ignore the index and do a CollScan anyway.

## Rule 7: The "Covered Query" is King
Always aim for Covered Queries where the index provides all the data (Project only what you need).

---

## 4. How to Find Unused Indexes?

In production, you often have old indexes lying around. Use `$indexStats` to find them.

```javascript
db.users.aggregate([ { $indexStats: {} } ])
```

Look at the `accesses.ops` count. If it's **0** after running for weeks, **DELETE IT**.

---

### 🧠 Daily Challenge
Review your `User` model.
1. Do you have an index on `gender` or `role`? (Low Cardinality?)
2. Do you have an index on `createdAt`? (Used for sorting?)
3. Can you turn any index into a **Partial Index**?

See you on **Day 4**! We'll dive deep into `explain()` and debug a slow query live! 🕵️‍♂️


---

## Next Step

[**Next: Explain Plans Monitoring →**](/blog/mongodb/week-2-day-4-explain-plans-monitoring)