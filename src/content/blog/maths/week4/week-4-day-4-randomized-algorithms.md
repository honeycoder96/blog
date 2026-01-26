---
title: 'Week 4 Day 4: Randomized Algorithms - Using Chaos for Good'
description: 'Sometimes the best solution is a random one. Learn Fisher-Yates shuffle and Freivalds’ Algorithm.'
pubDate: 'Jul 20 2025'
heroImage: 
  src: '/images/maths/week4/day4.png'
  alt: 'Randomized Algorithm Visualization'
tags: ["maths", "cp", "week4", "randomization"]
series: "Maths Roadmap for CP"
---

Most algorithms are **Deterministic**: Input A always leads to Output B.
**Randomized Algorithms** effectively toss coins to make decisions.

Why? Because sometimes they are **much faster** or **much simpler**.

## 1. Fisher-Yates Shuffle
**Problem:** Shuffle an array of $N$ elements such that every permutation is equally likely.
Naive solution: Pick a random element, move to new array. $O(N^2)$ if removing, or complicated.

**Fisher-Yates:**
Iterate from last element to first. Swap current element with a random element from $0 \dots i$.
```javascript
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr; // In-place, O(N)
}
```
**Why?**
- Last element has $1/N$ chance to be any of $N$.
- Second last has $1/(N-1)$ chance...
- Uniform distribution guaranteed.

## 2. Matrix Verification (Freivalds' Algorithm)
**Problem:** Given three $N \times N$ matrices $A, B, C$. Check if $A \times B = C$.
- Naive Multiplication: $O(N^3)$ (Too slow for $N=2000$).
- **Randomized:** $O(N^2)$.

**Idea:**
Pick a random column vector $r$ of size $N$ (values 0 or 1).
Check if $A \times (B \times r) = C \times r$.
- $B \times r$ takes $O(N^2)$.
- $A \times (result)$ takes $O(N^2)$.
- Total $O(N^2)$.

If $A \times B \neq C$, this check fails with probability $\ge 1/2$.
Run it $k$ times. Failure probability becomes $(1/2)^k$. For $k=20$, it's negligible.

## 3. Randomized Quicksort
Standard Quicksort picks the first element as pivot.
- Worst case (Sorted Array): $O(N^2)$.
- **Randomized Pivot**: $O(N \log N)$ expected.

By picking a random pivot, we make the "worst case" incredibly unlikely to happen by accident.

## 4. Coding Problem: finding a "Heavy Person"
**Problem:** In a group of $N$ people, a "Heavy Person" is someone known by everyone, but knows no one. Find them using `knows(a, b)` queries.
Naive: Check everyone against everyone $O(N^2)$.
Randomized? Not typically used here, but we can do it in $O(N)$ deterministically.

However, consider **Miller-Rabin Primality Test** (Week 5). It's a randomized algorithm that tells us if a number is prime with high probability!

## 5. Summary
Randomization isn't just for games. It's a tool for:
1. **Breaking symmetry** (Pivot choice).
2. **Speeding up verification** (Matrix checks).
3. **Approximation** (Monte Carlo).

Tomorrow: **Mixed Probability Problems**. We put everything together! 🧩


---

## Next Step

[**Next: Problem Solving Session →**](/blog/maths/week4/week-4-day-5-problem-solving-session)