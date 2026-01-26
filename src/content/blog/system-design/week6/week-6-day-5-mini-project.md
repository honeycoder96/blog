---
title: 'Week 6 Day 5: Mini Project - Microservices Todo App'
description: 'Building independent User and Task services communicating via HTTP.'
pubDate: 'Oct 15 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week6", "project"]
series: "System Design Roadmap"
---

We will build 2 services:
1. **User Service** (Port 3001): Manages Users.
2. **Task Service** (Port 3002): Manages Tasks. Needs to verify User ID by calling User Service.

## 1. User Service (`user-service.js`)
```javascript
const express = require('express');
const app = express();
const users = { '1': { name: 'Cody' } };

app.get('/users/:id', (req, res) => {
    const user = users[req.params.id];
    user ? res.json(user) : res.status(404).send('User not found');
});

app.listen(3001, () => console.log('User Service on 3001'));
```

## 2. Task Service (`task-service.js`)
```javascript
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const tasks = [];

app.post('/tasks', async (req, res) => {
    const { userId, title } = req.body;
    
    // Communicate with User Service
    try {
        await axios.get(`http://localhost:3001/users/${userId}`);
        // If success (200), proceed.
    } catch (err) {
        return res.status(400).send('Invalid User ID');
    }

    const task = { id: tasks.length + 1, userId, title };
    tasks.push(task);
    res.json(task);
});

app.listen(3002, () => console.log('Task Service on 3002'));
```

## 3. Creating an API Gateway (Simple Proxy)
We can use `http-proxy-middleware` or just Nginx to route `/users` and `/tasks`.

## Testing
1. Call Task Service with invalid user -> Error 400.
2. Call Task Service with valid user -> Success 200.

You have successfully implemented **Synchronous Microservice Communication**!

Next week: **Security & Monitoring**. Protecting your cluster. 🔒


---

## Next Step

[**Next: Authentication Authorization →**](/blog/system-design/week7/week-7-day-1-authentication-authorization)