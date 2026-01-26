---
title: 'Week 1 Day 1: The Magic of GCD & LCM'
description: 'Starting our number theory journey with the absolute fundamentals: Greatest Common Divisor and Least Common Multiple. Learn why they matter in coding and how to implement them efficiently.'
pubDate: 'Jul 02 2025'
heroImage: 
  src: '/math_week1_day1_gcd_lcm.png'
  alt: 'GCD and LCM visualization'
tags: ["maths", "cp", "week1", "number-theory"]
series: "Maths Roadmap for CP"
---

Welcome to **Day 1** of your 6-week mathematical journey! 🚀

We are starting with the building blocks of Number Theory: **GCD (Greatest Common Divisor)** and **LCM (Least Common Multiple)**. You might remember these from school, but in competitive programming and algorithm design, they are powerful tools for solving problems involving cycles, scheduling, and divisibility.

## 1. Greatest Common Divisor (GCD)

The GCD of two integers $a$ and $b$ is the largest positive integer that divides both $a$ and $b$ without a remainder.

**Example:**
- Divisors of 12: 1, 2, 3, 4, 6, 12
- Divisors of 18: 1, 2, 3, 6, 9, 18
- Common Divisors: 1, 2, 3, 6
- **GCD(12, 18) = 6**

### Why do we care?
GCD helps in simplifying fractions, finding geometric properties (like tiling a rectangle with squares), and is a crucial step in many complex number theory algorithms.

### How to compute it? using Euclidean Algorithm
The naive approach of checking every number is too slow ($O(min(a, b))$). Instead, we use the **Euclidean Algorithm**, which is heavily efficient ($O(\log(\min(a, b)))$).

The key insight:
$$ \text{GCD}(a, b) = \text{GCD}(b, a \pmod b) $$
$$ \text{GCD}(a, 0) = a $$

#### Implementation (JavaScript)
```javascript
/**
 * Computes the Greatest Common Divisor of two numbers.
 * Time Complexity: O(log(min(a, b)))
 */
function gcd(a, b) {
  while (b !== 0) {
    let temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

// Example usage:
console.log(gcd(12, 18)); // Output: 6
console.log(gcd(101, 103)); // Output: 1 (Coprime numbers)
```

**Recursion (One-liner):**
```javascript
const gcdRecursive = (a, b) => (b === 0 ? a : gcdRecursive(b, a % b));
```

---

## 2. Least Common Multiple (LCM)

The LCM of two integers $a$ and $b$ is the smallest positive integer that is divisible by both $a$ and $b$.

**Example:**
- Multiples of 4: 4, 8, 12, 16, 20...
- Multiples of 6: 6, 12, 18, 24...
- **LCM(4, 6) = 12**

### Comparison with GCD
There is a beautiful relationship between GCD and LCM:
$$ a \times b = \text{GCD}(a, b) \times \text{LCM}(a, b) $$

Rearranging this gives us a fast formula for LCM:
$$ \text{LCM}(a, b) = \frac{(a \times b)}{\text{GCD}(a, b)} $$

*Note: To avoid overflow in typed languages like C++ or Java, calculate `(a / gcd(a,b)) * b`.*

#### Implementation (JavaScript)
```javascript
/**
 * Computes the Least Common Multiple.
 * Relies on the GCD function.
 */
function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs((a * b) / gcd(a, b));
}

// Example usage:
console.log(lcm(4, 6)); // Output: 12
console.log(lcm(7, 5)); // Output: 35
```

---

## 3. Real-World Coding Problem

**Problem:**
Two runners are running on a circular track. Runner A completes a lap in 12 minutes, and Runner B completes a lap in 18 minutes. If they start at the same time, after how many minutes will they meet again at the starting line?

**Solution:**
They will meet at the starting line at a time that is a multiple of both 12 and 18. The *first* time this happens is the **Least Common Multiple**.

Answer: $\text{LCM}(12, 18) = 36$ minutes.

---

## 4. Practice for Tomorrow

Try writing a function to find the GCD of an **array** of numbers.
*Hint: $\text{GCD}(a, b, c) = \text{GCD}(a, \text{GCD}(b, c))$*

See you on **Day 2**, where we dig deeper into the **Euclidean Algorithm** and its properties! 👋


---

## Next Step

[**Next: The Euclidean Algorithm →**](/blog/maths/week1/week-1-day-2-the-euclidean-algorithm)