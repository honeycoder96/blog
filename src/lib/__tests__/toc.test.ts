import { describe, it, expect, vi, afterEach } from 'vitest';
import { MAX_TOC_DEPTH, scrollToHeading } from '../toc';

describe('MAX_TOC_DEPTH', () => {
  it('is 2', () => {
    expect(MAX_TOC_DEPTH).toBe(2);
  });
});

describe('scrollToHeading', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls scrollIntoView on the matching element', () => {
    const mockScrollIntoView = vi.fn();
    const mockGetElementById = vi.fn().mockReturnValue({ scrollIntoView: mockScrollIntoView });
    vi.stubGlobal('document', { getElementById: mockGetElementById });

    scrollToHeading('my-heading');

    expect(mockGetElementById).toHaveBeenCalledWith('my-heading');
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('does nothing when the element does not exist', () => {
    vi.stubGlobal('document', { getElementById: vi.fn().mockReturnValue(null) });
    expect(() => scrollToHeading('missing')).not.toThrow();
  });
});
