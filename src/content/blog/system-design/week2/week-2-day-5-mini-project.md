---
title: 'Week 2 Day 5: Mini Project - Static Site with Load Balancing'
description: 'Simulating a production environment with Docker and Nginx.'
pubDate: 'Sep 25 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week2", "project"]
series: "System Design Roadmap"
---

Today we will simulate **Horizontal Scaling** on your laptop using Docker.
We will run 3 instances of a web server and put Nginx in front as a Load Balancer.

## Requirements
- Docker Installed.

## 1. Create a Simple Server (`app.js`)
We want to know *which* server is responding.
```javascript
const express = require('express');
const app = express();
const ID = Math.floor(Math.random() * 1000);

app.get('/', (req, res) => {
    res.send(`Hello from Server ID: ${ID}`);
});

app.listen(3000, () => console.log(`Running on 3000, ID: ${ID}`));
```

## 2. Dockerfile
```dockerfile
FROM node:18
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD ["node", "app.js"]
```

## 3. Nginx Config (`nginx.conf`)
Configure Nginx to define an `upstream` group of servers.
```nginx
events {}
http {
    upstream backend {
        server app1:3000;
        server app2:3000;
        server app3:3000;
    }

    server {
        listen 80;
        location / {
            proxy_pass http://backend;
        }
    }
}
```

## 4. Docker Compose (`docker-compose.yml`)
Spin it all up!
```yaml
version: '3'
services:
  app1:
    build: .
  app2:
    build: .
  app3:
    build: .
  lb:
    image: nginx
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    ports:
      - "8080:80"
```

## 5. Test It
Run `docker-compose up`.
Open `http://localhost:8080`.
Refresh multiple times.
You should see:
- "Hello from Server ID: 123"
- "Hello from Server ID: 456"
- "Hello from Server ID: 789"

Congratulations! You just built a horizontally scaled architecture. 🏗️
Next week: **Databases**. Storing data safely at scale.


---

## Next Step

[**Next: Relational Vs Nosql →**](/blog/system-design/week3/week-3-day-1-relational-vs-nosql)