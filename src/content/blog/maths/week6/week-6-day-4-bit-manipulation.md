---
title: 'Week 6 Day 4: Bit Manipulation - The Binary Magic'
description: 'XOR tricks, subset iteration, and low-level optimizations that save the day.'
pubDate: 'Jul 30 2025'
heroImage: 
  src: '/images/maths/week6/day4.png'
  alt: 'Bit Manipulation Visualization'
tags: ["maths", "cp", "week6", "bitwise"]
series: "Maths Roadmap for CP"
---

Welcome to the world of 0s and 1s.
Bit manipulation is fast, elegant, and often turns $O(N)$ into $O(1)$.

## 1. XOR Tricks
Properties of XOR ($\oplus$):
- $x \oplus x = 0$
- $x \oplus 0 = x$
- $A \oplus B = C \implies A \oplus C = B$

**Classic Problem:** Find the unique number in an array where every other number appears twice.
Solution: XOR all elements. The duplicates cancel out to 0. The result is the unique number.

## 2. Setting and Checking Bits
- **Check $k$-th bit:** `(n >> k) & 1`
- **Set $k$-th bit:** `n | (1 << k)`
- **Unset $k$-th bit:** `n & ~(1 << k)`
- **Toggle $k$-th bit:** `n ^ (1 << k)`

## 3. Useful Hakmem Tricks
- **Check if power of 2:** `(n & (n - 1)) == 0` (and $n > 0$)
- **Turn off rightmost 1-bit:** `n & (n - 1)`
- **Isolate rightmost 1-bit:** `n & -n` (Two's complement magic)

## 4. Iterating Subsets
To iterate all submasks of a mask `m`:
```javascript
for (let s = m; s > 0; s = (s - 1) & m) {
    // s is a subset of m
}
```
Complexity: $O(3^N)$ to iterate all submasks of all masks of length $N$.
(Why $3^N$? Each bit can be: 0 in mask, 1 in mask but 0 in submask, 1 in both).

## 5. Built-in Functions
In C++, we have `__builtin_popcount(n)` to count set bits.
In JS, we have to write it or use `n.toString(2).split('1').length - 1` (slow!) or the Kernighan algorithm:

```javascript
function popcount(n) {
    let count = 0;
    while (n > 0) {
        n = n & (n - 1);
        count++;
    }
    return count;
}
```

Tomorrow: **The Grand Finale**. We pick 3 tough problems that combine Probability, Geometry, and Number Theory! 🏁


---

## Next Step

[**Next: The Grand Finale →**](/blog/maths/week6/week-6-day-5-the-grand-finale)