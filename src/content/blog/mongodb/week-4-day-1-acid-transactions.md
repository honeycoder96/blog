---
title: 'ACID Transactions in MongoDB'
description: 'Yes, MongoDB supports multi-document ACID transactions! Learn how to ensure data integrity across multiple collections.'
pubDate: 'Aug 17 2025'
heroImage: 
  src: '/blog-placeholder-1.jpg'
  alt: 'ACID Transactions'
tags: ["mongodb", "transactions", "acid"]
series: "MongoDB Roadmap"
---

Welcome to **Week 4**! 💳
This week is about **Advanced Operations**.

For years, critics said: *"MongoDB is fast, but it doesn't have Transactions. It's not ACID compliant."*
Since **MongoDB 4.0 (2018)**, that is **FALSE**.
MongoDB supports fully ACID multi-document transactions.

## 1. What is ACID?

- **A - Atomicity**: All or nothing. If one part fails, everything rolls back.
- **C - Consistency**: Database constraints are preserved.
- **I - Isolation**: Other users don't see partial data while the transaction is running.
- **D - Durability**: Once committed, it's saved forever.

## 2. When do you need them?

In MongoDB, **single-document operations are ALWAYS atomic**.
If you update a User document, no one sees a "half-updated" user.

You ONLY need transactions when updating **multiple documents** across **multiple collections** where data integrity is critical.

**Example: Money Transfer**
1. Deduct $100 from Alice (Collection A)
2. Add $100 to Bob (Collection B)

If Step 1 succeeds but Step 2 fails, money disappears! 😱 You need a Transaction.

## 3. How to use Transactions (Node.js)

You need a **Session**.

```javascript
async function transferMoney(fromId, toId, amount) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const opts = { session };

    // Step 1: Deduct
    const sender = await Account.findOneAndUpdate(
      { _id: fromId },
      { $inc: { balance: -amount } },
      opts
    );

    if (sender.balance < 0) {
      throw new Error("Insufficient funds");
    }

    // Step 2: Add
    await Account.findOneAndUpdate(
      { _id: toId },
      { $inc: { balance: amount } },
      opts
    );

    // Commit!
    await session.commitTransaction();
    console.log("Success!");

  } catch (error) {
    // Rollback!
    await session.abortTransaction();
    console.error("Failed. Rolled back.", error);
  } finally {
    session.endSession();
  }
}
```

## 4. Performance Warning ⚠️

Transactions are **expensive**.
- They hold locks.
- They increase latency.
- They require a Replica Set (Transactions don't work on a standalone server).

**Best Practice**:
Design your schema to avoid transactions if possible (Embedding!). Use them only when absolutely necessary (like handling money).

---

### 🧠 Daily Challenge
1. Open your code.
2. Create a mock function `buyProduct(userId, productId)`.
3. It should:
   - Decrement `Product.stock`.
   - Create an `Order`.
4. Wrap it in a Transaction so you don't create an order if stock hits -1!

See you on **Day 2** for **Bulk Operations**! 📦


---

## Next Step

[**Next: Bulk Writes Operations →**](/blog/mongodb/week-4-day-2-bulk-writes-operations)