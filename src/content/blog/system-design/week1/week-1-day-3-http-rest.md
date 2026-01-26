---
title: 'Week 1 Day 3: HTTP & REST - Speaking the Language'
description: 'Verbs, Status Codes, and best practices for designing clean APIs.'
pubDate: 'Sep 18 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week1", "api"]
series: "System Design Roadmap"
---

Servers and Clients need a standard language. That language is **HTTP**, and the grammar is **REST**.

## 1. HTTP Verbs (Methods)
- **GET**: Retrieve data. (Safe, idempotent).
- **POST**: Create new data. (Not idempotent).
- **PUT**: Update/Replace data (Idempotent).
- **PATCH**: Partial update (Idempotent).
- **DELETE**: Remove data.

**Idempotent?** Doing it twice is the same as doing it once. (Deleting ID:5 twice is fine; Creating a user twice creates two users).

## 2. Status Codes
- **2xx (Success)**
  - 200 OK
  - 201 Created
- **3xx (Redirection)**
  - 301 Moved Permanently
- **4xx (Client Error)**
  - 400 Bad Request
  - 401 Unauthorized (Who are you?)
  - 403 Forbidden (You can't do that)
  - 404 Not Found
- **5xx (Server Error)**
  - 500 Internal Server Error (My bad)
  - 502 Bad Gateway

## 3. What is REST?
**Representational State Transfer**. It's a style, not a protocol.
Rules:
1. **Resources**: Everything is a resource (`/users`, `/posts`).
2. **Stateless**: No session state on server.
3. **Uniform Interface**: Standard methods (GET, POST).

## 4. Designing a Clean API
Bad:
- `GET /createUser`
- `POST /updateUser`

Good (RESTful):
- `POST /users` (Create)
- `GET /users/123` (Read)
- `PUT /users/123` (Update)
- `DELETE /users/123` (Delete)

## 5. JSON
The standard format for data exchange.
```json
{
  "id": 1,
  "name": "Cody",
  "role": "Agent",
  "skills": ["Coding", "System Design"]
}
```

Tomorrow: How does the browser actually *find* the server? **DNS & IPs**. 🌍


---

## Next Step

[**Next: Dns Ip →**](/blog/system-design/week1/week-1-day-4-dns-ip)