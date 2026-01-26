---
title: 'Week 5 Day 5: Primality Testing - The Probabilistic Approach'
description: 'How to check if a 18-digit number is prime in milliseconds. The Miller-Rabin test.'
pubDate: 'Jul 26 2025'
heroImage: 
  src: '/images/maths/week5/day5.png'
  alt: 'Primality Testing Visualization'
tags: ["maths", "cp", "week5", "primes"]
series: "Maths Roadmap for CP"
---

Trial division up to $\sqrt{N}$ takes $O(\sqrt{N})$.
For $N = 10^{18}$, $\sqrt{N} = 10^9$. Too slow (1 second).
We need something faster: **Miller-Rabin ($O(k \log^3 N)$)**.

## 1. Fermat Check
Recall Fermat's Little Theorem:
$$ a^{p-1} \equiv 1 \pmod p $$
If this doesn't hold for some $a$, then $p$ is definitely composite.
However, if it holds, $p$ *might* be prime. There are liars (Carmichael numbers) like 561 that pass this test for all $a$ coprime to 561 but are composite.

## 2. Miller-Rabin Idea
It improves Fermat by looking at the square roots of unity.
if $x^2 \equiv 1 \pmod p$, then $x$ must be $1$ or $-1$ (if $p$ is prime).

Algorithm for testing $n$:
1. Write $n-1 = 2^s \cdot d$ (pull out all factors of 2).
2. Pick random base $a$.
3. Compute $x = a^d \pmod n$.
4. If $x \equiv 1$ or $x \equiv n-1$, pass.
5. Loop $s-1$ times:
   - $x = x^2 \pmod n$.
   - If $x \equiv n-1$, pass (we found $-1$).
6. If loop finishes without passing, $n$ is Composite.

## 3. Deterministic Variant
For $n < 2^{64}$, it is sufficient to check $a = \{2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37\}$.
If it passes for all these, it is 100% prime.

## 4. Implementation
We need `BigInt` for intermediate calculations!

```javascript
/* Standard fastPow function here */

function checkComposite(n, a, d, s) {
    let x = fastPow(a, d, n);
    if (x === 1n || x === n - 1n) return false;
    for (let r = 1; r < s; r++) {
        x = (x * x) % n;
        if (x === n - 1n) return false;
    }
    return true; // Likely composite
}

function isPrime(n) { // Returns true if prime
    if (n < 2n) return false;
    if (n === 2n || n === 3n) return true;
    if (n % 2n === 0n) return false;

    let d = n - 1n;
    let s = 0;
    while (d % 2n === 0n) {
        d /= 2n;
        s++;
    }

    const bases = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];
    for (let a of bases) {
        if (n <= BigInt(a)) break;
        if (checkComposite(n, BigInt(a), d, s)) return false;
    }
    return true;
}
```

## 5. Pollard's Rho (Bonus)
Miller-Rabin checks **if** a number is prime.
**Pollard's Rho** finds a factor if it's composite.
It uses the "Birthday Paradox" on the sequence $x_{i+1} = (x_i^2 + c) \pmod n$.
Complexity: $O(N^{1/4})$.

## 🎉 Week 5 Complete!
You now have the tools of a Number Theory Wizard.
- **CRT** to combine moduli.
- **Euler's Totient** for modular structures.
- **Extended Euclidean** for linear equations.
- **Miller-Rabin** for primality.

Next week, we change gears completely.
**Week 6: Geometry & Vectors**. 📐
Cross products, convex hulls, and computational geometry basics!


---

## Next Step

[**Next: Computational Geometry →**](/blog/maths/week6/week-6-day-1-computational-geometry)