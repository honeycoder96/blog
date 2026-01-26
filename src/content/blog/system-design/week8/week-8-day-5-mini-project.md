---
title: 'Week 8 Day 5: Mini Project - Scalable Chat App'
description: 'The Capstone. Building a real-time messaging system with WebSockets and Redis Pub/Sub.'
pubDate: 'Oct 25 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week8", "project"]
series: "System Design Roadmap"
---

This is it. The Final Project.
We will build a Chat App that scales across multiple servers using Redis Adapter.

## The Problem with simple WebSockets
Using `socket.io` on one server works.
But if User A is on Server 1, and User B is on Server 2, they **cannot** talk. Server 1 doesn't know about User B's socket.

## Solution: Redis Pub/Sub Adapter
When A sends message, Server 1 publishes it to Redis.
Redis broadcasts to Server 2.
Server 2 sees the message and pushes it to User B.

## Implementation

### 1. Setup
```bash
npm install express socket.io socket.io-redis
```

### 2. Server Code (`server.js`)
```javascript
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");

const app = express();
const server = http.createServer(app);

// Redis Client
const pubClient = createClient({ url: "redis://localhost:6379" });
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    const io = new Server(server);
    
    // Bind Redis Adapter
    io.adapter(createAdapter(pubClient, subClient));

    io.on('connection', (socket) => {
        console.log(`User connected on ${process.env.PORT}`);

        socket.on('chat message', (msg) => {
            // Broadcast to everyone (across all servers)
            io.emit('chat message', msg);
        });
    });

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
```

## 3. Running multiple instances
1. `PORT=3001 node server.js`
2. `PORT=3002 node server.js`
3. Connect Client A to 3001.
4. Connect Client B to 3002.
5. Send message. **It works!** Redis bridged the servers.

## Graduation 🎓
You have completed the **8-Week System Design Roadmap**.
You built:
- URL Shortener
- Load Balanced Site
- Cached API
- Replicated Store
- Async Job Queue
- Microservices
- Secured API
- Global Chat

You are now ready to tackle scalable systems. **Go build something huge.** 🚀
