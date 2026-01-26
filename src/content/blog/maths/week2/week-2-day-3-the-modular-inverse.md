---
title: 'Week 2 Day 3: The Modular Inverse - How to Divide'
description: 'Division doesn’t exist in modular arithmetic. Instead, we multiply by the inverse. Learn Fermat’s Little Theorem and the Extended Euclidean Algorithm.'
pubDate: 'Jul 09 2025'
heroImage: 
  src: '/math_week2_day3_mod_inverse.png'
  alt: 'Modular Inverse Visualization'
tags: ["maths", "cp", "week2", "modular-arithmetic"]
series: "Maths Roadmap for CP"
---

Today we solve the missing piece of the puzzle: **Division**.
As we saw yesterday, $(A / B) \pmod m$ is not straightforward. We need to find $B^{-1}$ such that:
$$ (B \times B^{-1}) \equiv 1 \pmod m $$

## 1. Fermat's Little Theorem (The Easy Way)
If $m$ is a **prime number** (which it usually is in contests: $10^9 + 7$), and $A$ is not a multiple of $m$, then:
$$ A^{m-2} \equiv A^{-1} \pmod m $$

This is magic! To divide by $A$, we just calculate $A^{m-2} \pmod m$ using **Fast Exponentiation** (Day 1) and multiply.

### Implementation
```javascript
function modInverse(n, mod) {
    return fastPow(n, mod - 2, mod);
}

// Usage: (A / B) % m becomes:
let ans = (A * modInverse(B, m)) % m;
```

## 2. Extended Euclidean Algorithm (The General Way)
What if $m$ is **not prime**?
We need to solve the equation:
$$ A \cdot x + m \cdot y = 1 $$
Here, $x$ is the modular inverse of $A$. This is a specific case of calculating $\text{GCD}(A, m)$ and keeping track of coefficients.

### Algorithm
It updates $x$ and $y$ while running the standard Euclidean algorithm.
$$ \text{GCD}(a, b) = a \cdot x + b \cdot y $$

### Implementation
```javascript
/**
 * Returns [gcd, x, y] such that ax + by = gcd
 */
function extendedGCD(a, b) {
    if (b === 0) {
        return [a, 1n, 0n];
    }
    const [d, x1, y1] = extendedGCD(b, a % b);
    const x = y1;
    const y = x1 - y1 * BigInt(Math.floor(Number(a / b)));
    return [d, x, y];
}

function modInverseGeneral(a, m) {
    const [d, x, y] = extendedGCD(BigInt(a), BigInt(m));
    if (d !== 1n) return null; // Inverse doesn't exist
    // x might be negative, make it positive
    return (x % BigInt(m) + BigInt(m)) % BigInt(m);
}
```

## 3. When does an inverse NOT exist?
If $\text{GCD}(A, m) \neq 1$, there is no modular inverse.
For example, you cannot divide by 2 modulo 4, because $2 \times x \equiv 1 \pmod 4$ has no solution.

## 4. Practice
Calculate $\binom{n}{k} \pmod P$.
Formula: $\frac{n!}{k!(n-k)!}$.
You need to calculate factorials, and then multiply by the modular inverse of the denominator.

See you on **Day 4**, where we dive deeper into **Euler's Totient Function**! 🦉


---

## Next Step

[**Next: Fermat Euler →**](/blog/maths/week2/week-2-day-4-fermat-euler)