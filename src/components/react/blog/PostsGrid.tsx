import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CATEGORY_COLOR_MAP, slugifyCategory } from '../../../config/categories.client';

interface Post {
  slug: string;
  data: {
    title: string;
    date: string;
    category: string;
    summary: string;
    readingTime?: number | null;
    tags: string[];
  };
}

interface CachedPage {
  posts: Post[];
  total: number;
}

interface PostsGridProps {
  /** First page of posts, baked into the HTML at build time. */
  initialPosts: Post[];
  /** Total post count across all categories — used to determine if Load More exists on first render. */
  initialTotal: number;
  /** Ordered category list (with "All" prepended) — built server-side so filter tabs appear immediately. */
  categories: string[];
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 200, damping: 20 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
};

export const PostsGrid: React.FC<PostsGridProps> = ({ initialPosts, initialTotal, categories }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [total, setTotal] = useState<number>(initialTotal);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const prefersReducedMotion = useReducedMotion();

  // #6 — in-memory cache keyed by "category::page"
  const prefetchCache = useRef<Map<string, CachedPage>>(new Map());
  // #8 — abort in-flight fetches on rapid category switch
  const abortControllerRef = useRef<AbortController | null>(null);
  // #7 — debounce timer for hover prefetch
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasMore = posts.length < total;

  // ---------------------------------------------------------------------------
  // #6 — Background prefetch: fetch silently, write to cache, no state changes
  // ---------------------------------------------------------------------------

  const prefetchInBackground = useCallback((category: string, pageNum: number) => {
    const cacheKey = `${category}::${pageNum}`;
    if (prefetchCache.current.has(cacheKey)) return;
    const slug = slugifyCategory(category);
    fetch(`/api/posts/${slug}/${pageNum}.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data) prefetchCache.current.set(cacheKey, data); })
      .catch(() => {});
  }, []);

  // ---------------------------------------------------------------------------
  // Core fetch helper — #8 abort previous, #6 check cache, signal new controller
  // ---------------------------------------------------------------------------

  const fetchPage = useCallback(async (category: string, pageNum: number, append: boolean) => {
    // #8 — abort any in-flight request before starting a new one
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // #6 — serve from cache when available
    const cacheKey = `${category}::${pageNum}`;
    const cached = prefetchCache.current.get(cacheKey);
    if (cached) {
      setPosts((prev) => (append ? [...prev, ...cached.posts] : cached.posts));
      setTotal(cached.total);
      setPage(pageNum);
      prefetchInBackground(category, pageNum + 1);
      return;
    }

    setIsLoading(true);
    try {
      const slug = slugifyCategory(category);
      const res = await fetch(`/api/posts/${slug}/${pageNum}.json`, { signal: controller.signal });
      if (!res.ok) return;
      const data = await res.json();
      // Cache the result then update state
      prefetchCache.current.set(cacheKey, data);
      setPosts((prev) => (append ? [...prev, ...data.posts] : data.posts));
      setTotal(data.total);
      setPage(pageNum);
      // #6 — prefetch the next page in the background
      prefetchInBackground(category, pageNum + 1);
    } catch (e) {
      // #8 — AbortError is expected on rapid switch, silently ignore
      if ((e as Error).name === 'AbortError') return;
    } finally {
      setIsLoading(false);
    }
  }, [prefetchInBackground]);

  // ---------------------------------------------------------------------------
  // On hydration: #6 prefetch page 2 of "All", honour ?category= URL param
  // ---------------------------------------------------------------------------

  useEffect(() => {
    // #6 — kick off page 2 prefetch immediately so Load More is instant
    prefetchInBackground('All', 2);

    const param = new URLSearchParams(window.location.search).get('category');
    if (param && categories.includes(param) && param !== 'All') {
      setActiveCategory(param);
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
    if (cat === 'All') {
      // #8 — cancel any in-flight request, reset to baked-in data instantly
      abortControllerRef.current?.abort();
      setPosts(initialPosts);
      setTotal(initialTotal);
      setPage(1);
    } else {
      fetchPage(cat, 1, false);
    }
  }, [activeCategory, initialPosts, initialTotal, fetchPage]);

  const handleLoadMore = useCallback(() => {
    fetchPage(activeCategory, page + 1, true);
  }, [activeCategory, page, fetchPage]);

  // #7 — prefetch on hover with 100ms debounce
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
            {cat}
          </button>
        ))}
      </div>

      {/* Posts list */}
      <div className="w-full flex flex-col border-t border-line">
        <AnimatePresence mode="popLayout">
          {posts.map((post) => (
            <motion.a
              key={post.slug}
              href={`/blog/${post.slug}`}
              variants={prefersReducedMotion ? undefined : cardVariants}
              initial={prefersReducedMotion ? undefined : 'hidden'}
              animate={prefersReducedMotion ? undefined : 'visible'}
              exit={prefersReducedMotion ? undefined : 'exit'}
              className="group border-b border-line py-8 md:py-10 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-fg-muted transition-colors w-full"
            >
              <div className="md:w-1/4 flex flex-col gap-3">
                <time className="text-fg-faint font-mono text-xs">{post.data.date}</time>
                <span
                  className={`self-start px-3 py-1 rounded-full border text-xs font-mono uppercase tracking-wider ${
                    CATEGORY_COLOR_MAP[post.data.category] ?? 'text-fg-muted border-line'
                  }`}
                >
                  {post.data.category}
                </span>
              </div>

              <div className="md:w-2/4 flex flex-col gap-2">
                <h3 className="text-xl md:text-2xl font-display font-bold text-fg-default group-hover:text-fg transition-colors duration-300">
                  {post.data.title}
                </h3>
                <p className="text-sm text-fg-faint line-clamp-2 leading-relaxed">
                  {post.data.summary}
                </p>
                {post.data.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap mt-1">
                    {post.data.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs font-mono text-fg-ghost">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="md:w-1/4 flex justify-end items-center gap-3">
                {post.data.readingTime && (
                  <span className="text-fg-ghost font-mono text-xs">
                    {post.data.readingTime}m read
                  </span>
                )}
                <ArrowRight
                  size={24}
                  className="text-fg-ghost group-hover:text-fg group-hover:-rotate-45 transition-all duration-300"
                />
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {posts.length === 0 && !isLoading && (
        <div className="text-center py-24 text-fg-faint font-mono">
          No posts in this category yet.
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && posts.length === 0 && (
        <div className="w-full flex flex-col border-t border-line">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border-b border-line py-8 md:py-10 flex flex-col md:flex-row gap-4 animate-pulse">
              <div className="md:w-1/4 flex flex-col gap-3">
                <div className="h-3 w-16 rounded bg-line" />
                <div className="h-5 w-24 rounded-full bg-line" />
              </div>
              <div className="md:w-2/4 flex flex-col gap-2">
                <div className="h-6 w-3/4 rounded bg-line" />
                <div className="h-4 w-full rounded bg-line" />
                <div className="h-4 w-2/3 rounded bg-line" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center mt-12">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="px-8 py-3 rounded-full border border-line text-fg-muted hover:border-line-strong hover:text-fg font-mono text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? 'Loading...'
              : <>Load more <span className="text-fg-ghost">({total - posts.length} remaining)</span></>
            }
          </button>
        </div>
      )}
    </div>
  );
};
