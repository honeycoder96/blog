---
title: 'Mini Project: Secure Banking API with Transactions'
description: 'Week 4 Finale! We build a robust money transfer system where data integrity is guaranteed by ACID transactions.'
pubDate: 'Aug 21 2025'
heroImage: 
  src: '/blog-placeholder-5.jpg'
  alt: 'Banking API'
tags: ["mongodb", "project", "transactions"]
series: "MongoDB Roadmap"
---

Welcome to the **Week 4 Finale**! 💰

We've explored ACID transactions, Bulk Ops, and Change Streams.
Now, we build the core of a **FinTech App**.

## 1. The Requirement

We need a `POST /transfer` endpoint that:
1.  Takes `fromAccount`, `toAccount`, and `amount`.
2.  Checks validity (Does sender have money?).
3.  Moves money atomically.
4.  Logs the transaction.

## 2. The Schema

```javascript
// Account Schema
{
  "_id": "acc1",
  "owner": "Alice",
  "balance": 1000,
  "currency": "USD"
}

// Ledger Schema (Immutable Logs)
{
  "_id": "tx1",
  "from": "acc1",
  "to": "acc2",
  "amount": 100,
  "date": ISODate("...")
}
```

## 3. The Implementation

```javascript
const transferMoney = async (req, res) => {
  const { fromId, toId, amount } = req.body;
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();

    // 1. Check & Deduct Sender
    const sender = await Account.findOneAndUpdate(
      { _id: fromId, balance: { $gte: amount } }, // Atomic check!
      { $inc: { balance: -amount } },
      { session, new: true }
    );

    if (!sender) {
      throw new Error("Insufficient funds or invalid account");
    }

    // 2. Add to Receiver
    await Account.findByIdAndUpdate(
      toId,
      { $inc: { balance: amount } },
      { session }
    );

    // 3. Create Audit Log
    await Ledger.create([{
      from: fromId,
      to: toId, 
      amount,
      date: new Date()
    }], { session });

    // 4. Commit
    await session.commitTransaction();
    res.json({ success: true, newBalance: sender.balance });

  } catch (err) {
    await session.abortTransaction();
    res.status(400).json({ error: err.message });
  } finally {
    session.endSession();
  }
};
```

## 4. Why this is Robust?

1.  **Atomicity**: If the server crashes after deducting Alice but before adding to Bob, MongoDB rolls back. Alice gets her money back.
2.  **Concurrency**: If Alice sends 2 requests simultaneously, the database locks ensure she can't spend the same dollar twice.

## 5. Week 4 Wrap Up

You are now capable of building **Enterpise-Grade** systems with MongoDB.
Data integrity is no longer a concern.

**Next Week: Week 5 - Security & Deployment!** 🛡️
We will secure our database, add schema validation, and prepare for production.

Stay secure! 🔐


---

## Next Step

[**Next: Schema Validation →**](/blog/mongodb/week-5-day-1-schema-validation)