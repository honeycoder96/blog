---
title: 'Week 1 Day 5: Prime Factorization - The Atoms of Numbers'
description: 'Every number is built from primes. Learn how to break them down efficiently using Trial Division and Sieve optimization.'
pubDate: 'Jul 06 2025'
heroImage: 
  src: '/math_week1_day5_prime_factorization.png'
  alt: 'Prime Factorization visualization'
tags: ["maths", "cp", "week1", "primes"]
series: "Maths Roadmap for CP"
---

We end Week 1 with the **Fundamental Theorem of Arithmetic**:
> Every integer greater than 1 is either a prime itself or can be represented as the product of prime numbers in a unique way.

For example:
$$ 60 = 2^2 \times 3^1 \times 5^1 $$

## 1. Why is this useful?
If you know the prime factorization of a number, you instantly know:
- Its **divisors** (number of divisors, sum of divisors).
- Its **Euler Totient** value (how many coprime numbers exist below it).
- Whether it's a perfect square.

## 2. Algorithm: Trial Division
We can iterate from $d = 2$ up to $\sqrt{N}$. If $d$ divides $N$, we count how many times it divides $N$, and then divide $N$ by it.

### Implementation
```javascript
/**
 * Returns a map of prime factors and their counts.
 * Time Complexity: O(sqrt(N))
 */
function getPrimeFactors(n) {
    const factors = {};
    
    // Check for number of 2s
    while (n % 2 === 0) {
        factors[2] = (factors[2] || 0) + 1;
        n = Math.floor(n / 2);
    }

    // Check for odd numbers
    for (let i = 3; i * i <= n; i += 2) {
        while (n % i === 0) {
            factors[i] = (factors[i] || 0) + 1;
            n = Math.floor(n / i);
        }
    }

    // If n > 2 at the end, it is a prime itself
    if (n > 2) {
        factors[n] = (factors[n] || 0) + 1;
    }

    return factors;
}

console.log(getPrimeFactors(60)); // { '2': 2, '3': 1, '5': 1 }
```

## 3. Optimization with Sieve
If we need to factorize **many** numbers, we can precompute the "Smallest Prime Factor" (SPF) for every number using a Sieve.
Then, factorization becomes **$O(\log N)$**.

We will cover SPF optimization in Week 5 (Advanced Tools).

## 🎉 Week 1 Complete!
You now have a solid toolkit:
- **GCD & LCM** for cycles.
- **Euclidean Algorithm** for speed.
- **Sieve of Eratosthenes** for mass prime finding.
- **Prime Factorization** for number properties.

Get some rest. **Week 2** is about **Modular Arithmetic**, the clock math that powers cryptography! 🕰️


---

## Next Step

[**Next: Fast Modular Exponentiation →**](/blog/maths/week2/week-2-day-1-fast-modular-exponentiation)