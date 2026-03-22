import { describe, it, expect } from 'vitest';
import { remarkReadingTime } from '../remark-reading-time';
import type { Root } from 'mdast';
import type { VFile } from 'vfile';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeTree(words: number): Root {
  return {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value: Array(words).fill('word').join(' '),
          },
        ],
      },
    ],
  } as Root;
}

function makeFile(frontmatter: Record<string, unknown> = {}): VFile {
  return {
    data: {
      astro: { frontmatter },
    },
  } as unknown as VFile;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('remarkReadingTime', () => {
  const plugin = remarkReadingTime();

  it('injects readingTime for 200-word content (1 min)', () => {
    const file = makeFile();
    plugin(makeTree(200), file);
    const fm = ((file.data as Record<string, unknown>).astro as { frontmatter: Record<string, unknown> }).frontmatter;
    expect(fm.readingTime).toBe(1);
  });

  it('injects readingTime for 400-word content (2 min)', () => {
    const file = makeFile();
    plugin(makeTree(400), file);
    const fm = ((file.data as Record<string, unknown>).astro as { frontmatter: Record<string, unknown> }).frontmatter;
    expect(fm.readingTime).toBe(2);
  });

  it('enforces a minimum of 1 minute for very short content', () => {
    const file = makeFile();
    plugin(makeTree(10), file);
    const fm = ((file.data as Record<string, unknown>).astro as { frontmatter: Record<string, unknown> }).frontmatter;
    expect(fm.readingTime).toBe(1);
  });

  it('does NOT overwrite an explicit readingTime from frontmatter', () => {
    const file = makeFile({ readingTime: 5 });
    plugin(makeTree(400), file);
    const fm = ((file.data as Record<string, unknown>).astro as { frontmatter: Record<string, unknown> }).frontmatter;
    expect(fm.readingTime).toBe(5);
  });

  it('creates the astro.frontmatter path when file.data.astro is absent', () => {
    const file = { data: {} } as unknown as VFile;
    plugin(makeTree(200), file);
    const astro = (file.data as Record<string, unknown>).astro as { frontmatter: { readingTime: number } };
    expect(astro.frontmatter.readingTime).toBe(1);
  });
});
