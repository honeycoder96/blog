import React, { useState, useEffect, useRef } from 'react';
import { MAX_TOC_DEPTH, scrollToHeading } from '../../../lib/toc';

interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ headings }) => {
  const [activeSlug, setActiveSlug] = useState<string>('');
  const filtered = headings.filter((h) => h.depth <= MAX_TOC_DEPTH);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Track active heading via IntersectionObserver (unchanged)
  useEffect(() => {
    if (filtered.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSlug(entry.target.id);
        });
      },
      { rootMargin: '-20% 0% -70% 0%', threshold: 0 }
    );
    filtered.forEach(({ slug }) => {
      const el = document.getElementById(slug);
      if (el) {
        observer.observe(el);
      } else if (import.meta.env.DEV) {
        console.warn(`[TableOfContents] heading element not found in DOM: #${slug}`);
      }
    });
    return () => observer.disconnect();
  }, [filtered]);

  // Slide the indicator dot to the active item
  useEffect(() => {
    const dot = indicatorRef.current;
    const list = listRef.current;
    if (!dot || !list) return;

    if (!activeSlug) {
      dot.style.opacity = '0';
      return;
    }

    const activeEl = list.querySelector<HTMLElement>(`[data-slug="${activeSlug}"]`);
    if (!activeEl) return;

    // getBoundingClientRect gives viewport-relative positions — difference is
    // the offset of the item within the list at the moment the observer fires.
    const listRect = list.getBoundingClientRect();
    const itemRect = activeEl.getBoundingClientRect();
    const top = itemRect.top - listRect.top + itemRect.height / 2 - 3; // center on 6px dot

    dot.style.transform = `translateY(${top}px)`;
    dot.style.opacity = '1';
  }, [activeSlug]);

  if (filtered.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="text-xs font-mono uppercase tracking-widest text-fg-faint mb-4">
        On this page
      </p>

      <div className="relative">
        {/* Sliding indicator dot — positioned absolutely, CSS transition moves it */}
        <span
          ref={indicatorRef}
          className="absolute left-0 top-0 w-1.5 h-1.5 rounded-full bg-fg opacity-0 -translate-x-0.5"
          style={{ transition: 'transform 0.2s ease, opacity 0.15s ease' }}
        />

        <ul ref={listRef} className="flex flex-col gap-1">
          {filtered.map((heading) => {
            const isActive = activeSlug === heading.slug;
            return (
              <li key={heading.slug}>
                <a
                  href={`#${heading.slug}`}
                  data-slug={heading.slug}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToHeading(heading.slug);
                  }}
                  className={`block text-sm leading-relaxed transition-colors duration-200 py-0.5 ${
                    heading.depth === 2 ? 'pl-6' : 'pl-3'
                  } ${isActive ? 'text-fg' : 'text-fg-faint hover:text-fg-default'}`}
                >
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
