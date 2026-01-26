---
title: 'Week 7 Day 1: Authentication & Authorization - Who are you?'
description: 'AuthN vs AuthZ. Session vs JWT. Securing your API.'
pubDate: 'Oct 16 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week7", "security"]
series: "System Design Roadmap"
---

Security starts with identifying the user.

## 1. Authentication (AuthN)
"Who are you?"
- **Credentials**: Username/Password.
- **MFA**: Password + SMS Code.
- **SSO (Single Sign On)**: "Log in with Google".

## 2. Authorization (AuthZ)
"What are you allowed to do?"
- **Roles**: Admin, Editor, Viewer.
- **Permissions**: `read:posts`, `write:posts`, `delete:users`.

## 3. Session vs JWT
When a user logs in, how do we remember them?

### Session-Based (Stateful)
1. Server creates a `Sessions` table entry.
2. Sends `session_id` cookie to user.
3. User sends cookie with every request.
4. Server looks up ID in DB.
- **Pros**: Easy to revoke (delete from DB).
- **Cons**: Requires DB lookup on every request (slow).

### JWT (JSON Web Token - Stateless)
1. Server creates a signed JSON object: `{ "userId": 1, "role": "admin" }`.
2. Signs it with a SECRET key.
3. Sends token to user.
4. User sends token. Server verifies signature using math (no DB).
- **Pros**: Fast, Scalable (Server needs no memory).
- **Cons**: Hard to revoke (Tokens are valid until expiry).

## 4. OAuth 2.0
The standard for Authorization.
"Allow this App to access your Google Photos".
It grants an **Access Token** (usually simple JWT) to the app.

Tomorrow: How to stop one user from crashing your server. **Rate Limiting**. 🛑


---

## Next Step

[**Next: Rate Limiting Throttling →**](/blog/system-design/week7/week-7-day-2-rate-limiting-throttling)