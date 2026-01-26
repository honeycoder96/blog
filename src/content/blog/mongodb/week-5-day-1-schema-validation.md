---
title: ' enforce Rules: MongoDB Schema Validation'
description: 'Schemaless does NOT mean structureless. Learn how to enforce data integrity at the database level using JSON Schema.'
pubDate: 'Aug 22 2025'
heroImage: 
  src: '/blog-placeholder-1.jpg'
  alt: 'Schema Validation'
tags: ["mongodb", "security", "validation"]
series: "MongoDB Roadmap"
---

Welcome to **Week 5**! 🛡️
This week is all about **Security and Production Readiness**.

One o the biggest myths about MongoDB is "It has no schema, so the data is messy."
While MongoDB is flexible, you absolutely CAN (and should) enforce rules.

## 1. Why Validate?

If your app has a bug, you might accidentally save:
`{ age: "twenty" }` instead of `{ age: 20 }`.
This breaks your analytics pipeline later.
**Schema Validation** rejects bad data at the database door.

## 2. JSON Schema Validator

You can define rules when creating a collection.

```javascript
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "age"],
      properties: {
        name: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        email: {
          bsonType: "string",
          pattern: "@mongodb\.com$",
          description: "must be a mongodb email"
        },
        age: {
          bsonType: "int",
          minimum: 18,
          maximum: 100,
          description: "must be an integer between 18 and 100"
        }
      }
    }
  }
})
```

## 3. Testing It

```javascript
// Success
db.users.insert({ name: "Alice", email: "alice@mongodb.com", age: 25 })

// Error: Document failed validation
db.users.insert({ name: "Bob", email: "bob@gmail.com", age: 10 })
```

## 4. Modifying Rules

You can add rules to existing collections using `collMod`.

```javascript
db.runCommand({
  collMod: "users",
  validator: {
    $jsonSchema: { ...newRules... }
  }
})
```

## 5. Validation Level & Action

- **validationLevel**: "strict" (default) checks all updates. "moderate" allows updates to existing invalid docs.
- **validationAction**: "error" (default) rejects the write. "warn" logs it but allows it.

---

### 🧠 Daily Challenge
1. Create a `products` collection.
2. Enforce that `price` must be a positive number.
3. Enforce that `category` must be one of `["Electronics", "Clothing", "Books"]` (Use `enum`).
4. Try to insert an invalid product and watch it fail!

See you on **Day 2** for **Role-Based Access Control**! 👮‍♂️


---

## Next Step

[**Next: Role Based Access Control →**](/blog/mongodb/week-5-day-2-role-based-access-control)