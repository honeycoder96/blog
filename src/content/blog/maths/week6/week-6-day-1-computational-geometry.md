---
title: 'Week 6 Day 1: Computational Geometry - Vectors and Dot Product'
description: 'Geometry doesn’t have to be scary. Learn the basics of Vectors and how the Dot Product finds angles and projections.'
pubDate: 'Jul 27 2025'
heroImage: 
  src: '/images/maths/week6/day1.png'
  alt: 'Vector Dot Product Visualization'
tags: ["maths", "cp", "week6", "geometry"]
series: "Maths Roadmap for CP"
---

Welcome to **Week 6**, the final frontier! 🛸
Computational Geometry is famous for being tricky due to floating-point errors and edge cases. We will build a solid foundation to avoid these pitfalls.

## 1. Points and Vectors
A point $P(x, y)$ can be represented as a vector $\vec{P}$ from the origin $(0, 0)$ to $(x, y)$.
Vector subtraction $\vec{AB} = B - A$ gives the vector from $A$ to $B$.

```javascript
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    
    add(p) { return new Point(this.x + p.x, this.y + p.y); }
    sub(p) { return new Point(this.x - p.x, this.y - p.y); }
}
```

## 2. The Dot Product
The Dot Product of two vectors $\vec{A}$ and $\vec{B}$ is:
$$ \vec{A} \cdot \vec{B} = A_x B_x + A_y B_y $$

Geometric definition:
$$ \vec{A} \cdot \vec{B} = |A| |B| \cos \theta $$
where $\theta$ is the angle between them.

## 3. Applications
### A. Angle check
- If $\vec{A} \cdot \vec{B} > 0$, angle is **Acute** (< 90°).
- If $\vec{A} \cdot \vec{B} = 0$, angle is **Right** (= 90°). Perpendicular!
- If $\vec{A} \cdot \vec{B} < 0$, angle is **Obtuse** (> 90°).

### B. Projections
Projecting vector $\vec{A}$ onto $\vec{B}$:
Length of projection = $|A| \cos \theta = \frac{\vec{A} \cdot \vec{B}}{|B|}$.

### C. Point on Segment?
Is point $P$ on segment $AB$?
1. Check if $P$ is collinear with $AB$ (using Cross Product, tomorrow).
2. Check if $P$ lies "between" $A$ and $B$.
   $\vec{PA} \cdot \vec{PB} \le 0$.
   (If vectors point in opposite directions, the angle is 180°, cos is -1, dot product is negative).

## 4. Implementation details
Avoid `sqrt` unless necessary to preserve precision. Use squared distances.
Use `EPS = 1e-9` for float comparisons.

```javascript
function dot(a, b) {
    return a.x * b.x + a.y * b.y;
}

function norm_sq(v) {
    return v.x * v.x + v.y * v.y;
}
```

Tomorrow: **The Cross Product**. The tool for finding areas, orientation, and intersections! ❌


---

## Next Step

[**Next: Cross Product →**](/blog/maths/week6/week-6-day-2-cross-product)