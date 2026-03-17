import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown, BookOpen, Clock } from 'lucide-react';
import { CATEGORY_COLOR_MAP, buildFilterCategories } from '../../../config/categories';

interface SeriesPost {
  slug: string;
  title: string;
  summary?: string;
  readingTime?: number;
}

interface Series {
  seriesSlug: string;
  title: string;
  description?: string;
  category: string;
  posts: SeriesPost[];
}

interface Props {
  series: Series[];
}

function getInitialCategory(categories: string[]): string {
  if (typeof window === 'undefined') return 'All';
  const param = new URLSearchParams(window.location.search).get('category');
  if (param && categories.includes(param)) return param;
  return 'All';
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 200, damping: 20 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
};

const PAGE_SIZE = 5;

export const SeriesAccordion: React.FC<Props> = ({ series }) => {
  const categories = buildFilterCategories(series.map((s) => s.category));
  const [activeCategory, setActiveCategory] = useState<string>(() => getInitialCategory(categories));
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const prefersReducedMotion = useReducedMotion();

  const filtered = activeCategory === 'All'
    ? series
    : series.filter(s => s.category === activeCategory);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setOpenIndex(0);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div>
      {/* Category filters */}
      <div className="flex flex-wrap gap-3 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-5 py-2 rounded-full border font-mono text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer ${
              activeCategory === cat
                ? 'bg-fg text-surface border-fg'
                : 'border-line text-fg-muted hover:border-line-strong hover:text-fg-default'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Series accordion list */}
      <div className="w-full flex flex-col border-t border-line">
        <AnimatePresence mode="popLayout">
          {visible.map((s, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={s.seriesSlug}
                variants={prefersReducedMotion ? undefined : cardVariants}
                initial={prefersReducedMotion ? undefined : 'hidden'}
                animate={prefersReducedMotion ? undefined : 'visible'}
                exit={prefersReducedMotion ? undefined : 'exit'}
                className="border-b border-line w-full"
              >
                {/* Accordion header */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full group py-8 md:py-10 flex flex-col md:flex-row justify-between md:items-center gap-4 text-left hover:border-fg-muted transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="md:w-1/4 flex flex-col gap-3">
                    <span
                      className={`self-start px-3 py-1 rounded-full border text-xs font-mono uppercase tracking-wider ${
                        CATEGORY_COLOR_MAP[s.category] ?? 'text-fg-muted border-line'
                      }`}
                    >
                      {s.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-mono text-fg-faint">
                      <BookOpen size={11} />
                      {s.posts.length} {s.posts.length === 1 ? 'post' : 'posts'}
                    </span>
                  </div>

                  <div className="md:w-2/4 flex flex-col gap-2">
                    <h3 className="text-xl md:text-2xl font-display font-bold text-fg-default group-hover:text-fg transition-colors duration-300">
                      {s.title}
                    </h3>
                    {s.description && (
                      <p className="text-sm text-fg-faint line-clamp-2 leading-relaxed">
                        {s.description}
                      </p>
                    )}
                  </div>

                  <div className="md:w-1/4 flex justify-end items-center gap-3">
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                    >
                      <ChevronDown size={20} className="text-fg-ghost group-hover:text-fg transition-all duration-300" />
                    </motion.div>
                  </div>
                </button>

                {/* Expanded post list */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                      animate={prefersReducedMotion ? undefined : { height: 'auto', opacity: 1 }}
                      exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <ol className="flex flex-col gap-1 pb-8">
                        {s.posts.map((post, postIdx) => (
                          <li key={post.slug}>
                            <a
                              href={`/series/${s.seriesSlug}/${post.slug}`}
                              className="group flex items-start gap-4 py-3 px-4 rounded-xl hover:bg-surface-raised/50 transition-colors"
                            >
                              <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full border border-line flex items-center justify-center font-mono text-xs text-fg-faint group-hover:border-fg-muted group-hover:text-fg transition-colors">
                                {postIdx + 1}
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="font-display font-semibold text-fg-default group-hover:text-fg transition-colors leading-snug">
                                  {post.title}
                                </p>
                                {post.summary && (
                                  <p className="text-xs text-fg-faint mt-1 line-clamp-2 leading-relaxed">
                                    {post.summary}
                                  </p>
                                )}
                              </div>
                              {post.readingTime && (
                                <span className="shrink-0 flex items-center gap-1 text-xs font-mono text-fg-ghost mt-0.5">
                                  <Clock size={10} />
                                  {post.readingTime}m
                                </span>
                              )}
                            </a>
                          </li>
                        ))}
                      </ol>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-24 text-fg-faint font-mono">
          No series in this category yet.
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
            className="px-8 py-3 rounded-full border border-line text-fg-muted hover:border-line-strong hover:text-fg font-mono text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer"
          >
            Load more <span className="text-fg-ghost">({filtered.length - visibleCount} remaining)</span>
          </button>
        </div>
      )}
    </div>
  );
};
