---
title: 'Mini Project: Designing a Scalable Blog Schema'
description: 'Week 1 Finale! We take everything we learned—embedding, referencing, and patterns—and build a production-ready schema for a blogging platform.'
pubDate: 'Aug 06 2025'
heroImage: 
  src: '/images/mongodb/week-1-day-5.png'
  alt: 'Blog Platform Schema Diagram'
# 
tags: ["mongodb", "project", "schema-design"]
series: "MongoDB Roadmap"
---

🎉 **Congratulations!** You've made it to the end of Week 1.

We've covered:
- **Embed vs. Reference**
- **1:1, 1:N, N:M Relationships**
- **Patterns** (Subset, Attribute, Bucket)
- **Trade-offs** (Norm vs. Denorm)

Today, we build the schema for **"MongoBlog"**, a Medium-like blogging platform.

---

## 1. Requirements

1. **Users** can write posts and follow other users.
2. **Posts** have a title, body, tags, and can have thousands of comments.
3. **Home Feed** needs to load quickly (Author Name + Title + Tags).
4. **Analytics**: We need to track page views per hour.

---

## 2. The Schema Design

### A. The User Schema (1:N Self-Referencing)

We'll use standard references for "Following" because it's an unbounded N:M relationship.

```javascript
// User Schema
{
  "_id": ObjectId("user1"),
  "username": "honeycoder",
  "email": "honey@example.com",
  "bio": "Full Stack Dev",
  // 1:N - Following (Referencing)
  "following": [ObjectId("user2"), ObjectId("user3")] 
}
```

### B. The Post Schema (The Hybrid Approach)

Here we apply the **Denormalization** and **Subset Patterns**.

1. **Denormalize the Author**: Embed `author_name` so we don't need a join for the home feed.
2. **Subset Pattern for Comments**: Embed the *first 3 comments* for the UI preview. Move the rest to a separate collection.

```javascript
// Post Schema
{
  "_id": ObjectId("post101"),
  "title": "Mastering MongoDB",
  "slug": "mastering-mongodb",
  "body": "Markdown content here...",
  "tags": ["database", "nosql"],
  "published_at": ISODate("2025-08-06T10:00:00Z"),
  
  // DENORMALIZATION: Embed basics to avoid Lookup
  "author": {
    "_id": ObjectId("user1"),
    "username": "honeycoder",
    "avatar": "honey.png"
  },

  // PERFORMANCE: Pre-computed count
  "comments_count": 520,

  // SUBSET PATTERN: Embed top 3 comments
  "recent_comments": [
    { "user": "Dave", "text": "Great read!" },
    { "user": "Sarah", "text": "Very helpful." },
    { "user": "Bob", "text": "Thanks!" }
  ]
}
```

### C. The Comment Schema (1:N)

The full list of comments.

```javascript
// Comment Schema
{
  "_id": ObjectId("c1"),
  "post_id": ObjectId("post101"), // Parent Reference
  "user_id": ObjectId("user99"),
  "text": "Detailed comment here...",
  "created_at": ISODate("2025-08-06T10:30:00Z")
}
```

### D. Analytics (The Bucket Pattern)

For tracking views, we don't want 1 document per view. We bucket by hour.

```javascript
// Analytics Schema (Per Post Per Day)
{
  "post_id": ObjectId("post101"),
  "date": "2025-08-06",
  "hourly_views": {
    "00": 5,
    "01": 12,
    "02": 8,
    // ...
    "23": 45
  },
  "total_daily_views": 1500
}
```

---

## 3. Why This Wins

1.  **Read Speed**: The Home Feed queries ONLY the `posts` collection. No joins needed because `author.username` is embedded.
2.  **Write Speed**: Comments are fast inserts into the `comments` collection.
3.  **Storage**: Analytics are compressed 24:1 using the Bucket Pattern.

---

## 4. Week 1 Wrap Up

You now have a solid foundation in **Data Modeling**.

**Next Week: Week 2 - Indexing & Performance!** ⚡
We will learn how to make these queries fly using Compound Indexes, Multikey Indexes, and analyzing Explain Plans.

REST UP! 🛌


---

## Next Step

[**Next: Intro To Indexes →**](/blog/mongodb/week-2-day-1-intro-to-indexes)