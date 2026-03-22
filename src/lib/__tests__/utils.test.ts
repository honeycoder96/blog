import { describe, it, expect, vi } from 'vitest';
import { delay } from '../utils';

describe('delay', () => {
  it('resolves after the specified milliseconds', async () => {
    vi.useFakeTimers();
    const promise = delay(500);
    vi.advanceTimersByTime(500);
    await expect(promise).resolves.toBeUndefined();
    vi.useRealTimers();
  });

  it('does not resolve before the time elapses', async () => {
    vi.useFakeTimers();
    let resolved = false;
    delay(500).then(() => { resolved = true; });
    vi.advanceTimersByTime(499);
    // Flush microtasks without advancing timers further
    await Promise.resolve();
    expect(resolved).toBe(false);
    vi.useRealTimers();
  });
});
