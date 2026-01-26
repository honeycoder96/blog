---
title: 'Week 5 Day 4: Linear Diophantine Equations - Integer Only Solutions'
description: 'How to find all integer solutions to Ax + By = C. Solving word problems involving coins, weights, and measures.'
pubDate: 'Jul 25 2025'
heroImage: 
  src: '/images/maths/week5/day4.png'
  alt: 'Diophantine Equations Visualization'
tags: ["maths", "cp", "week5", "equations"]
series: "Maths Roadmap for CP"
---

A **Diophantine Equation** is a polynomial equation where we are only interested in **integer solutions**.

## 1. Linear Case
$$ Ax + By = C $$
where $A, B, C$ are integers.

**Conditions for Solution:**
There are integer solutions if and only if:
$$ C \text{ is divisible by } \text{GCD}(A, B) $$

Let $g = \text{GCD}(A, B)$.
If $C \% g \neq 0$, then NO solution.
If $C \% g == 0$, then infinite solutions exist.

## 2. Finding One Solution
1. Use Extended Euclidean Algo to find $(x_0, y_0)$ such that:
   $$ A x_0 + B y_0 = g $$
2. Multiply by $C/g$:
   $$ A (x_0 \cdot \frac{C}{g}) + B (y_0 \cdot \frac{C}{g}) = g \cdot \frac{C}{g} = C $$

So one solution is:
$$ x = x_0 \cdot (C/g) $$
$$ y = y_0 \cdot (C/g) $$

## 3. Finding All Solutions
All solutions $(x, y)$ are given by:
$$ x_k = x + k \cdot \frac{B}{g} $$
$$ y_k = y - k \cdot \frac{A}{g} $$
where $k$ is any integer.

Notice that as $x$ increases, $y$ decreases. The "step size" for $x$ is $B/g$, and for $y$ is $A/g$.

## 4. Problem: Constraints
Often, we need **positive** integers ($x > 0, y > 0$).
This gives us inequalities on $k$:
$$ 1. \quad x + k \cdot \frac{B}{g} > 0 \implies k > -x \cdot \frac{g}{B} $$
$$ 2. \quad y - k \cdot \frac{A}{g} > 0 \implies k < y \cdot \frac{g}{A} $$

We find the range of valid $k$ values $[k_{min}, k_{max}]$.
The number of solutions is simply $k_{max} - k_{min} + 1$. (If $k_{max} < k_{min}$, then 0 solutions).

## 5. Coding Example
**Problem:** You have coins of value 5 and 7. What is the largest amount you *cannot* make? (Frobenius Coin Problem).
For 2 numbers $A, B$ coprime, the largest impossible sum is $AB - A - B$.
$(5)(7) - 5 - 7 = 35 - 12 = 23$.
Let's check 23:
$5x + 7y = 23$ ?
Possible $y$: 0, 1, 2, 3.
$y=0 \to 5x=23$ (No)
$y=1 \to 5x=16$ (No)
$y=2 \to 5x=9$ (No)
$y=3 \to 5x=2$ (No)
Indeed 23 is impossible. 24? $24 = 5(2) + 7(2)$.

For general Diophantine, we just check our range of $k$.

Tomorrow: **Primality Testing**. How to check if a 100-digit number is prime? **Miller-Rabin**! 🕵️‍♂️


---

## Next Step

[**Next: Primality Testing →**](/blog/maths/week5/week-5-day-5-primality-testing)