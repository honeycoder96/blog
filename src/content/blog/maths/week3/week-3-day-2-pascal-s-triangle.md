---
title: 'Week 3 Day 2: Pascal’s Triangle - DP for Counting'
description: 'nCr without factorials? Pascal’s Triangle is the dynamic programming approach to finding combinations.'
pubDate: 'Jul 13 2025'
heroImage: 
  src: '/images/maths/week3/day2.png'
  alt: 'Pascal Triangle Visualization'
tags: ["maths", "cp", "week3", "dp", "combinatorics"]
series: "Maths Roadmap for CP"
---

Yesterday we calculated $\binom{n}{r}$ using factorials.
But what if we need $\binom{n}{r} \pmod M$ where $M$ is **not prime**?
Modular inverse doesn't exist if $\text{GCD}(Denom, M) \neq 1$.

Enter **Pascal's Triangle**.

## 1. The Recurrence Relation
If you have 5 items and want to choose 2:
- **Case 1**: You **choose** the first item. Then you need to choose 1 more from the remaining 4. ($\binom{4}{1}$)
- **Case 2**: You **skip** the first item. Then you need to choose 2 from the remaining 4. ($\binom{4}{2}$)

Thus:
$$ \binom{n}{r} = \binom{n-1}{r-1} + \binom{n-1}{r} $$

This is the property that builds Pascal's Triangle!

## 2. Visualizing the Triangle
```
      1
     1 1
    1 2 1
   1 3 3 1
  1 4 6 4 1
```
Row $n$ contains $\binom{n}{0}, \binom{n}{1}, \dots, \binom{n}{n}$.
Notice that $4 + 6 = 10$, which would be in the next row $\binom{5}{3}$.

## 3. Implementation (Dynamic Programming)
This method is perfect when $N$ is small ($\le 2000$), because we can build a 2D table in $O(N^2)$.
It works for **any modulus**, prime or not.

```javascript
const C = Array.from({ length: 1001 }, () => Array(1001).fill(0n));

function precomputePascal(MAX, MOD) {
    for (let n = 0; n <= MAX; n++) {
        C[n][0] = 1n; // nC0 = 1
        for (let r = 1; r <= n; r++) {
            C[n][r] = (C[n - 1][r - 1] + C[n - 1][r]) % MOD;
        }
    }
}

// precomputePascal(1000, 1000000007n);
// console.log(C[5][2]); // 10
```

## 4. Properties of Pascal's Triangle
1. **Symmetry**: $\binom{n}{r} = \binom{n}{n-r}$
2. **Sum of Row**: $\sum_{i=0}^{n} \binom{n}{i} = 2^n$
3. **Hockey Stick Identity**: Useful in some specific summation problems.

## 5. When to use which?
- If $N$ is large ($10^6$) and $M$ is prime: **Factorials + Inverse**. ($O(N)$ precalc, $O(1)$ query)
- If $N$ is small ($2000$) and many queries: **Pascal's Triangle**. ($O(N^2)$ precalc, $O(1)$ query)
- If $N$ is huge ($10^{18}$): **Lucas Theorem** (tomorrow!).

See you on **Day 3**! ⚠️ Note: Lucas Theorem is only for prime moduli.


---

## Next Step

[**Next: Lucas Theorem →**](/blog/maths/week3/week-3-day-3-lucas-theorem)