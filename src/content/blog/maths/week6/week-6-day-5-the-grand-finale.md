---
title: 'Week 6 Day 5: The Grand Finale - Hard Problems'
description: 'Combining everything we learned. 3 classic problems that require Number Theory, Probability, and Geometry.'
pubDate: 'Jul 31 2025'
heroImage: 
  src: '/images/maths/week6/day5.png'
  alt: 'Complex Problem Solving'
tags: ["maths", "cp", "week6", "contest"]
series: "Maths Roadmap for CP"
---

We made it! 30 days of math.
Today, we look at three "Final Boss" problems that mix concepts.

## Problem 1: The Doomsday Fuel (Probability + Matrices)
**Task:** Given a graph representing states of matter (some stable, some unstable), and transition probabilities. If you start at state $0$, what is the probability of ending in each stable state?

**Solution:**
This is an **Absorbing Markov Chain**.
1. Identify **Absorbing States** (Stable) and **Transient States**.
2. Write the Transition Matrix in canonical form:
   $$ P = \begin{bmatrix} I & 0 \\ R & Q \end{bmatrix} $$
3. Calculate the Fundamental Matrix $F = (I - Q)^{-1}$.
   (Use **Matrix Inverse** via Gaussian Elimination).
4. Calculate $FR$. This gives the probabilities of being absorbed in each stable state.

**Concepts:** Probability, Matrix Operations, Modular Inverse (if asked modulo P).

## Problem 2: Visible Lattice Points (Number Theory + Geometry)
**Task:** You are at $(0,0,0)$ in a 3D grid of size $N \times N \times N$. How many integer points $(x, y, z)$ are visible from the origin? (A point is invisible if blocked by another point).

**Solution:**
A point $(x, y, z)$ is visible if $\text{GCD}(x, y, z) = 1$.
We need to count triplets with GCD 1.
Use **Mobius Inversion** (Advanced Inclusion-Exclusion).
$$ \sum_{g=1}^N \mu(g) \lfloor \frac{N}{g} \rfloor^3 $$

**Concepts:** GCD, Inclusion-Exclusion, Mobius Function.

## Problem 3: Area of Union of Rectangles (Geometry + Data Structs)
**Task:** Given $N$ rectangles, find the area of their union.
**Solution:**
1. This is a **Sweep Line** problem.
2. Sort vertical edges by x-coordinate.
3. Move a vertical line from left to right.
4. Maintain the "active" y-intervals using a **Segment Tree**.
5. Area += length_covered_by_active_intervals $\times$ dx.

**Concepts:** Geometry, Sorting, Segment Trees.

## 🎓 The Graduation
You have completed the **6-Week Math Roadmap**.
You now possess a toolkit that puts you ahead of 90% of competitors:
- ✅ **Number Theory**: Primes, CRT, Totient.
- ✅ **Combinatorics**: nCr, Catalan, Stars & Bars.
- ✅ **Probability**: Expectation, Randomization.
- ✅ **Geometry**: Vectors, Hulls.

**What's Next?**
Go to LeetCode or Codeforces and filter by tag `Math`.
Smash those problems. Happy Coding! 🚀


---

## 🎉 Series Complete!

You have finished the **Maths** roadmap.

👉 **Next Challenge: [MongoDB Roadmap](/blog/mongodb-roadmap)**