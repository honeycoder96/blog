---
title: 'Week 6 Day 3: Convex Hull - Fencing the Points'
description: 'Finding the smallest convex polygon containing all points. The Graham Scan and Monotone Chain algorithms.'
pubDate: 'Jul 29 2025'
heroImage: 
  src: '/images/maths/week6/day3.png'
  alt: 'Convex Hull Visualization'
tags: ["maths", "cp", "week6", "geometry"]
series: "Maths Roadmap for CP"
---

The **Convex Hull** of a set of points is the smallest convex polygon that encloses all points.
Imagine stretching a rubber band around the points and letting it snap tight. That shape is the hull.

## 1. Monotone Chain Algorithm
This is the standard algorithm. It sorts points and builds the "Upper Hull" and "Lower Hull" separately.
Time Complexity: $O(N \log N)$ (due to sorting).

### Steps
1. **Sort** points by x-coordinate (and y-coordinate for ties).
2. **Build Lower Hull**:
   - Iterate through points.
   - For each new point $P$, while adding $P$ creates a **Right Turn** (or straight) with the last two hull points, remove the last hull point.
   - We want only **Left Turns** (Convex).
3. **Build Upper Hull**:
   - Iterate through points in reverse order.
   - Same logic: pop while Right Turn.
4. Merge the two hulls.

## 2. Implementation
Using our `cross_product` from yesterday.

```javascript
function convexHull(points) {
    points.sort((a, b) => a.x - b.x || a.y - b.y);
    
    // Cross product of (b-a) and (c-a)
    const cross = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);

    const lower = [];
    for (let p of points) {
        while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
            lower.pop();
        }
        lower.push(p);
    }

    const upper = [];
    for (let i = points.length - 1; i >= 0; i--) {
        let p = points[i];
        while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
            upper.pop();
        }
        upper.push(p);
    }

    upper.pop();
    lower.pop();
    return lower.concat(upper);
}
```

## 3. Why is this useful?
- **Farthest Pair of Points**: The diameter of a set of points is always distance between two hull vertices. (Rotating Calipers algorithm).
- **Smallest Enclosing Rectangle**: Also relies on the hull.
- **Animal Territories**: Modeling boundaries in biology.

Tomorrow: We take a break from Geometry and learn some **Bit Manipulation Magic**! 0️⃣1️⃣


---

## Next Step

[**Next: Bit Manipulation →**](/blog/maths/week6/week-6-day-4-bit-manipulation)