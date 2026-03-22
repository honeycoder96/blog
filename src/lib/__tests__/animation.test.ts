import { describe, it, expect } from 'vitest';
import { lerp } from '../animation';

describe('lerp', () => {
  it('returns start value at t=0', () => expect(lerp(0, 100, 0)).toBe(0));
  it('returns end value at t=1', () => expect(lerp(0, 100, 1)).toBe(100));
  it('returns midpoint at t=0.5', () => expect(lerp(0, 100, 0.5)).toBe(50));
  it('works with negative values', () => expect(lerp(-50, 50, 0.5)).toBe(0));
  it('works with identical start and end', () => expect(lerp(5, 5, 0.5)).toBe(5));
});
