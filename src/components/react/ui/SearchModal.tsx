import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Search, ArrowRight } from './Icons';

/** Maximum number of search results to render. */
const MAX_SEARCH_RESULTS = 8;

/** Debounce delay between keystrokes and search execution in milliseconds. */
const SEARCH_DEBOUNCE_MS = 300;

/** Delay before clearing modal state so the exit animation can finish. */
const MODAL_RESET_DELAY_MS = 300;

/** Delay before focusing the search input after the modal opens. */
const INPUT_FOCUS_DELAY_MS = 200;

/** Per-result entrance animation stagger in milliseconds. */
const RESULT_STAGGER_DELAY_MS = 60;

/** Spring easing used for modal open/close transitions. */
const MODAL_SPRING = 'cubic-bezier(0.22, 1, 0.36, 1)';

interface SearchResult {
  url: string;
  title: string;
  excerpt: string;
  date?: string;
  category?: string;
}

// pagefind ships no TypeScript types — any is unavoidable here
let pagefindInstance: any = null; // eslint-disable-line @typescript-eslint/no-explicit-any

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

  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = useCallback(() => setIsOpen(true), []);

  const close = useCallback(() => {
    setIsOpen(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    abortRef.current?.abort();
    // Delay state reset so exit animation plays with content still visible
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      setQuery('');
      setResults([]);
      setHasSearched(false);
    }, MODAL_RESET_DELAY_MS);
  }, []);

  useEffect(() => {
    const handler = () => open();
    document.addEventListener('search:open', handler);
    return () => document.removeEventListener('search:open', handler);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (e.key === 'Escape' && isOpen) {
        close();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        e.preventDefault();
        if (isOpen) {
          close();
        } else {
          open();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, open, close]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => inputRef.current?.focus(), INPUT_FOCUS_DELAY_MS);
    return () => clearTimeout(t);
  }, [isOpen]);

  // Focus trap — keep Tab/Shift+Tab within the modal when open
  useEffect(() => {
    if (!isOpen) return;
    const onTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return;
      const focusable = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.closest('[aria-hidden="true"]'));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onTab);
    return () => document.removeEventListener('keydown', onTab);
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
      // pagefind result and data objects have no TS types — any is unavoidable
      const data = await Promise.all(
        search.results.slice(0, MAX_SEARCH_RESULTS).map((r: any) => r.data()), // eslint-disable-line @typescript-eslint/no-explicit-any
      );
      if (ctrl.signal.aborted) return;
      setResults(
        data.map(
          (d: {
            url: string;
            meta?: Record<string, string>;
            excerpt?: string;
            filters?: Record<string, string[]>;
          }) => ({
            url: d.url,
            title: d.meta?.title ?? d.url,
            excerpt: d.excerpt ?? '',
            date: d.meta?.date,
            category: d.filters?.category?.[0],
          }),
        ),
      );
    } catch {
      // silently swallow AbortErrors
    } finally {
      if (!ctrl.signal.aborted) setIsLoading(false);
    }
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const q = (e.target as HTMLInputElement).value;
      setQuery(q);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => doSearch(q), SEARCH_DEBOUNCE_MS);
    },
    [doSearch],
  );

  const clearQuery = useCallback(() => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
    inputRef.current?.focus();
  }, []);

  const noResults = hasSearched && !isLoading && results.length === 0;

  return (
    <>
      {isOpen ? <>
        {/* ── Backdrop ── */}
        <div
          className="fixed inset-0 z-[100] bg-surface/55 backdrop-blur-xl"
          style={{
            opacity: 1,
            pointerEvents: 'auto',
            transition: `opacity ${`0.28s ease`}`,
          }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        />

        {/* ── Modal panel ── */}
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          className="fixed inset-0 z-[101] flex flex-col"
          style={{
            opacity: 1,
            transform: 'scale(1) translateY(0)',
            pointerEvents: 'auto',
            transition: `opacity 0.32s ${MODAL_SPRING}, transform 0.5s ${MODAL_SPRING}`,
          }}
        >
          <div className="relative w-full h-full flex flex-col">
            {/* ── Close button — delayed entrance ── */}
            <button
              onClick={close}
              aria-label="Close search"
              className="absolute top-6 right-8 z-10 p-2 text-fg-muted hover:text-fg transition-colors cursor-pointer"
              style={{
                opacity: 1,
                transform: 'translateY(0)',
                transition: `opacity 0.2s 0.15s ease, transform 0.2s 0.15s ease`,
              }}
            >
              <X size={22} />
            </button>

            {/* ── Scrollable area ── */}
            <div className="w-full h-full overflow-y-auto flex flex-col">
              {/* ── Search box — padding-top animates center → top ── */}
              <div
                className="w-full max-w-2xl mx-auto px-8"
                style={{
                  paddingTop: hasSearched ? '5rem' : 'calc(50vh - 120px)',
                  paddingBottom: hasSearched ? '1.5rem' : '2rem',
                  transition: `padding-top 0.5s ${MODAL_SPRING}, padding-bottom 0.5s ${MODAL_SPRING}`,
                }}
              >
                {/* Subtitle — collapses when user starts typing */}
                <div
                  className="text-center overflow-hidden"
                  style={{
                    maxHeight: hasSearched ? '0' : '200px',
                    opacity: hasSearched ? 0 : 1,
                    marginBottom: hasSearched ? '0' : '2.5rem',
                    transform: hasSearched
                      ? 'translateY(-20px) scale(0.95)'
                      : 'translateY(0) scale(1)',
                    transition: `max-height 0.25s ease-in, opacity 0.2s ease-in, margin-bottom 0.25s ease-in, transform 0.2s ease-in`,
                    pointerEvents: hasSearched ? 'none' : 'auto',
                  }}
                >
                  <p className="font-display text-3xl md:text-4xl font-bold text-fg mb-4 tracking-tight">
                    Search the blog
                  </p>
                  <p className="text-fg-muted text-sm font-mono">
                    Search across all articles — engineering, deep dives, architecture
                    <span className="mx-3 text-fg-ghost">·</span>
                    <kbd className="px-1.5 py-0.5 rounded border border-line text-fg-ghost text-xs">
                      ⌘K
                    </kbd>
                    &nbsp;to toggle
                  </p>
                </div>

                {/* Input */}
                <div className="relative">
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
                    spellcheck={false}
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
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-fg-faint hover:text-fg transition-colors cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* ── Results ── */}
              {hasSearched && (
                <div className="w-full max-w-2xl mx-auto px-8 pb-24 rounded-2xl bg-surface animate-results-in">
                  {noResults ? (
                    <p className="animate-fade-slide-up text-center text-fg-faint font-mono text-sm py-16">
                      No results for &ldquo;{query}&rdquo;
                    </p>
                  ) : (
                    <>
                      <ul className="flex flex-col divide-y divide-line">
                        {results.map((result, i) => (
                          <li
                            key={result.url}
                            className="animate-fade-slide-up"
                            style={{ animationDelay: `${i * RESULT_STAGGER_DELAY_MS}ms` }}
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
                                    <span className="font-mono text-[10px] text-fg-ghost">
                                      {result.date}
                                    </span>
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
                          </li>
                        ))}
                      </ul>
                      <p className="text-center text-fg-ghost font-mono text-xs pt-6">
                        {results.length} result{results.length !== 1 ? 's' : ''}
                      </p>
                    </>
                  )}
                </div>
              )}

              {/* Bottom spacer when idle */}
              {!hasSearched && <div className="flex-1" aria-hidden />}
            </div>
          </div>
        </div>
      </> : null}
    </>
  );
};
