---
title: 'Week 4 Day 3: Probability in Counting - Law of Total Probability'
description: 'Combining combinatorics and probability. Solving problems by breaking them into disjoint cases.'
pubDate: 'Jul 19 2025'
heroImage: 
  src: '/images/maths/week4/day3.png'
  alt: 'Total Probability Visualization'
tags: ["maths", "cp", "week4", "probability"]
series: "Maths Roadmap for CP"
---

Probability and Counting are two sides of the same coin.
$$ P(E) = \frac{\text{Ways E can happen}}{\text{Total ways}} $$

Today we look at the **Law of Total Probability**.

## 1. The Theory
If $B_1, B_2, \dots, B_n$ are disjoint events that cover the whole sample space (partitions), then for any event $A$:
$$ P(A) = \sum_{i=1}^n P(A | B_i) \cdot P(B_i) $$

This just means: "Probability of A is the weighted sum of A happening in each case $B_i$."

## 2. Example: Choosing Bags
- Bag 1: 3 Red, 2 Green balls.
- Bag 2: 1 Red, 4 Green balls.
You flip a coin. Heads $\to$ Pick Bag 1. Tails $\to$ Pick Bag 2.
What is the probability you pick a **Red** ball?

Solution:
- Case 1 (Heads): $P(H) = 1/2$. Chance of Red $| H = 3/5$.
- Case 2 (Tails): $P(T) = 1/2$. Chance of Red $| T = 1/5$.

$$ P(Red) = (1/2 \cdot 3/5) + (1/2 \cdot 1/5) = 3/10 + 1/10 = 4/10 = 0.4 $$

## 3. Dynamic Programming with Probability
This law is the foundation of **Probabilistic DP**.
If we want to find $P(\text{reaching state } u)$, we sum up probabilities from all previous states $v$.
$$ P(u) = \sum P(v) \cdot P(v \to u) $$

**Problem: Random Walk on a Graph**
You are at node 1. At each step, you move to a random neighbor. What is the probability you reach node $N$ before node $1$ (if you return to 1, you lose)?

Let $dp[u]$ be the probability of reaching $N$ before $1$ starting from $u$.
- $dp[N] = 1$
- $dp[1] = 0$
- For other $u$: $dp[u] = \sum_{v \in adj[u]} \frac{1}{deg(u)} dp[v]$

This creates a system of linear equations! (Solved using Gaussian Elimination, Week 6 😉).

## 4. Coding Problem: The Drunkard's Walk
A drunkard stands at position $X$ on a number line (between $0$ and $N$).
- Step Right (+1) with prob $p$.
- Step Left (-1) with prob $1-p$.
- If he reaches $N$, he stops (Home).
- If he reaches $0$, he falls off a cliff.

What is the probability he reaches Home?
$F(i) = p \cdot F(i+1) + (1-p) \cdot F(i-1)$
This is a linear recurrence relation!

## 5. Summary
Whenever a problem says "You do X with probability P, and Y with probability 1-P", think:
1. **Total Probability**: Break it into cases.
2. **DP/Recurrence**: Write a relation between states.

Tomorrow: **Randomized Algorithms**. How to check if $A \times B = C$ without actually multiplying them! 🤯


---

## Next Step

[**Next: Randomized Algorithms →**](/blog/maths/week4/week-4-day-4-randomized-algorithms)