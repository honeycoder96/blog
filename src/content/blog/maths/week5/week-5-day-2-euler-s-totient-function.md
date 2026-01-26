---
title: 'Week 5 Day 2: Euler’s Totient Function - The Heart of Cryptography'
description: 'Counting coprime numbers. Unlocking the power of a^phi(n) = 1 (mod n) and its role in RSA.'
pubDate: 'Jul 23 2025'
heroImage: 
  src: '/images/maths/week5/day2.png'
  alt: 'Euler Totient Visualization'
tags: ["maths", "cp", "week5", "number-theory"]
series: "Maths Roadmap for CP"
---

We met $\phi(n)$ briefly in Week 2. Today, we master it.

## 1. Definition
$\phi(n)$ is the number of integers $k$ in range $[1, n]$ such that $\text{GCD}(k, n) = 1$.

**Example: $n=12$.**
Factors: 1, 2, 3, 4, 6, 12.
Numbers coprime to 12: 1, 5, 7, 11.
So, $\phi(12) = 4$.

## 2. Properties
1. If $p$ is prime, $\phi(p) = p-1$.
2. If $p$ is prime, $\phi(p^k) = p^k - p^{k-1}$.
3. **Multiplicative Function:** If $\text{GCD}(a, b) = 1$, then $\phi(ab) = \phi(a)\phi(b)$.

**The Master Formula:**
$$ \phi(n) = n \prod_{p|n} (1 - \frac{1}{p}) $$

## 3. Implementation
We can compute this in $O(\sqrt{N})$ just like prime factorization.

```javascript
function getPhi(n) {
    let result = n;
    for (let i = 2; i * i <= n; i++) {
        if (n % i === 0) { // i is a prime factor
            while (n % i === 0) n /= i;
            result -= result / i;
        }
    }
    if (n > 1) result -= result / n;
    return result;
}
```

## 4. Totient Sieve
If we need $\phi(i)$ for all $i$ from $1$ to $N$, we can use a Sieve-like approach in $O(N \log \log N)$.
Algorithm:
1. Initialize `phi[i] = i` for all $i$.
2. Iterate $i$ from 2 to $N$.
3. If `phi[i] == i`, then $i$ is prime.
4. For all multiples $j$ of $i$, multiply `phi[j]` by $(1 - 1/i)$.

## 5. Applications
1. **Euler's Theorem:** $a^{\phi(n)} \equiv 1 \pmod n$ (Base of RSA).
2. **Cycle Length:** The sequence $x \to a \cdot x \pmod n$ repeats every $\phi(n)$ steps (roughly).
3. **Sum of GCDs:** $\sum_{i=1}^n \text{GCD}(i, n)$.
   This can be solved by summing $d \cdot (\text{count of } i \text{ where } \text{GCD}(i, n) = d)$.
   Count is $\phi(n/d)$.
   $$ \sum_{d|n} d \cdot \phi(n/d) $$

Tomorrow: We revisit the **Extended Euclidean Algorithm** to solve $ax + by = c$! 📏


---

## Next Step

[**Next: Extended Euclidean Algorithm →**](/blog/maths/week5/week-5-day-3-extended-euclidean-algorithm)