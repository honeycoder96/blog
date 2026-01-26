---
title: 'Week 2 Day 4: Fermat & Euler - The Giants of Number Theory'
description: 'Understanding Fermat’s Little Theorem and its big brother, Euler’s Totient Theorem. Key concepts for encryption.'
pubDate: 'Jul 10 2025'
heroImage: 
  src: '/images/maths/week2/day4.png'
  alt: 'Fermat and Euler Visualization'
tags: ["maths", "cp", "week2", "theorems"]
series: "Maths Roadmap for CP"
---

Welcome to **Day 4**! Today we dive into the theoretical backbone of modular arithmetic.

Yesterday we used `modInverse(A, M) = power(A, M-2)` when $M$ is prime. Why did that work? It works because of **Fermat's Little Theorem**.

## 1. Fermat's Little Theorem
Stated simply:
> If $p$ is a prime number, then for any integer $a$:
> $$ a^p \equiv a \pmod p $$

If $a$ is not divisible by $p$, we can divide both sides by $a$:
> $$ a^{p-1} \equiv 1 \pmod p $$

This implies:
$$ a^{p-2} \equiv a^{-1} \pmod p $$
This is why we raised $a$ to the power of $p-2$ to get the inverse!

## 2. Euler's Totient Function ($\phi$)
What if the modulus $m$ is **NOT** prime?
We need **Euler's Totient Function**, denoted as $\phi(n)$ (phi).

$\phi(n)$ is the count of numbers between $1$ and $n$ that are **coprime** to $n$ (i.e., $\text{GCD}(i, n) = 1$).

**Examples:**
- $\phi(5) = 4$ (1, 2, 3, 4 are coprime to 5)
- $\phi(6) = 2$ (1, 5 are coprime to 6; 2, 3, 4 share factors)
- If $p$ is prime, $\phi(p) = p - 1$.

## 3. Euler's Totient Theorem
This allows us to generalize Fermat's theorem:
> If $\text{GCD}(a, m) = 1$, then:
> $$ a^{\phi(m)} \equiv 1 \pmod m $$

This means the modular inverse of $a$ modulo $m$ is:
$$ a^{-1} \equiv a^{\phi(m)-1} \pmod m $$

## 4. How to Calculate $\phi(n)$?
If we know the prime factorization of $n = p_1^{e_1} \times p_2^{e_2} \dots$, then:
$$ \phi(n) = n \times \left(1 - \frac{1}{p_1}\right) \times \left(1 - \frac{1}{p_2}\right) \dots $$

### Implementation
```javascript
/**
 * Computes Euler's Totient Function phi(n).
 * Time Complexity: O(sqrt(n))
 */
function phi(n) {
    let result = n;
    for (let i = 2; i * i <= n; i++) {
        if (n % i === 0) {
            while (n % i === 0) {
                n /= i;
            }
            result -= result / i;
        }
    }
    if (n > 1) {
        result -= result / n;
    }
    return result;
}

console.log(phi(10)); // Output: 4 (1, 3, 7, 9)
```

## 5. Application: CP Trick
If you need to calculate $a^b \pmod m$ where $b$ is extremely large (e.g., $b$ is a string of digits), you can reduce the exponent!
$$ a^b \equiv a^{b \pmod{\phi(m)}} \pmod m $$
*(Note: This holds strictly if $\text{GCD}(a, m)=1$, or generally with some caveats).*

Tomorrow, we unleash the ultimate power move: **Matrix Exponentiation** to solve Fibonacci in logarithmic time! ⚡


---

## Next Step

[**Next: Matrix Exponentiation →**](/blog/maths/week2/week-2-day-5-matrix-exponentiation)