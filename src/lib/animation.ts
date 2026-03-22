/** Linear interpolation between a and b by factor t. */
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
