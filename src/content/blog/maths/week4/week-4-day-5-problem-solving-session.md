---
title: 'Week 4 Day 5: Problem Solving Session - Mixing It All Up'
description: 'Applying expected value, total probability, and combinatorics to solve hard CP problems.'
pubDate: 'Jul 21 2025'
heroImage: 
  src: '/images/maths/week4/day5.png'
  alt: 'Complex Probability Visualization'
tags: ["maths", "cp", "week4", "probability"]
series: "Maths Roadmap for CP"
---

Today we don't learn a new theory. We practice.
Here are three classic probability patterns seen in contests.

## Pattern 1: Probability of Alive/Dead
**Problem:** A bacteria reproduces. Every second, it:
- Dies (prob $p$)
- Stays the same (prob $q$)
- Splits into 2 (prob $r$)
- Splits into 3 (prob $s$)
($p+q+r+s = 1$).
What is the probability that the population eventually dies out?

**Solution:**
Let $E$ be the probability of eventual extinction starting with **1** bacteria.
- If it dies immediately: Prob $p \cdot 1$.
- If it stays same: Prob $q \cdot E$.
- If it splits into 2: We need BOTH to die out. Prob $r \cdot E^2$.
- If it splits into 3: We need ALL 3 to die out. Prob $s \cdot E^3$.

Equation:
$$ E = p + qE + rE^2 + sE^3 $$
This is a cubic equation ($sE^3 + rE^2 + (q-1)E + p = 0$).
One root is always $E=1$. Find the smallest positive root.

## Pattern 2: Linearity on Grids
**Problem:** You are on an $N \times M$ grid. You start at $(0, 0)$. You move Down or Right with $50\%$ prob each. You collect coins in each cell. Expected total coins?

**Solution:**
Don't simulate paths ($2^{N+M}$).
Use Linearity of Expectation.
Is cell $(i, j)$ reachable?
Probability to reach $(i, j)$ depends on number of ways to choose $i$ Downs and $j$ Rights.
$$ P(\text{reach } i, j) = \binom{i+j}{i} \times (0.5)^{i+j} $$
$$ E[\text{Total}] = \sum_{all (i, j)} P(\text{reach } i, j) \times \text{Coins}(i, j) $$

## Pattern 3: Rolling until Pattern
**Problem:** Expected tosses to get "HTH"?
Let $E$ be expected tosses.
- If we have "H": Expected additional tosses $E_H$.
- If we have "HT": Expected additional tosses $E_{HT}$.
- If we have nothing: Expected additional tosses $E_{\emptyset}$.

Equations:
1. $E_{\emptyset} = 1 + 0.5 E_H + 0.5 E_{\emptyset}$ (Tail resets to empty)
2. $E_H = 1 + 0.5 E_{HT} + 0.5 E_H$ (Head keeps us at H)
3. $E_{HT} = 1 + 0.5 (0) + 0.5 E_{\emptyset}$ (Head wins, Tail resets to empty)

Solve the linear system!

## 🎉 Week 4 Complete!
You can now handle:
- **Independent/Dependent Events**
- **Linearity of Expectation** (Your biggest weapon)
- **Total Probability** (DP approach)
- **Randomized Algorithms**

Next week, we return to Hardcore Number Theory.
**Week 5: Advanced Tools** (CRT, Diophantine equations). Get your calculators ready! 🧮


---

## Next Step

[**Next: Chinese Remainder Theorem Crt →**](/blog/maths/week5/week-5-day-1-chinese-remainder-theorem-crt)