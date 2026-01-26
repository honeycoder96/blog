---
title: 'Week 5 Day 3: Extended Euclidean Algorithm - Beyond GCD'
description: 'Standard GCD finds the divisor. Extended GCD finds how to combine numbers to get that divisor.'
pubDate: 'Jul 24 2025'
heroImage: 
  src: '/images/maths/week5/day3.png'
  alt: 'Extended GCD Visualization'
tags: ["maths", "cp", "week5", "algorithms"]
series: "Maths Roadmap for CP"
---

We used Extended GCD back in Week 2 to find Modular Inverse. Today, we understand **why** it works and what else it can do.

## 1. Bezout's Identity
This identity states that for any integers $a$ and $b$, there exist integers $x$ and $y$ such that:
$$ a \cdot x + b \cdot y = \text{GCD}(a, b) $$

$x$ and $y$ can be negative or zero.
**Extended Euclidean Algorithm** finds this pair $(x, y)$.

## 2. Derivation
Recall the recursive step of GCD:
$$ \text{GCD}(a, b) = \text{GCD}(b, a \pmod b) $$

Base Case: $\text{GCD}(a, 0) = a$.
$$ a \cdot 1 + 0 \cdot 0 = a \implies x=1, y=0 $$

Recursive Step:
Suppose we know $(x_1, y_1)$ for $\text{GCD}(b, a \pmod b)$:
$$ b \cdot x_1 + (a \pmod b) \cdot y_1 = g $$
We know $a \pmod b = a - \lfloor a/b \rfloor \cdot b$.
Substitute:
$$ b \cdot x_1 + (a - \lfloor a/b \rfloor \cdot b) \cdot y_1 = g $$
$$ a \cdot y_1 + b \cdot (x_1 - \lfloor a/b \rfloor \cdot y_1) = g $$

Comparing to $a \cdot x + b \cdot y = g$:
$$ x = y_1 $$
$$ y = x_1 - \lfloor a/b \rfloor \cdot y_1 $$

This is the recurrence we implemented in Week 2!

## 3. General Solution
Once we have one solution $(x_0, y_0)$, there are **infinite** solutions.
$$ x = x_0 + k \cdot \frac{b}{g} $$
$$ y = y_0 - k \cdot \frac{a}{g} $$

This is crucial for finding the **smallest positive** solution.

## 4. Application: Pouring Water
**Problem:** You have a 3L jug and a 5L jug. Can you measure exactly 4L?
This is equivalent to solving: $3x + 5y = 4$.
Since $\text{GCD}(3, 5) = 1$ and 4 is a multiple of 1, YES.
One solution: $(-2, 2) \implies -6 + 10 = 4$.
Wait, negative water? In pouring terms, "negative" means pouring OUT or transferring.
Actual steps can be derived from the coefficients.

## 5. Coding Problem
Find the smallest positive integer $x$ such that:
$$ A \cdot x \equiv B \pmod M $$
This converts to:
$$ A \cdot x + M \cdot y = B $$
Solve for $x$ using Extended GCD. If $B$ is not divisible by $\text{GCD}(A, M)$, no solution.

Tomorrow: We formalize this into **Linear Diophantine Equations**. 📐


---

## Next Step

[**Next: Linear Diophantine Equations →**](/blog/maths/week5/week-5-day-4-linear-diophantine-equations)