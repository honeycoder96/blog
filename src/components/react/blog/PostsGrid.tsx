import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowRight } from '../ui/Icons';
import { CATEGORY_COLOR_MAP, slugifyCategory } from '../../../config/categories';
import { ListSkeleton } from '../ui/ListSkeleton';
import { ErrorRetry } from '../ui/ErrorRetry';
import { getReadPosts } from '../../../lib/readPosts';

/** Maximum number of tags rendered per post card. */
const MAX_VISIBLE_TAGS = 3;

/** Builds the URL for a paginated posts API response. */
const postsApiUrl = (categorySlug: string, page: number) =>
  `/api/posts/${categorySlug}/${page}.json`;

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
  initialPosts: Post[];
  initialTotal: number;
  /** Category label for this page — 'All' | 'Engineering' | etc. Determines the API slug. */
  category: string;
}

export const PostsGrid: React.FC<PostsGridProps> = ({ initialPosts, initialTotal, category }) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [total, setTotal] = useState<number>(initialTotal);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [readSlugs, setReadSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    setReadSlugs(getReadPosts());
  }, []);

  // Slugs added via Load More — get the CSS enter animation
  const newSlugs = useRef<Set<string>>(new Set());

  const prefetchCache = useRef<Map<string, CachedPage>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const hasMore = posts.length < total;

  // ---------------------------------------------------------------------------
  // Background prefetch — next page only (category is fixed per page)
  // ---------------------------------------------------------------------------

  const prefetchInBackground = useCallback(
    (pageNum: number) => {
      const cacheKey = `${category}::${pageNum}`;
      if (prefetchCache.current.has(cacheKey)) return;
      const slug = slugifyCategory(category);
      fetch(postsApiUrl(slug, pageNum))
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data) prefetchCache.current.set(cacheKey, data);
        })
        .catch(() => {});
    },
    [category],
  );

  // ---------------------------------------------------------------------------
  // Load More — always appends; category is fixed
  // ---------------------------------------------------------------------------

  const fetchPage = useCallback(
    async (pageNum: number) => {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const cacheKey = `${category}::${pageNum}`;
      const cached = prefetchCache.current.get(cacheKey);
      if (cached) {
        cached.posts.forEach((p) => newSlugs.current.add(p.slug));
        setPosts((prev) => [...prev, ...cached.posts]);
        setTotal(cached.total);
        setPage(pageNum);
        prefetchInBackground(pageNum + 1);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const slug = slugifyCategory(category);
        const res = await fetch(postsApiUrl(slug, pageNum), { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        prefetchCache.current.set(cacheKey, data);
        data.posts.forEach((p: Post) => newSlugs.current.add(p.slug));
        setPosts((prev) => [...prev, ...data.posts]);
        setTotal(data.total);
        setPage(pageNum);
        prefetchInBackground(pageNum + 1);
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') return;
        setError(
          navigator.onLine
            ? 'Failed to load posts. Please try again.'
            : "You're offline — only posts loaded during this session are available.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [category, prefetchInBackground],
  );

  // ---------------------------------------------------------------------------
  // On mount: prefetch page 2 so Load More is instant
  // ---------------------------------------------------------------------------

  useEffect(() => {
    prefetchInBackground(2);
    // Intentionally empty deps: runs once on mount to warm the cache for page 2.
    // prefetchInBackground is stable (useCallback with [category]) but including it
    // would re-run this effect on every category change, which is not desired here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------------------
  // #16 — Keyboard navigation: j/↓ next post, k/↑ previous post
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key !== 'j' && e.key !== 'k' && e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;

      const links = listRef.current?.querySelectorAll<HTMLAnchorElement>('a[data-post-link]');
      if (!links || links.length === 0) return;

      e.preventDefault();
      const linksArr = Array.from(links);
      const currentIdx = linksArr.indexOf(document.activeElement as HTMLAnchorElement);

      if (e.key === 'j' || e.key === 'ArrowDown') {
        linksArr[currentIdx < linksArr.length - 1 ? currentIdx + 1 : 0].focus();
      } else {
        linksArr[currentIdx > 0 ? currentIdx - 1 : linksArr.length - 1].focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleLoadMore = useCallback(() => {
    fetchPage(page + 1);
  }, [page, fetchPage]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div>
      {/* Posts list */}
      <div ref={listRef} className="w-full flex flex-col border-t border-line">
        {posts.map((post) => (
          <a
            key={post.slug}
            href={`/blog/${post.slug}`}
            data-astro-prefetch
            data-post-link
            className={`group border-b border-line py-8 md:py-10 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-fg-muted transition-colors w-full${
              newSlugs.current.has(post.slug) ? ' animate-fade-slide-up' : ''
            }`}
          >
            <div className="md:w-1/4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <time className="text-fg-faint font-mono text-xs">{post.data.date}</time>
                {readSlugs.has(post.slug) && (
                  <span className="font-mono text-[10px] text-fg-ghost uppercase tracking-widest">
                    ✓ read
                  </span>
                )}
              </div>
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
                  {post.data.tags.slice(0, MAX_VISIBLE_TAGS).map((tag) => (
                    <span key={tag} className="text-xs font-mono text-fg-ghost">
                      #{tag}
                    </span>
                  ))}
                  {post.data.tags.length > MAX_VISIBLE_TAGS && (
                    <span className="text-xs font-mono text-fg-ghost">
                      +{post.data.tags.length - MAX_VISIBLE_TAGS}
                    </span>
                  )}
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
          </a>
        ))}
      </div>

      {/* Empty state */}
      {posts.length === 0 && !isLoading && (
        <div className="text-center py-24 text-fg-faint font-mono">
          No posts in this category yet.
        </div>
      )}

      {/* Append skeleton — Load More in progress */}
      {isLoading && posts.length > 0 && <ListSkeleton />}

      {/* Error state */}
      {error && !isLoading && <ErrorRetry message={error} onRetry={() => fetchPage(page + 1)} />}

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center mt-12">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="px-8 py-3 rounded-full border border-line text-fg-muted hover:border-line-strong hover:text-fg font-mono text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              'Loading...'
            ) : (
              <>
                Load more <span className="text-fg-ghost">({total - posts.length} remaining)</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
