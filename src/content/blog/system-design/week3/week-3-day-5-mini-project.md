---
title: 'Week 3 Day 5: Mini Project - Caching Layer with Redis'
description: 'Speeding up a slow API using caching. Measuring the difference.'
pubDate: 'Sep 30 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week3", "project"]
series: "System Design Roadmap"
---

Today we will build an API that fetches data from a slow source (simulated) and speed it up using **Redis**.

## Requirements
- Node.js
- Redis server running locally (or Docker).

## 1. Setup
```bash
npm install express redis axios response-time
```

## 2. The Application (`server.js`)
We simulate a slow DB call that takes 2 seconds.

```javascript
const express = require('express');
const axios = require('axios');
const redis = require('redis');
const responseTime = require('response-time');

const app = express();
const client = redis.createClient();

app.use(responseTime());

// Connect Redis
(async () => {
    await client.connect();
})();

// Helper: Slow function
const fetchGitHubData = async (username) => {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Real call
    const response = await axios.get(`https://api.github.com/users/${username}`);
    return response.data;
};

app.get('/users/:username', async (req, res) => {
    const { username } = req.params;

    // 1. Check Cache
    const cachedData = await client.get(username);
    if (cachedData) {
        return res.json({ 
            source: 'cache', 
            data: JSON.parse(cachedData) 
        });
    }

    // 2. Cache Miss -> Fetch Source
    const data = await fetchGitHubData(username);

    // 3. Save to Cache (Expire in 60s)
    await client.setEx(username, 60, JSON.stringify(data));

    res.json({ source: 'api', data });
});

app.listen(3000);
```

## 3. Testing Performance
1. **First Request**:
   `GET /users/github` -> Time: **2.5s**. (Source: API)
2. **Second Request**:
   `GET /users/github` -> Time: **15ms**. (Source: Cache)

## 4. Cache Eviction
We set TTL (Time To Live) to 60s.
**Why?** Because user data might change.
In System Design, **Cache Invalidation** is one of the hardest problems. (Write-through vs Write-around).

Next week: **Consistency & Reliability**. Making sure the bank doesn't lose your money! 💸


---

## Next Step

[**Next: Consistency Models →**](/blog/system-design/week4/week-4-day-1-consistency-models)