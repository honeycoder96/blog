import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

  const filtered = headings.filter((h) => h.depth <= 2);

  useEffect(() => {
    if (filtered.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSlug(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -70% 0%', threshold: 0 }
    );

    filtered.forEach(({ slug }) => {
      const el = document.getElementById(slug);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [filtered]);

  if (filtered.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="text-xs font-mono uppercase tracking-widest text-neutral-600 mb-4">
        On this page
      </p>
      <ul className="flex flex-col gap-1">
        {filtered.map((heading) => {
          const isActive = activeSlug === heading.slug;
          return (
            <li key={heading.slug}>
              <a
                href={`#${heading.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(heading.slug)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`block text-sm leading-relaxed transition-colors duration-200 py-0.5 ${
                  heading.depth === 2 ? 'pl-3' : ''
                } ${
                  isActive
                    ? 'text-white'
                    : 'text-neutral-600 hover:text-neutral-300'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="toc-indicator"
                    className="inline-block w-1 h-1 rounded-full bg-white mr-2 align-middle"
                  />
                )}
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
