---
title: 'Week 3 Day 3: Lucas Theorem - The Giant Slayer'
description: 'How to compute nCr % p when n is huge (like 10^18) but p is small.'
pubDate: 'Jul 14 2025'
heroImage: 
  src: '/images/maths/week3/day3.png'
  alt: 'Lucas Theorem Visualization'
tags: ["maths", "cp", "week3", "lucas-theorem"]
series: "Maths Roadmap for CP"
---

Today we tackle a scenario that breaks normal factorials.

**Scenario:** Calculate $\binom{n}{r} \pmod p$ where:
- $n, r \le 10^{18}$ (Huge!)
- $p \le 10^5$ (Small Prime)

We cannot compute $10^{18}!$ even with $O(N)$ precomputation. We need **Lucas Theorem**.

## 1. The Theorem
Lucas Theorem states that for a prime $p$ and non-negative integers $n$ and $r$:

$$ \binom{n}{r} \equiv \prod_{i=0}^{k} \binom{n_i}{r_i} \pmod p $$

Where:
- $n = n_k p^k + \dots + n_1 p + n_0$ (Base $p$ expansion of $n$)
- $r = r_k p^k + \dots + r_1 p + r_0$ (Base $p$ expansion of $r$)

Essentially, $\binom{n}{r} \pmod p$ is the product of combinations of their digits in base $p$.

$$ \binom{n}{r} \equiv \binom{n \% p}{r \% p} \times \binom{n / p}{r / p} \pmod p $$

## 2. Example
Calculate $\binom{10}{2} \pmod 3$.
$10 = 1 \cdot 3^2 + 0 \cdot 3^1 + 1 \cdot 3^0 \rightarrow (101)_3$
$2 = 0 \cdot 3^2 + 0 \cdot 3^1 + 2 \cdot 3^0 \rightarrow (002)_3$

So, $\binom{10}{2} \equiv \binom{1}{0} \times \binom{0}{0} \times \binom{1}{2} \pmod 3$?
Wait, $\binom{1}{2} = 0$. So the answer should be 0.
Let's check: $\binom{10}{2} = 45$.
$45 \pmod 3 = 0$. It works!

## 3. Implementation
The complexity is $O(\log_p n \times p)$. Since $p$ is small, this is excellent.

```javascript
/* Standard nCr for small values < p */
function nCrSmall(n, r, p) {
    if (r < 0 || r > n) return 0n;
    // Assume we have fact[] and inverseFact[] precomputed up to p
    return (fact[n] * modInverse(fact[r], p) * modInverse(fact[n-r], p)) % p;
}

function lucas(n, r, p) {
    if (r === 0n) return 1n;
    return (lucas(n / p, r / p, p) * nCrSmall(Number(n % p), Number(r % p), p)) % p;
}
```

## 4. What if $p$ is NOT prime?
Then Lucas Theorem doesn't apply directly.
We use the **Chinese Remainder Theorem (CRT)** to combine results from prime factors of $p$. We'll see CRT in Week 5!

## 5. Summary so far
1. **Small $N$, large/any $P$**: Pascal's Triangle ($N^2$)
2. **Medium $N$ ($10^6$), Prime $P$**: Factorials ($N$)
3. **Huge $N$, Small Prime $P$**: Lucas Theorem ($\log N$)

Tomorrow: **Inclusion-Exclusion Principle**. How to count the union of overlapping sets! ⭕


---

## Next Step

[**Next: Inclusion Exclusion Principle →**](/blog/maths/week3/week-3-day-4-inclusion-exclusion-principle)