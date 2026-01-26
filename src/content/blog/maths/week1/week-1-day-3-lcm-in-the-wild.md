---
title: 'Week 1 Day 3: LCM in the Wild - Scheduling & Cycles'
description: 'How to use Least Common Multiple to solve real-world scheduling problems, find cycles in data, and align periodic events.'
pubDate: 'Jul 04 2025'
heroImage: 
  src: '/math_week1_day3_lcm_apps.png'
  alt: 'LCM Scheduling visualization'
tags: ["maths", "cp", "week1", "problem-solving"]
series: "Maths Roadmap for CP"
---

Today we take our new toy, **LCM**, out for a spin.

LCM is surprisingly useful in systems design and algorithmic problems involving **periodic events**. If you have independent cycles running at different speeds, LCM tells you when they sync up.

## 1. The Periodic Alignment Problem

Imagine you have three servers:
- Server A backups every **4 hours**.
- Server B backups every **6 hours**.
- Server C backups every **10 hours**.

If they all just finished a backup right now, how many hours until they all backup **simultaneously** again?

**Solution:**
We need a number $T$ such that $T$ is divisible by 4, 6, and 10.
The smallest such $T$ is $\text{LCM}(4, 6, 10)$.

$$ \text{LCM}(4, 6) = 12 $$
$$ \text{LCM}(12, 10) = 60 $$

Answer: In **60 hours**.

## 2. Implementing LCM for an Array

To find the LCM of a list of numbers, we can apply the LCM function somewhat sequentially:
$$ \text{LCM}(a, b, c) = \text{LCM}(\text{LCM}(a, b), c) $$

### JavaScript Implementation
```javascript
function gcd(a, b) {
    if (b === 0) return a;
    return gcd(b, a % b);
}

function lcm(a, b) {
    if (a === 0 || b === 0) return 0;
    return Math.abs((a * b) / gcd(a, b));
}

function findLCMOfArray(arr) {
    let result = arr[0];
    for (let i = 1; i < arr.length; i++) {
        result = lcm(result, arr[i]);
    }
    return result;
}

console.log(findLCMOfArray([4, 6, 10])); // Output: 60
```

## 3. Classic Coding Problem: "The Jumping Frogs"

**Problem:**
Two frogs start at position 0.
- Frog A jumps $X$ units.
- Frog B jumps $Y$ units.
They want to meet at the same landing spot. What is the **first** coordinate (greater than 0) where they both land?

**Answer:**
This is simply $\text{LCM}(X, Y)$.

**Extension:**
What if Frog A starts at offset $O_A$ and Frog B at $O_B$?
Now we are looking for a time $t$ such that:
$$ O_A + k_1 X = O_B + k_2 Y $$
This turns into a *Linear Diophantine Equation*, which we will cover in Week 5! See how math topics connect? 🤯

## 4. Challenge for Tomorrow

We've dealt with one or two numbers. But what if we need to find prime numbers up to 1,000,000? Checking each one individually is too slow.

Tomorrow, we learn the **Sieve of Eratosthenes**, the ancient algorithm used to filter primes at lightning speed. ⚡

See you on **Day 4**!


---

## Next Step

[**Next: Finding Primes Fast →**](/blog/maths/week1/week-1-day-4-finding-primes-fast)