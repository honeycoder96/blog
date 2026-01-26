---
title: 'Week 3 Day 5: Classic Counting - Stars, Bars, and Catalan'
description: 'How to distribute candies among children? How many valid parenthesis sequences? Two powerful formulas you must know.'
pubDate: 'Jul 16 2025'
heroImage: 
  src: '/images/maths/week3/day5.png'
  alt: 'Stars and Bars Visualization'
tags: ["maths", "cp", "week3", "combinatorics"]
series: "Maths Roadmap for CP"
---

We end Week 3 with two of the most frequent counting patterns.

## 1. Stars and Bars Theorem
**Problem:** You have $N$ identical candies and you want to distribute them among $K$ distinct children.
- Each child can get 0 or more.
- Order of distribution doesn't matter, only how many each child gets.

Solution:
Imagine laying out the $N$ stars (candies) in a line.
To divide them into $K$ groups, we need to place $K-1$ bars among them.
Total positions = $N + K - 1$.
We need to choose $K-1$ positions for the bars.

Formula:
$$ \binom{N+K-1}{K-1} $$

**Variation:** What if every child must get at least 1 candy?
Give 1 candy to everyone first. Now we have $N - K$ candies left to distribute freely.
$$ \binom{(N-K)+K-1}{K-1} = \binom{N-1}{K-1} $$

## 2. Catalan Numbers
This sequence appears everywhere in combinatorics.
$$ 1, 1, 2, 5, 14, 42, 132 \dots $$

Formula:
$$ C_n = \frac{1}{n+1} \binom{2n}{n} $$

### Where do they appear?
1. **Valid Parentheses:** Number of valid sequences of $n$ pairs of parentheses. `((()))`, `()(())`, etc.
2. **Binary Search Trees:** Number of unique BSTs with $n$ nodes.
3. **Triangulation:** Number of ways to cut a convex polygon with $n+2$ sides into triangles.
4. **Grid Paths:** Paths from $(0,0)$ to $(n,n)$ that never cross above the diagonal.

## 3. Implementation
Since Catalan numbers grow very fast, we usually compute them modulo $M$.

```javascript
/* Using our nCr function from Day 1 */
function catalan(n) {
    let c = nCr(2 * n, n);
    let inv = modInverse(BigInt(n + 1), MOD);
    return (c * inv) % MOD;
}
```

## 🎉 Week 3 Complete!
You now have the power to COUNT.
- **nCr & Pascal's Triangle**
- **Lucas Theorem**
- **Inclusion-Exclusion**
- **Stars & Bars**
- **Catalan Numbers**

Next week, we deal with uncertainty.
**Week 4: Probability & Expected Values**.
What is the expected number of coin flips to get 3 heads in a row? 🎲


---

## Next Step

[**Next: Probability Basics →**](/blog/maths/week4/week-4-day-1-probability-basics)