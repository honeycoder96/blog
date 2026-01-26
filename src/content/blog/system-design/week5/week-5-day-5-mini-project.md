---
title: 'Week 5 Day 5: Mini Project - Job Queue with BullMQ'
description: 'Building an email worker system using Redis and Node.js.'
pubDate: 'Oct 10 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week5", "project"]
series: "System Design Roadmap"
---

We will build an Email Sending System.
Since SMTP servers are slow, we will offload the sending to a Background Worker.

## Requirements
- Redis Installed.
- `bullmq` library.

## 1. Setup
```bash
npm install express bullmq ioredis
```

## 2. The Producer (`producer.js`)
This is the API server.
```javascript
const express = require('express');
const { Queue } = require('bullmq');

const app = express();
app.use(express.json());

// Connection to Redis
const connection = { host: '127.0.0.1', port: 6379 };

// Create Queue
const emailQueue = new Queue('email-queue', { connection });

app.post('/send-email', async (req, res) => {
    const { to, subject, body } = req.body;
    
    // Add Job to Queue
    await emailQueue.add('send-email-job', { to, subject, body });

    res.json({ status: 'Queued', message: 'Email will be sent shortly.' });
});

app.listen(3000, () => console.log('API running on 3000'));
```

## 3. The Worker (`worker.js`)
This runs in the background.
```javascript
const { Worker } = require('bullmq');

const connection = { host: '127.0.0.1', port: 6379 };

// Simulate sending email (2 seconds delay)
const sendEmail = async (job) => {
    console.log(`Processing Job ${job.id}: Sending email to ${job.data.to}...`);
    await new Promise(r => setTimeout(r, 2000));
    console.log(`Job ${job.id} Done! Email Sent.`);
};

const worker = new Worker('email-queue', async (job) => {
    await sendEmail(job);
}, { connection });

console.log('Worker listening for jobs...');
```

## 4. Run it
1. Start Redis.
2. Run `node worker.js` (Worker acts as consumer).
3. Run `node producer.js`.
4. POST a request.
   - API returns "Queued" instantly (10ms).
   - Worker logs "Processing..." and finishes 2s later.

Congratulations! You decoupled your API from the heavy task. 🦅
Next week: **Microservices**. Breaking the Monolith! 🔨


---

## Next Step

[**Next: Monolith Vs Microservices →**](/blog/system-design/week6/week-6-day-1-monolith-vs-microservices)