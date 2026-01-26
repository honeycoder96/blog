---
title: 'Bending Arrays to Your Will: $map, $filter, $reduce'
description: 'Stop looping in Node.js. Learn how to transform arrays directly inside the database for maximum performance.'
pubDate: 'Aug 15 2025'
heroImage: 
  src: '/blog-placeholder-4.jpg'
  alt: 'Array Transformations'
tags: ["mongodb", "aggregation", "arrays"]
series: "MongoDB Roadmap"
---

Welcome to **Day 4**! 🧬

You often store data in arrays (e.g., shopping cart items, tag scores).
Sometimes you need to **modify** those arrays on the fly *before* sending them to the client.
Do **NOT** loop in Node.js. Use MongoDB Operators.

## 1. `$map`: The Transformation

Works exactly like `Array.prototype.map()` in JS.

**Scenario**: You have prices in USD. You want to add a field showing prices in EUR (x0.85).

```javascript
db.orders.aggregate([
  {
    $project: {
      items: {
        $map: {
          input: "$items",
          as: "item", // Variable name
          in: {
            name: "$$item.name",
            priceUSD: "$$item.price",
            priceEUR: { $multiply: ["$$item.price", 0.85] }
          }
        }
      }
    }
  }
])
```
*Note the double dollar sign `$$` to refer to the variable defined in `as`.*

## 2. `$filter`: The Cleaner

Works like `Array.prototype.filter()`.

**Scenario**: You have an array of `scores`. You only want to show scores > 80.

```javascript
db.students.aggregate([
  {
    $project: {
      highScores: {
        $filter: {
          input: "$scores",
          as: "score",
          cond: { $gt: ["$$score", 80] }
        }
      }
    }
  }
])
```

## 3. `$reduce`: The Aggregator

Works like `Array.prototype.reduce()`.

**Scenario**: You have an array of objects `{ type: "A", value: 10 }`. You want to sum up values but *only for type A*.

```javascript
db.data.aggregate([
  {
    $project: {
      totalTypeA: {
        $reduce: {
          input: "$data",
          initialValue: 0,
          in: {
            $cond: {
              if: { $eq: ["$$this.type", "A"] },
              then: { $add: ["$$value", "$$this.value"] },
              else: "$$value"
            }
          }
        }
      }
    }
  }
])
```
*`$$value` is the accumulator. `$$this` is the current element.*

## 4. `$concatArrays`: The Merger

Joins multiple arrays into one.

```javascript
{ $project: { allTags: { $concatArrays: ["$tags1", "$tags2"] } } }
```

---

### 🧠 Daily Challenge
You have a `Cart` with items: `[{ name: "Apple", price: 10, discount: true }, { name: "Video Game", price: 50, discount: false }]`.
1. Use `$filter` to get only discounted items.
2. Use `$map` to apply a 10% off label to them.
3. Use `$reduce` to calculate the total checkout price.

See you on **Day 5** for our **Mini Project**: Building an **Analytics Dashboard**! 📊


---

## Next Step

[**Next: Mini Project Analytics Dashboard →**](/blog/mongodb/week-3-day-5-mini-project-analytics-dashboard)