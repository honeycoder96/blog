/**
 * Remark plugin — auto-computes readingTime from MDX/MD word count.
 *
 * Walks the AST, counts all text node words, derives reading time at
 * 200 wpm, and injects the value into Astro's frontmatter layer.
 *
 * Only sets readingTime when the author has NOT already provided one
 * explicitly in the file's frontmatter — manual values are preserved.
 */
import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
import type { VFile } from 'vfile';
import { WORDS_PER_MINUTE } from './constants';

function countWords(tree: Root): number {
  let count = 0;
  visit(tree, 'text', (node) => {
    count += node.value.trim().split(/\s+/).filter(Boolean).length;
  });
  return count;
}

export function remarkReadingTime() {
  return function (tree: Root, file: VFile) {
    // Astro merges file.data.astro.frontmatter into the collection entry.
    const astroData = (file.data as Record<string, unknown>).astro as
      | { frontmatter: Record<string, unknown> }
      | undefined;

    // Preserve explicit author-provided values
    if (astroData?.frontmatter?.readingTime !== undefined) return;

    const words = countWords(tree);
    const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));

    if (!astroData) {
      (file.data as Record<string, unknown>).astro = { frontmatter: { readingTime: minutes } };
    } else {
      astroData.frontmatter.readingTime = minutes;
    }
  };
}
