---
title: 'Week 2 Day 3: Reverse Proxies - Protecting the Backend'
description: 'Nginx, HAProxy, and why you should never expose your application server directly to the internet.'
pubDate: 'Sep 23 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week2", "security"]
series: "System Design Roadmap"
---

Directly exposing your Node.js or Python app to `0.0.0.0` is risky and inefficient.
Instead, we put a **Reverse Proxy** in front.

## Forward Proxy vs Reverse Proxy
- **Forward Proxy**: Protects the *Client*. (VPN, School/Office firewall). "I want to access Google anonymously."
- **Reverse Proxy**: Protects the *Server*. "I want to protect my backend from the internet."

## Why use a Reverse Proxy? (Nginx)
1. **Security**: Hide implementation details. The internet only sees Nginx.
2. **SSL Termination**: Nginx handles the heavy encryption/decryption (HTTPS). Your app speaks plain HTTP internally (faster).
3. **Caching**: Nginx can cache static files (CSS, Images) so your app doesn't have to serve them.
4. **Load Balancing**: Yes, Nginx is also a load balancer!

## Configuration Example (Nginx)
```nginx
server {
    listen 80;
    server_name myapp.com;

    location / {
        proxy_pass http://localhost:3000; # Forward to Node App
        proxy_set_header Host $host;
    }
    
    location /static/ {
        root /var/www/html; # Serve files directly
    }
}
```

Tomorrow: **CDNs** - Making your site fast for users in Australia! 🦘


---

## Next Step

[**Next: Cdns →**](/blog/system-design/week2/week-2-day-4-cdns)