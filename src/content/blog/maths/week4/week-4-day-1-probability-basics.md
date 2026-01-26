---
title: 'Week 4 Day 1: Probability Basics - Rolling Dice & Flipping Coins'
description: 'Understanding independent vs dependent events, conditional probability, and the math behind games of chance.'
pubDate: 'Jul 17 2025'
heroImage: 
  src: '/images/maths/week4/day1.png'
  alt: 'Basic Probability Visualization'
tags: ["maths", "cp", "week4", "probability"]
series: "Maths Roadmap for CP"
---

Welcome to **Week 4**! This week involves a lot of "Chance".

Probability problems in CP often ask:
1. "What is the probability that X happens?"
2. "What is the expected value of Y?"

## 1. The Basics
Probability $P(E)$ is the ratio of **favorable outcomes** to **total possible outcomes**.
$$ P(E) = \frac{\text{Count(Favorable)}}{\text{Count(Total)}} $$

**Example:** Rolling a die. P(Roll > 4) = {5, 6} / {1..6} = 2/6 = 1/3.

## 2. Independent vs Dependent Events
- **Independent**: Coin A flips Heads. Coin B flips Tails. One doesn't affect the other.
  $$ P(A \text{ and } B) = P(A) \times P(B) $$
- **Dependent**: Picking 2 cards from a deck without replacement.
  $$ P(\text{Ace 1st}) = 4/52 $$
  $$ P(\text{Ace 2nd}) = 3/51 $$

## 3. OR Events (Union)
$$ P(A \text{ or } B) = P(A) + P(B) - P(A \text{ and } B) $$
(This is just Inclusion-Exclusion from last week!)

## 4. Coding Problem: The Birthday Paradox
**Problem:** In a room of $K$ people, what is the probability that at least two share a birthday? (Assume 365 days).

**Strategy:** Easier to calculate the complement ($P' = \text{Nobody shares a birthday}$) and subtract from 1.
- Person 1: 365/365
- Person 2: 364/365
- Person 3: 363/365
- ...

$$ P(\text{No Match}) = 1 \times \frac{364}{365} \times \frac{363}{365} \times \dots $$
$$ P(\text{Match}) = 1 - P(\text{No Match}) $$

```javascript
function birthdayProbability(k) {
    if (k > 365) return 1.0; // Pigeonhole principle!
    
    let probabilityNoMatch = 1.0;
    for (let i = 0; i < k; i++) {
        probabilityNoMatch *= (365 - i) / 365;
    }
    return 1.0 - probabilityNoMatch;
}

console.log(birthdayProbability(23)); // ~0.507 (50% chance!)
```

## 5. Monte Carlo Simulation
Sometimes, the math is too hard. We can just **simulate** the game 100,000 times!
```javascript
function simulateDice(simulations) {
    let success = 0;
    for (let i = 0; i < simulations; i++) {
        let r1 = Math.floor(Math.random() * 6) + 1;
        let r2 = Math.floor(Math.random() * 6) + 1;
        if (r1 + r2 === 7) success++;
    }
    return success / simulations;
}
console.log(simulateDice(100000)); // Should be close to 1/6 (0.166...)
```

See you on **Day 2** for **Expected Value** - the most common type of probability problem in contests! ⚖️


---

## Next Step

[**Next: Expected Value →**](/blog/maths/week4/week-4-day-2-expected-value)