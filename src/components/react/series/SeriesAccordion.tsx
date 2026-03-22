import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown, BookOpen, Clock } from 'lucide-react';
import { CATEGORY_COLOR_MAP, slugifyCategory } from '../../../config/categories.client';

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

interface CachedPage {
  series: Series[];
  total: number;
}

interface Props {
  initialSeries: Series[];
  initialTotal: number;
  categories: string[];
  categoryCounts?: Record<string, number>;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 200, damping: 20 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
};

export const SeriesAccordion: React.FC<Props> = ({ initialSeries, initialTotal, categories, categoryCounts }) => {
  const [activeCategory, setActiveCategory] = useState<string>(() => {
    if (typeof window === 'undefined') return 'All';
    const param = new URLSearchParams(window.location.search).get('category');
    if (param && categories.includes(param)) return param;
    return 'All';
  });
  const [series, setSeries] = useState<Series[]>(initialSeries);
  const [total, setTotal] = useState<number>(initialTotal);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const prefersReducedMotion = useReducedMotion();

  const prefetchCache = useRef<Map<string, CachedPage>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasMore = series.length < total;

  // ---------------------------------------------------------------------------
  // Background prefetch
  // ---------------------------------------------------------------------------

  const prefetchInBackground = useCallback((category: string, pageNum: number) => {
    const cacheKey = `${category}::${pageNum}`;
    if (prefetchCache.current.has(cacheKey)) return;
    const slug = slugifyCategory(category);
    fetch(`/api/series/${slug}/${pageNum}.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data) prefetchCache.current.set(cacheKey, data); })
      .catch(() => {});
  }, []);

  // ---------------------------------------------------------------------------
  // Core fetch helper
  // ---------------------------------------------------------------------------

  const fetchPage = useCallback(async (category: string, pageNum: number, append: boolean) => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const cacheKey = `${category}::${pageNum}`;
    const cached = prefetchCache.current.get(cacheKey);
    if (cached) {
      setSeries((prev) => (append ? [...prev, ...cached.series] : cached.series));
      setTotal(cached.total);
      setPage(pageNum);
      prefetchInBackground(category, pageNum + 1);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const slug = slugifyCategory(category);
      const res = await fetch(`/api/series/${slug}/${pageNum}.json`, { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      prefetchCache.current.set(cacheKey, data);
      setSeries((prev) => (append ? [...prev, ...data.series] : data.series));
      setTotal(data.total);
      setPage(pageNum);
      prefetchInBackground(category, pageNum + 1);
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
      setError('Failed to load series. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [prefetchInBackground]);

  // ---------------------------------------------------------------------------
  // On hydration: prefetch page 2 of "All", honour ?category= URL param
  // ---------------------------------------------------------------------------

  useEffect(() => {
    prefetchInBackground('All', 2);

    const param = new URLSearchParams(window.location.search).get('category');
    if (param && categories.includes(param) && param !== 'All') {
      fetchPage(param, 1, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleCategoryChange = useCallback((cat: string) => {
    if (cat === activeCategory) return;
    setActiveCategory(cat);
    setOpenIndex(0);
    if (cat === 'All') {
      abortControllerRef.current?.abort();
      setSeries(initialSeries);
      setTotal(initialTotal);
      setPage(1);
    } else {
      fetchPage(cat, 1, false);
    }
  }, [activeCategory, initialSeries, initialTotal, fetchPage]);

  const handleLoadMore = useCallback(() => {
    fetchPage(activeCategory, page + 1, true);
  }, [activeCategory, page, fetchPage]);

  const handleCategoryPointerEnter = useCallback((cat: string) => {
    if (cat === activeCategory) return;
    hoverTimerRef.current = setTimeout(() => {
      prefetchInBackground(cat, 1);
    }, 100);
  }, [activeCategory, prefetchInBackground]);

  const handleCategoryPointerLeave = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div>
      {/* Category filters */}
      <div className="flex flex-wrap gap-3 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            onPointerEnter={() => handleCategoryPointerEnter(cat)}
            onPointerLeave={handleCategoryPointerLeave}
            className={`px-5 py-2 rounded-full border font-mono text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer ${
              activeCategory === cat
                ? 'bg-fg text-surface border-fg'
                : 'border-line text-fg-muted hover:border-line-strong hover:text-fg-default'
            }`}
          >
            {cat}{categoryCounts?.[cat] !== undefined ? ` (${categoryCounts[cat]})` : ''}
          </button>
        ))}
      </div>

      {/* Series accordion list */}
      <div className="w-full flex flex-col border-t border-line">
        <AnimatePresence mode="popLayout">
          {series.map((s, idx) => {
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
                              data-astro-prefetch
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

      {series.length === 0 && !isLoading && (
        <div className="text-center py-24 text-fg-faint font-mono">
          No series in this category yet.
        </div>
      )}

      {/* Loading skeleton — full replace */}
      {isLoading && series.length === 0 && (
        <div className="w-full flex flex-col border-t border-line">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border-b border-line py-8 md:py-10 flex flex-col md:flex-row gap-4 animate-pulse">
              <div className="md:w-1/4 flex flex-col gap-3">
                <div className="h-5 w-24 rounded-full bg-line" />
                <div className="h-3 w-16 rounded bg-line" />
              </div>
              <div className="md:w-2/4 flex flex-col gap-2">
                <div className="h-6 w-3/4 rounded bg-line" />
                <div className="h-4 w-full rounded bg-line" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Append skeleton — Load More in progress (#20) */}
      {isLoading && series.length > 0 && (
        <div className="border-b border-line py-8 md:py-10 flex flex-col md:flex-row gap-4 animate-pulse">
          <div className="md:w-1/4 flex flex-col gap-3">
            <div className="h-5 w-24 rounded-full bg-line" />
            <div className="h-3 w-16 rounded bg-line" />
          </div>
          <div className="md:w-2/4 flex flex-col gap-2">
            <div className="h-6 w-3/4 rounded bg-line" />
            <div className="h-4 w-full rounded bg-line" />
          </div>
        </div>
      )}

      {/* Error state (#19) */}
      {error && !isLoading && (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="font-mono text-sm text-fg-muted">{error}</p>
          <button
            onClick={() => fetchPage(activeCategory, page, false)}
            className="px-6 py-2 rounded-full border border-line text-fg-muted hover:border-line-strong hover:text-fg font-mono text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center mt-12">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="px-8 py-3 rounded-full border border-line text-fg-muted hover:border-line-strong hover:text-fg font-mono text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? 'Loading...'
              : <>Load more <span className="text-fg-ghost">({total - series.length} remaining)</span></>
            }
          </button>
        </div>
      )}
    </div>
  );
};
