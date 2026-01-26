---
title: 'Week 5 Day 1: Chinese Remainder Theorem (CRT) - Unlocking the Universe'
description: 'How to solve a system of simultaneous congruences. Find a number that leaves specific remainders.'
pubDate: 'Jul 22 2025'
heroImage: 
  src: '/images/maths/week5/day1.png'
  alt: 'CRT Visualization'
tags: ["maths", "cp", "week5", "number-theory"]
series: "Maths Roadmap for CP"
---

Welcome to **Week 5**! We are entering the territory of advanced number theory.
These tools are less common but are usually the "key" to solving Hard-level problems.

## 1. The Problem
Find $x$ such that:
$$ x \equiv 2 \pmod 3 $$
$$ x \equiv 3 \pmod 5 $$
$$ x \equiv 2 \pmod 7 $$

Basically, we want a number that has specific remainders when divided by different moduli.
One solution is $23$.
$23 = 7 \cdot 3 + 2$
$23 = 4 \cdot 5 + 3$
$23 = 3 \cdot 7 + 2$

## 2. The Theorem
If $n_1, n_2, \dots, n_k$ are pairwise **coprime**, then the system of congruences:
$$ x \equiv a_1 \pmod{n_1} $$
$$ x \equiv a_2 \pmod{n_2} $$
$$ \dots $$
Has a **unique solution** modulo $N = n_1 \times n_2 \times \dots \times n_k$.

## 3. How to Construct $x$?
The formula is:
$$ x = \left( \sum_{i=1}^k a_i \cdot M_i \cdot y_i \right) \pmod N $$

Where:
- $N = \text{product of all } n_i$.
- $M_i = N / n_i$ (Product of all other moduli).
- $y_i = M_i^{-1} \pmod{n_i}$ (Modular Inverse of $M_i$).

**Logic:**
Consider the term $a_1 M_1 y_1$.
- Modulo $n_1$: $M_1 y_1 \equiv M_1 \cdot M_1^{-1} \equiv 1 \pmod{n_1}$. So term becomes $a_1 \cdot 1 = a_1$.
- Modulo $n_j$ (where $j \neq 1$): $M_1$ contains $n_j$ as a factor! So $M_1 \equiv 0 \pmod{n_j}$. Term becomes 0.

So the sum gives $a_1 \pmod{n_1}$, $a_2 \pmod{n_2}$, etc.

## 4. Implementation
We need our `extendedGCD` and `modInverse` from Week 2.

```javascript
/* Assuming modInverse is defined */

function findMinX(num, rem, k) {
    let prod = 1n;
    for (let i = 0; i < k; i++) prod *= BigInt(num[i]);

    let result = 0n;
    for (let i = 0; i < k; i++) {
        let n_i = BigInt(num[i]);
        let pp = prod / n_i;
        let inv = modInverse(pp, n_i);
        result += BigInt(rem[i]) * pp * inv;
    }
    return result % prod;
}

// x = 2 mod 3, x = 3 mod 5, x = 2 mod 7
let num = [3, 5, 7];
let rem = [2, 3, 2];
console.log(findMinX(num, rem, 3)); // 23
```

## 5. Non-Coprime Moduli?
If $n_i$ are NOT coprime, a solution might not exist.
We have to check consistency: $a_i \equiv a_j \pmod{\text{GCD}(n_i, n_j)}$.
If consistent, we can merge equations.

Tomorrow: **Euler's Totient Function** revisited. We learned $\phi(n)$ for modular inverse, but it has deeper secrets! 🤫


---

## Next Step

[**Next: Euler S Totient Function →**](/blog/maths/week5/week-5-day-2-euler-s-totient-function)