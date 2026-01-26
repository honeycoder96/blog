---
title: 'Week 6 Day 2: Cross Product - Orientation and Area'
description: 'How to tell if a turn is Left or Right? Calculating Polygon Areas.'
pubDate: 'Jul 28 2025'
heroImage: 
  src: '/images/maths/week6/day2.png'
  alt: 'Cross Product Visualization'
tags: ["maths", "cp", "week6", "geometry"]
series: "Maths Roadmap for CP"
---

The Dot Product gave us angles. But it couldn't distinguish between "Left" and "Right".
The **Cross Product** does exactly that.

## 1. Definition (2D)
Technically, Cross Product is a 3D vector. In 2D, we treat it as a scalar (the z-component):
$$ A \times B = A_x B_y - A_y B_x $$

Geometric definition:
$$ |A \times B| = |A| |B| \sin \theta $$
It represents the **signed area** of the parallelogram formed by $\vec{A}$ and $\vec{B}$.

## 2. Orientation (The Right-Hand Rule)
Let $\vec{A}$ be the vector from $O$ to $A$, and $\vec{B}$ from $O$ to $B$.
- **$A \times B > 0$**: The turn from $A$ to $B$ is **Counter-Clockwise (Left)**.
- **$A \times B < 0$**: The turn from $A$ to $B$ is **Clockwise (Right)**.
- **$A \times B = 0$**: The points $O, A, B$ are **Collinear**.

This "CCW" (Counter-Clockwise) check is the most used function in Geometry CP.

```javascript
// Returns cross product of (b-a) and (c-a)
function cross_product(a, b, c) {
    let dx1 = b.x - a.x, dy1 = b.y - a.y;
    let dx2 = c.x - a.x, dy2 = c.y - a.y;
    return dx1 * dy2 - dy1 * dx2;
}
```

## 3. Intersection of Segments
Do segments $AB$ and $CD$ intersect?
They intersect if and only if:
1. $C$ and $D$ lie on opposite sides of line $AB$.
2. $A$ and $B$ lie on opposite sides of line $CD$.

Check "opposite sides" using Cross Product signs!

## 4. Polygon Area
The area of a polygon with vertices $(x_1, y_1), \dots, (x_n, y_n)$ is half the sum of cross products of adjacent edges (Shoelace Formula).

$$ Area = \frac{1}{2} | \sum_{i=1}^n (x_i y_{i+1} - x_{i+1} y_i) | $$
(where point $n+1$ is point $1$).

```javascript
function polygonArea(points) {
    let area = 0;
    for (let i = 0; i < points.length; i++) {
        let j = (i + 1) % points.length;
        area += (points[i].x * points[j].y);
        area -= (points[i].y * points[j].x);
    }
    return Math.abs(area) / 2.0;
}
```

Tomorrow: We use this to build the **Convex Hull** - enclosing points in a rubber band! 🕸️


---

## Next Step

[**Next: Convex Hull →**](/blog/maths/week6/week-6-day-3-convex-hull)