---
title: 'Week 1 Day 2: The Client-Server Model - How the Web Works'
description: 'The fundamental architecture of the internet. Request-Response cycle and statelessness.'
pubDate: 'Sep 17 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week1", "foundations"]
series: "System Design Roadmap"
---

Today we cover the most basic pattern in distributed systems: **Client-Server**.

## 1. The Components
- **Client**: The device requesting information (Your browser, mobile app, IoT device).
- **Server**: The computer listening for requests and providing resources (AWS EC2, your laptop).
- **Network**: The internet/wires connecting them.

## 2. The Request-Response Cycle
1. **User Action**: You type `google.com` and hit Enter.
2. **DNS Resolution**: Browser asks "Where is google.com?" (IP Address).
3. **Request**: Browser sends an HTTP Request to that IP.
   `GET / HTTP/1.1`
4. **Processing**: Server reads request, fetches data from Database.
5. **Response**: Server sends back HTML/JSON.
   `200 OK`
6. **Rendering**: Browser draws the page.

## 3. Statelessness
The web is primarily **stateless**.
The server treats every request as a new interaction. It doesn't "remember" the previous request by default.
*Why?* Scalability. If Server A handles Request 1, Server B can handle Request 2 without needing Server A's memory.

To "remember" things (like "Who is logged in?"), we send **Cookies** or **Tokens** with every request.

## 4. Communication Protocols
- **HTTP/HTTPS**: Standard web traffic.
- **WebSockets**: Real-time, two-way communication (Chat apps).
- **TCP/UDP**: Low-level transport. TCP is reliable (web), UDP is fast (gaming/video).

## 5. Coding Snippet (Node.js)
A simple server:
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello, Client!');
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
```

Tomorrow: We dive deeper into **HTTP & REST APIs**! 🔗


---

## Next Step

[**Next: Http Rest →**](/blog/system-design/week1/week-1-day-3-http-rest)