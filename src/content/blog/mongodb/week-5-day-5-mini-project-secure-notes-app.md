---
title: 'Mini Project: Secure Notes App'
description: 'Week 5 Finale! We build a secure backend with Schema Validation, RBAC, and Field-Level Encryption.'
pubDate: 'Aug 26 2025'
heroImage: 
  src: '/blog-placeholder-5.jpg'
  alt: 'Secure App'
tags: ["mongodb", "project", "security"]
series: "MongoDB Roadmap"
---

Welcome to the **Week 5 Finale**! 🔐

We have learned:
- Schema Validation
- Authentication & RBAC
- Environment Management
- Backups

Now, let's build a **Secure Notes App** backend.

## 1. Requirements

1.  Users must have valid data (Schema Validation).
2.  The `Note` content must be **Encrypted** in the database (Client-Side Encryption logic).
3.  The database user must have least-privilege access.

## 2. Schema Validation (The Rules)

```javascript
db.createCollection("notes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["owner", "title", "content", "isPrivate"],
      properties: {
        title: {
          bsonType: "string",
          maxLength: 100,
          description: "Title is required and limited to 100 chars"
        },
        isPrivate: {
           bsonType: "bool"
        }
      }
    }
  }
})
```

## 3. Application Side Encryption

We will use the `crypto` module in Node.js to encrypt the note content *before* it hits the database. Even if the DB Admin reads the `notes` collection, they will see garbage.

```javascript
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const secretKey = process.env.SECRET_KEY; // Never hardcode!

const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex')
  };
};

// Saving to DB
const newNote = new Note({
  owner: req.user._id,
  title: "Secret Plans",
  content: encrypt("Take over the world at dawn").content, // Encrypted!
  isPrivate: true
});
await newNote.save();
```

## 4. Deployment Check

Before going live:
1.  **Network**: Is IP Whitelisting on?
2.  **User**: Is the app using a `readWrite` user, NOT `root`?
3.  **Validation**: Are schemas enforced?
4.  **SSL**: Is TLS/SSL enabled? (Default in Atlas).

## 5. Week 5 Wrap Up

Your database is now a Fortress. 🏰
It validates data, rejects unauthorized users, and survives logical disasters.

**Next Week: Week 6 - Scaling!** 🚀
We reach the final frontier: Sharding, massive scale, and clustering.

Stay safe! 🛡️


---

## Next Step

[**Next: Replication Failover →**](/blog/mongodb/week-6-day-1-replication-failover)