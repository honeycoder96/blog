---
title: 'Week 3 Day 4: Inclusion-Exclusion Principle - Avoiding Double Counting'
description: 'How to calculate the size of the union of multiple sets. A fundamental tool for solving complex counting problems.'
pubDate: 'Jul 15 2025'
heroImage: 
  src: '/images/maths/week3/day4.png'
  alt: 'Inclusion-Exclusion Visualization'
tags: ["maths", "cp", "week3", "combinatorics"]
series: "Maths Roadmap for CP"
---

Today we solve a classic problem: **Overlapping Sets**.

## 1. The Simple Case (2 Sets)
You want to find $|A \cup B|$.
Intuitively, it's $|A| + |B|$. But if $A$ and $B$ overlap, you counted the intersection twice.
$$ |A \cup B| = |A| + |B| - |A \cap B| $$

## 2. The General Case (n Sets)
What about 3 sets?
$$ |A \cup B \cup C| = |A| + |B| + |C| - (|A \cap B| + |A \cap C| + |B \cap C|) + |A \cap B \cap C| $$

**The Pattern:**
1. Add sizes of individual sets.
2. Subtract sizes of all pairwise intersections.
3. Add sizes of all triplet intersections.
4. Subtract sizes of all quadruplet intersections.
... and so on.

$$ \left| \bigcup_{i=1}^n A_i \right| = \sum |A_i| - \sum |A_i \cap A_j| + \sum |A_i \cap A_j \cap A_k| - \dots $$

## 3. Coding Problem Example
**Problem:** How many numbers from 1 to 1000 are divisible by 2, 3, or 5?

**Solution:**
- Sets: $A_2$ (divisible by 2), $A_3$ (divisible by 3), $A_5$ (divisible by 5).
- Intersection $A_2 \cap A_3$ means divisible by $\text{LCM}(2, 3) = 6$.
- Intersection $A_2 \cap A_3 \cap A_5$ means divisible by $\text{LCM}(2, 3, 5) = 30$.

Size of $A_k$ up to $N$: $\lfloor N/k \rfloor$.

Calculation:
+ $\lfloor 1000/2 \rfloor + \lfloor 1000/3 \rfloor + \lfloor 1000/5 \rfloor$
- $(\lfloor 1000/6 \rfloor + \lfloor 1000/10 \rfloor + \lfloor 1000/15 \rfloor)$
+ $\lfloor 1000/30 \rfloor$

## 4. Implementation Trick: Bitmasks
For $N$ sets, iterate through all subsets using a bitmask from $1$ to $2^N - 1$.
- If the number of set bits is **odd**, ADD the term.
- If the number of set bits is **even**, SUBTRACT the term.

```javascript
function countDivisible(N, primes) {
    let ans = 0;
    const m = primes.length;
    
    for (let i = 1; i < (1 << m); i++) {
        let lcm = 1;
        let bits = 0;
        
        for (let j = 0; j < m; j++) {
            if ((i >> j) & 1) {
                lcm = lcm * primes[j]; // Note: carefully handle overflow
                bits++;
            }
        }
        
        if (bits % 2 === 1) {
            ans += Math.floor(N / lcm);
        } else {
            ans -= Math.floor(N / lcm);
        }
    }
    return ans;
}

console.log(countDivisible(1000, [2, 3, 5]));
```

## 5. Complexity
$O(2^M \cdot M)$ where $M$ is the number of constraints (sets).
This works well when $M \le 20$.

Tomorrow, we wrap up Week 3 with **Stars and Bars** (distributing items into bins) and **Catalan Numbers**! ⭐


---

## Next Step

[**Next: Classic Counting →**](/blog/maths/week3/week-3-day-5-classic-counting)