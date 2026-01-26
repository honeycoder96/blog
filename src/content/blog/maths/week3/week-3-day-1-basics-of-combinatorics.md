---
title: 'Week 3 Day 1: Basics of Combinatorics - Counting is Hard'
description: 'How many ways can you arrange 5 books? How many ways to choose 3 toppings from 10? The art of counting without counting.'
pubDate: 'Jul 12 2025'
heroImage: 
  src: '/images/maths/week3/day1.png'
  alt: 'Combinatorics Visualization'
tags: ["maths", "cp", "week3", "combinatorics"]
series: "Maths Roadmap for CP"
---

Welcome to **Week 3**! This week is all about **counting**.

Counting sounds easy (1, 2, 3...), but in competitive programming, "Counting" means "Combinatorics".

## 1. Permutations ($nPr$)
A **Permutation** is an arrangement of items where **order matters**.

**Example:**
You have 3 students (A, B, C). How many ways can they stand in a line?
- ABC, ACB, BAC, BCA, CAB, CBA
- Total = 6

Formula:
$$ P(n, r) = \frac{n!}{(n-r)!} $$
To arrange $n$ items in $n$ spots: $n!$ (Factorial).

## 2. Combinations ($nCr$)
A **Combination** is a selection of items where **order does NOT matter**.

**Example:**
You have 3 fruits (Apple, Banana, Orange). Choose 2.
- {Apple, Banana}, {Apple, Orange}, {Banana, Orange}
- Total = 3
- {Apple, Banana} is the same as {Banana, Apple}.

Formula:
$$ C(n, r) = \binom{n}{r} = \frac{n!}{r!(n-r)!} $$

This formula is the bread and butter of combinatorics.

## 3. Calculating $nCr$ in Code
We can't just compute factorials for large $n$ (overflow!). We often compute $nCr \pmod M$.

### Approach 1: Use the Formula (with Modular Inverse)
$$ \binom{n}{r} = n! \times (r!)^{-1} \times ((n-r)! )^{-1} \pmod M $$
We precompute factorials and use Fermat's Little Theorem for the inverse.

```javascript
/* Precomputing Factorials */
const MOD = 1000000007n;
const MAX = 100005;
const fact = new Array(MAX).fill(1n);

function precompute() {
    for (let i = 2; i < MAX; i++) {
        fact[i] = (fact[i - 1] * BigInt(i)) % MOD;
    }
}

// Function to calculate nCr % p
function nCr(n, r) {
    if (r < 0 || r > n) return 0n;
    let num = fact[n];
    let den = (fact[r] * fact[n - r]) % MOD;
    return (num * modInverse(den, MOD)) % MOD;
}
```

### Approach 2: Recursive (Pascal's Triangle)
We'll cover this tomorrow! It's better for smaller $N$ but works without modular inverse.

## 4. Problem: Paths in a Grid
You are at $(0, 0)$ and want to reach $(R, C)$. You can only move Right or Down. How many paths?
You must make exactly $R$ moves Down and $C$ moves Right. Total moves = $R+C$.
You just need to choose *which* of those moves are "Right" moves.

Answer:
$$ \binom{R+C}{C} \text{ or } \binom{R+C}{R} $$

See you on **Day 2** for Pascal’s Triangle! 🔺


---

## Next Step

[**Next: Pascal S Triangle →**](/blog/maths/week3/week-3-day-2-pascal-s-triangle)