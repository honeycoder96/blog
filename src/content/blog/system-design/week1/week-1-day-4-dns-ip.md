---
title: 'Week 1 Day 4: DNS & IP - The Internet Phonebook'
description: 'Resolving domain names and routing packets. A, CNAME, and AAAA records explained.'
pubDate: 'Sep 19 2025'
heroImage: 
  src: '/systemdesign.jpg'
  alt: 'System Design roadmap hero image'
tags: ["system-design", "week1", "networking"]
series: "System Design Roadmap"
---

When you visit `google.com`, your computer doesn't know where that is. It needs an **IP Address** (like `142.250.190.46`).

**DNS (Domain Name System)** is the phonebook that translates names to numbers.

## 1. How DNS Works (The Journey)
1. **Local Cache**: Browser checks if you visited recently.
2. **OS Cache**: Operation System checks its `/etc/hosts`.
3. **Resolver (ISP)**: Your Internet Provider checks its cache.
4. **Root Server**: "I don't know google.com, but I know who handles `.com`."
5. **TLD Server (.com)**: "I know who handles `google.com`."
6. **Authoritative Nameserver**: "Here is the IP for `google.com`: 1.2.3.4".

## 2. DNS Record Types
- **A Record**: Points a name to an IPv4 address (`1.2.3.4`).
- **AAAA Record**: Points a name to an IPv6 address (`2001:...`).
- **CNAME (Alias)**: Points a name to another name.
  - `www.google.com` -> `google.com`.
- **MX Record**: Mail exchange (for emails).
- **NS Record**: Nameserver (who is authoritative).

## 3. IP Addresses
- **IPv4**: 32-bit (e.g., `192.168.1.1`). Ran out of addresses.
- **IPv6**: 128-bit (hexadecimal). Virtually infinite.

**Public vs Private IP**
- **Public**: Unique across the internet.
- **Private**: Local network only (e.g., `192.168.x.x` or `10.x.x.x`). NAT (Network Address Translation) connects private to public.

## 4. Latency
DNS lookup takes time (20ms - 100ms).
This is why we use **TTL (Time To Live)** to cache DNS records. High TTL = Less traffic, slower updates. Low TTL = More traffic, instant updates.

Tomorrow: **Mini Project**. We build a URL Shortener API! ✂️


---

## Next Step

[**Next: Mini Project →**](/blog/system-design/week1/week-1-day-5-mini-project)