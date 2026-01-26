---
title: 'Week 7 Day 5: Mini Project - Secure Notes API'
description: 'Adding Rate Limiting, Winston Logging, and Simple Token Auth.'
pubDate: 'Oct 20 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week7", "project"]
series: "System Design Roadmap"
---

We will build a secured API for storing notes.

## Requirements
- `express-rate-limit`
- `winston` (for logging)
- `helmet` (for security headers)

## 1. Implementation
```javascript
const express = require('express');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const helmet = require('helmet');

const app = express();
app.use(express.json());
app.use(helmet()); // Basic Headers security

// 1. Logger Setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.Console()
  ],
});

// Middleware to log requests
app.use((req, res, next) => {
    logger.info({ path: req.path, method: req.method, ip: req.ip });
    next();
});

// 2. Rate Limiter (Token Bucket logic under the hood)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: 'Too many requests, please try again later.'
});
app.use(limiter);

// 3. Simple Auth Middleware
const auth = (req, res, next) => {
    if (req.headers.authorization === 'Bearer secret-token') {
        next();
    } else {
        logger.warn('Unauthorized access attempt');
        res.status(401).send('Unauthorized');
    }
};

// Routes
app.get('/notes', auth, (req, res) => {
    res.json([{ id: 1, text: 'Secret Note' }]);
});

app.listen(3000, () => logger.info('Server running on 3000'));
```

## Testing
1. **Access without Token**: 401 Unauthorized. Logger shows Warning.
2. **Access with Token**: 200 OK.
3. **Spam 6 times**: 429 Too Many Requests.

You've built a production-ready template!
Next Week: **The Grand Finale**. Designing Twitter from scratch. 🚀


---

## Next Step

[**Next: The Design Process →**](/blog/system-design/week8/week-8-day-1-the-design-process)