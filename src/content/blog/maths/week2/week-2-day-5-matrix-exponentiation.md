---
title: 'Week 2 Day 5: Matrix Exponentiation - Breaking the Speed Limit'
description: 'How to solve linear recurrences like Fibonacci in O(log n) time instead of O(n). A powerful technique for advanced DP problems.'
pubDate: 'Jul 11 2025'
heroImage: 
  src: '/images/maths/week2/day5.png'
  alt: 'Matrix Exponentiation Visualization'
tags: ["maths", "cp", "week2", "matrices"]
series: "Maths Roadmap for CP"
---

We end Week 2 with one of the most powerful "speed hacks" in competitive programming: **Matrix Exponentiation**.

## 1. The Fibonnaci Problem
We all know the Fibonacci sequence:
$$ F_n = F_{n-1} + F_{n-2} $$
$$ 0, 1, 1, 2, 3, 5, 8, 13 \dots $$

To find the $n$-th Fibonacci number:
- **Recursion**: $O(2^n)$ (Terrible)
- **Iteration/DP**: $O(n)$ (Good)
- **Matrix Exponentiation**: $O(\log n)$ (Godlike ⚡)

Why does $O(\log n)$ matter? If $n = 10^{18}$, $O(n)$ will time out. $O(\log n)$ takes microseconds.

## 2. Converting Recurrence to Matrix
We want a transition matrix $T$ such that:
$$ \begin{bmatrix} F_{n} \\ F_{n-1} \end{bmatrix} = T \times \begin{bmatrix} F_{n-1} \\ F_{n-2} \end{bmatrix} $$

Using the equation $F_n = 1 \cdot F_{n-1} + 1 \cdot F_{n-2}$ and $F_{n-1} = 1 \cdot F_{n-1} + 0 \cdot F_{n-2}$, we get:
$$ T = \begin{bmatrix} 1 & 1 \\ 1 & 0 \end{bmatrix} $$

So:
$$ \begin{bmatrix} F_{n+1} \\ F_{n} \end{bmatrix} = T^n \times \begin{bmatrix} F_{1} \\ F_{0} \end{bmatrix} $$

To compute $T^n$, we use **Fast Modular Exponentiation** (Day 1), but with *matrices* instead of numbers!

## 3. Implementation
We need a `multiplyMatrix` function (size fixed for performance, usually $2 \times 2$ or $k \times k$).

```javascript
const MOD = 1000000007n;

function multiply(A, B) {
    const C = [[0n, 0n], [0n, 0n]];
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            for (let k = 0; k < 2; k++) {
                C[i][j] = (C[i][j] + A[i][k] * B[k][j]) % MOD;
            }
        }
    }
    return C;
}

function power(A, p) {
    let res = [[1n, 0n], [0n, 1n]]; // Identity matrix
    A[0][0] = BigInt(A[0][0]); // Ensure BigInt
    // ... complete BigInt conversion for safety
    
    while (p > 0n) {
        if (p % 2n === 1n) res = multiply(res, A);
        A = multiply(A, A);
        p /= 2n;
    }
    return res;
}

function getFib(n) {
    if (n === 0) return 0;
    if (n === 1) return 1;
    
    let T = [[1n, 1n], [1n, 0n]];
    T = power(T, BigInt(n - 1));
    
    // Result is T[0][0] * F(1) + T[0][1] * F(0)
    // F(1)=1, F(0)=0
    return Number(T[0][0]);
}

console.log(getFib(100)); // Instant calculation!
```

## 4. Generalizing
Any linear recurrence $f(n) = c_1 f(n-1) + c_2 f(n-2) + \dots + c_k f(n-k)$ can be solved in $O(k^3 \log n)$ using a $k \times k$ matrix.

## 🎉 Week 2 Complete!
You now possess the tools of Number Theory and Modular Arithmetic.
- **Fast Power**
- **Modular Inverse**
- **Euler's Totient**
- **Matrix Exponentiation**

Next week, we learn how to **Count**.
How many ways to rearrange distinct items? How many paths in a grid?
**Week 3: Combinatorics** starts Monday! 🎲


---

## Next Step

[**Next: Basics Of Combinatorics →**](/blog/maths/week3/week-3-day-1-basics-of-combinatorics)