import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Search, ArrowRight } from 'lucide-react';

interface SearchResult {
  url: string;
  title: string;
  excerpt: string;
  date?: string;
  category?: string;
}

let pagefindInstance: any = null;

async function getPagefind() {
  if (pagefindInstance) return pagefindInstance;
  try {
    // new Function bypasses Vite's static import analysis so it won't try to
    // resolve /pagefind/pagefind.js at dev-server startup (file only exists
    // after `npm run build`). The browser handles the import natively at runtime.
    const pf = await new Function('s', 'return import(s)')('/pagefind/pagefind.js');
    await pf.init();
    pagefindInstance = pf;
    return pf;
  } catch {
    return null;
  }
}

export const SearchModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = useCallback(() => setIsOpen(true), []);

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
    setHasSearched(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    abortRef.current?.abort();
  }, []);

  useEffect(() => {
    const handler = () => open();
    document.addEventListener('search:open', handler);
    return () => document.removeEventListener('search:open', handler);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (e.key === 'Escape' && isOpen) { close(); return; }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        e.preventDefault();
        isOpen ? close() : open();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, open, close]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), 200);
    return () => clearTimeout(t);
  }, [isOpen]);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    setHasSearched(true);
    setIsLoading(true);
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const pf = await getPagefind();
      if (!pf || ctrl.signal.aborted) return;
      const search = await pf.search(q);
      if (ctrl.signal.aborted) return;
      const data = await Promise.all(search.results.slice(0, 8).map((r: any) => r.data()));
      if (ctrl.signal.aborted) return;
      setResults(
        data.map((d: any) => ({
          url: d.url,
          title: d.meta?.title ?? d.url,
          excerpt: d.excerpt,
          date: d.meta?.date,
          category: d.filters?.category?.[0],
        }))
      );
    } catch {
      // silently swallow AbortErrors
    } finally {
      if (!ctrl.signal.aborted) setIsLoading(false);
    }
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const q = e.target.value;
      setQuery(q);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => doSearch(q), 300);
    },
    [doSearch]
  );

  const clearQuery = useCallback(() => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
    inputRef.current?.focus();
  }, []);

  const noResults = hasSearched && !isLoading && results.length === 0;
  const r = prefersReducedMotion;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: r ? 0 : 0.28 }}
            className="fixed inset-0 z-[100] bg-surface/55 backdrop-blur-xl"
            onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}
          />

          {/* ── Modal panel (separate layer so backdrop doesn't clip children) ── */}
          <motion.div
            key="search-panel"
            initial={r ? {} : { opacity: 0, scale: 0.92, y: 72 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={r ? {} : { opacity: 0, scale: 0.94, y: 40, transition: { duration: 0.22, ease: 'easeIn' } }}
            transition={{ type: 'spring', stiffness: 220, damping: 26, mass: 0.9 }}
            className="fixed inset-0 z-[101] flex flex-col pointer-events-none"
          >
            {/* Everything inside re-enables pointer events */}
            <div className="relative w-full h-full flex flex-col pointer-events-auto">

              {/* ── Close button ── */}
              <motion.button
                initial={r ? {} : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.2 }}
                onClick={close}
                aria-label="Close search"
                className="absolute top-6 right-8 z-10 p-2 text-fg-muted hover:text-fg transition-colors"
              >
                <X size={22} />
              </motion.button>

              {/* ── Scrollable area ── */}
              <div className="w-full h-full overflow-y-auto flex flex-col">

                {/*
                  Vertical spacer: when not yet searched it pushes the search box
                  to the middle. Removing it triggers Framer Motion's layout
                  animation to smoothly slide the box to the top.
                */}
                {!hasSearched && (
                  <motion.div
                    aria-hidden
                    className="flex-1"
                    exit={{}}
                  />
                )}

                {/* ── Search box ── */}
                <motion.div
                  layout
                  transition={{ type: 'spring', stiffness: 200, damping: 28, mass: 0.8 }}
                  className={`w-full max-w-2xl mx-auto px-8 ${hasSearched ? 'pt-20 pb-6' : 'pb-8'}`}
                >
                  {/* Subtitle */}
                  <AnimatePresence>
                    {!hasSearched && (
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2, ease: 'easeIn' } }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="mb-10 text-center"
                      >
                        <p className="font-display text-3xl md:text-4xl font-bold text-fg mb-4 tracking-tight">
                          Search the blog
                        </p>
                        <p className="text-fg-muted text-sm font-mono">
                          Search across all articles — engineering, deep dives, architecture
                          <span className="mx-3 text-fg-ghost">·</span>
                          <kbd className="px-1.5 py-0.5 rounded border border-line text-fg-ghost text-xs">⌘K</kbd>
                          &nbsp;to toggle
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Input */}
                  <motion.div
                    layout="position"
                    transition={{ type: 'spring', stiffness: 200, damping: 28 }}
                    className="relative"
                  >
                    <Search
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-fg-faint pointer-events-none"
                    />
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={handleChange}
                      placeholder="Search articles..."
                      autoComplete="off"
                      spellCheck={false}
                      className="w-full pl-12 pr-12 py-4 bg-surface-raised border border-line rounded-2xl text-fg placeholder:text-fg-ghost font-mono text-sm focus:outline-none focus:border-line-strong transition-colors"
                    />
                    {isLoading && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 rounded-full border border-fg-faint border-t-fg animate-spin" />
                      </div>
                    )}
                    {query && !isLoading && (
                      <button
                        onClick={clearQuery}
                        aria-label="Clear search"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-fg-faint hover:text-fg transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </motion.div>
                </motion.div>

                {/* ── Results ── */}
                <AnimatePresence>
                  {hasSearched && (
                    <motion.div
                      key="results"
                      initial={r ? {} : { opacity: 0, y: 32 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 16, transition: { duration: 0.15 } }}
                      transition={{ type: 'spring', stiffness: 240, damping: 28, delay: 0.06 }}
                      className="w-full max-w-2xl mx-auto px-8 pb-24 rounded-2xl bg-surface"
                    >
                      {noResults ? (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center text-fg-faint font-mono text-sm py-16"
                        >
                          No results for &ldquo;{query}&rdquo;
                        </motion.p>
                      ) : (
                        <>
                          <ul className="flex flex-col divide-y divide-line">
                            {results.map((result, i) => (
                              <motion.li
                                key={result.url}
                                initial={r ? {} : { opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  type: 'spring',
                                  stiffness: 260,
                                  damping: 28,
                                  delay: i * 0.07,
                                }}
                              >
                                <a
                                  href={result.url}
                                  onClick={close}
                                  className="group flex items-start justify-between gap-4 py-5"
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1.5">
                                      {result.category && (
                                        <span className="font-mono text-[10px] uppercase tracking-widest text-fg-ghost">
                                          {result.category}
                                        </span>
                                      )}
                                      {result.date && (
                                        <span className="font-mono text-[10px] text-fg-ghost">{result.date}</span>
                                      )}
                                    </div>
                                    <p className="font-display font-bold text-fg-default group-hover:text-fg transition-colors leading-snug mb-1.5">
                                      {result.title}
                                    </p>
                                    <p
                                      className="text-sm text-fg-faint leading-relaxed line-clamp-2 search-excerpt"
                                      dangerouslySetInnerHTML={{ __html: result.excerpt }}
                                    />
                                  </div>
                                  <ArrowRight
                                    size={16}
                                    className="text-fg-ghost group-hover:text-fg group-hover:-rotate-45 transition-all duration-200 shrink-0 mt-1"
                                  />
                                </a>
                              </motion.li>
                            ))}
                          </ul>
                          <p className="text-center text-fg-ghost font-mono text-xs pt-6">
                            {results.length} result{results.length !== 1 ? 's' : ''}
                          </p>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bottom spacer when no results yet (keeps layout balanced) */}
                {!hasSearched && <div className="flex-1" aria-hidden />}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
