---
title: 'Week 4 Day 2: Expected Value - The Most Likely Outcome'
description: 'What is the average result if you repeat an experiment infinite times? Mastering Linearity of Expectation.'
pubDate: 'Jul 18 2025'
heroImage: 
  src: '/images/maths/week4/day2.png'
  alt: 'Expected Value Visualization'
tags: ["maths", "cp", "week4", "probability"]
series: "Maths Roadmap for CP"
---

Today we learn the single most useful concept in probability for coding: **Expected Value ($E$)**.

## 1. Definition
The Expected Value is the weighted average of all possible values.
$$ E[X] = \sum x \cdot P(X=x) $$

**Example:**
A fair die. Outcomes: 1, 2, 3, 4, 5, 6. Prob: 1/6 each.
$$ E = 1(\frac{1}{6}) + 2(\frac{1}{6}) + \dots + 6(\frac{1}{6}) = \frac{21}{6} = 3.5 $$

Wait, you can never roll a 3.5!
Expected Value isn't the "most likely" outcome, it's the **average outcome over time**.

## 2. Linearity of Expectation
This is the superpower.
$$ E[X + Y] = E[X] + E[Y] $$
**This holds even if X and Y are dependent!**

### Problem: Hat Check
$N$ people check their hats. The hats are shuffled and returned randomly.
What is the expected number of people who get their own hat back?

**Solution:**
Define indicator variable $I_i$:
- $I_i = 1$ if person $i$ gets their hat.
- $I_i = 0$ otherwise.

We want $E[\sum I_i] = \sum E[I_i]$.
Probability person $i$ gets their hat is $1/N$.
So $E[I_i] = 1 \cdot (1/N) = 1/N$.

Total Expected Value = $\sum_{i=1}^N (1/N) = N \cdot (1/N) = 1$.

Answer: **Exactly 1 person**, no matter how large $N$ is! 🤯

## 3. Waiting Time Problems
If probability of success is $p$, what is the expected number of trials to get 1 success?
Answer: $1/p$.

**Example:**
Expected coin flips to get Heads? $p = 1/2$. Answer: $2$.
Expected rolls to get a 6? $p = 1/6$. Answer: $6$.

## 4. Coding Problem: Collecting Coupons
There are $N$ different types of coupons. You get one random coupon each day.
Expected days to collect all $N$?

1. First coupon: You have 0. Prob to get new is $N/N = 1$. Expected days: $1$.
2. Second coupon: You have 1. Prob to get new is $(N-1)/N$. Expected days: $N/(N-1)$.
3. ...
4. Last coupon: You have $N-1$. Prob to get new is $1/N$. Expected days: $N/1$.

Total Expectation:
$$ E = N \left( \frac{1}{N} + \frac{1}{N-1} + \dots + 1 \right) = N \sum_{i=1}^N \frac{1}{i} $$
This is approx $N \ln N$.

## Summary
To solve complex expectation problems:
1. Break them into small indicator variables.
2. Find the expectation of each small part.
3. Add them up. (Expectation is linear!)

Tomorrow: **Probability in Counting**. We merge Week 3 and Week 4! 🔀


---

## Next Step

[**Next: Probability In Counting →**](/blog/maths/week4/week-4-day-3-probability-in-counting)