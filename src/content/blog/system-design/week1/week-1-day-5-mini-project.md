---
title: 'Week 1 Day 5: Mini Project - URL Shortener API'
description: 'Build your first system design project. A simple Node.js API to shorten and redirect URLs.'
pubDate: 'Sep 20 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week1", "project"]
series: "System Design Roadmap"
---

Welcome to our first **Mini Project**!
We will build a simple version of **Bit.ly**.

## Requirements
1. **Shorten**: Accept a long URL, return a short ID.
2. **Redirect**: Access short ID, redirect to long URL.
3. **Data**: Store in memory (for now).

## The Stack
- **Language**: JavaScript (Node.js)
- **Framework**: Express.js
- **Database**: In-Memory Map (Future: Redis/Postgres)

## Implementation

### 1. Setup
```bash
npm init -y
npm install express shortid
```

### 2. The Code (`server.js`)
```javascript
const express = require('express');
const shortid = require('shortid');

const app = express();
app.use(express.json());

// Database (In-Memory)
const urlDatabase = {};

// 1. Shorten URL
app.post('/shorten', (req, res) => {
    const { longUrl } = req.body;
    if (!longUrl) return res.status(400).json({ error: 'longUrl required' });

    const id = shortid.generate();
    urlDatabase[id] = longUrl;

    res.json({ 
        original: longUrl, 
        short: `http://localhost:3000/${id}` 
    });
});

// 2. Redirect
app.get('/:id', (req, res) => {
    const { id } = req.params;
    const longUrl = urlDatabase[id];

    if (longUrl) {
        res.redirect(longUrl);
    } else {
        res.status(404).send('URL not found');
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

## Testing
1. **POST** to `http://localhost:3000/shorten`
   Body: `{ "longUrl": "https://www.google.com" }`
   Response: `{ "short": "http://localhost:3000/ad23s" }`
2. **GET** `http://localhost:3000/ad23s`
   Result: Redirects to Google!

## System Design Critique
This works for 1 user. What if we have 1 million?
- **Issue**: In-memory data is lost on restart.
- **Fix**: Use a Database (Week 3).
- **Issue**: Single server can't handle load.
- **Fix**: Multiple servers + Load Balancer (Week 2).
- **Issue**: Short IDs might collide (rare, but possible).

Next week, we tackle **Scalability**! We will make this robust. 🚀


---

## Next Step

[**Next: Vertical Vs Horizontal Scaling →**](/blog/system-design/week2/week-2-day-1-vertical-vs-horizontal-scaling)