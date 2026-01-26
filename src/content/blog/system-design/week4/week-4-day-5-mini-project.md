---
title: 'Week 4 Day 5: Mini Project - Mock Replicated KV Store'
description: 'Simulating data replication and read quorums in Node.js.'
pubDate: 'Oct 05 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week4", "project"]
series: "System Design Roadmap"
---

We will build a simulation of a 3-node database.
We will write to all 3, and read from 2 to see how consistency works.

## 1. The Store (`node.js`)
Run 3 instances of this server on ports 3001, 3002, 3003.

```javascript
const express = require('express');
const app = express();
app.use(express.json());

let data = {}; // In-memory DB

app.post('/write', (req, res) => {
    const { key, value, timestamp } = req.body;
    // Last Write Wins logic
    if (!data[key] || timestamp > data[key].timestamp) {
        data[key] = { value, timestamp };
    }
    res.json({ status: 'ok' });
});

app.get('/read/:key', (req, res) => {
    const { key } = req.params;
    res.json(data[key] || null);
});

const PORT = process.argv[2] || 3000;
app.listen(PORT, () => console.log(`Node running on ${PORT}`));
```

## 2. The Client (`client.js`)
This script acts as the Coordinator.

```javascript
const axios = require('axios');

const NODES = ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'];

// Write Quorum (W=3)
async function write(key, value) {
    const timestamp = Date.now();
    const promises = NODES.map(node => 
        axios.post(`${node}/write`, { key, value, timestamp })
             .catch(e => null) // Ignore errors
    );
    await Promise.all(promises);
    console.log(`Wrote ${key}=${value} to all nodes.`);
}

// Read Quorum (R=2)
async function read(key) {
    const promises = NODES.map(node => 
        axios.get(`${node}/read/${key}`)
             .catch(e => null)
    );
    const results = await Promise.all(promises);
    
    // Find latest timestamp
    let latest = null;
    results.forEach(res => {
        if (res && res.data) {
            if (!latest || res.data.timestamp > latest.timestamp) {
                latest = res.data;
            }
        }
    });
    console.log(`Read ${key}:`, latest ? latest.value : 'Not found');
}

// Write then Read
write('name', 'Cody').then(() => read('name'));
```

## Experiment
1. Start all 3 nodes. Run client. It works.
2. **Kill Node 3003**. Run client. 
   - Write will succeed on 3001/3002.
   - Read will succeed (if it hits 3001/3002).
   - This proves **Availability** despite failure!

Next week: **Messaging & Async**. Decoupling systems with Kafka! 📨


---

## Next Step

[**Next: Message Queues →**](/blog/system-design/week5/week-5-day-1-message-queues)