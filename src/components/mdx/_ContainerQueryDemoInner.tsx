import { useState, useRef, useCallback, useEffect, useMemo } from 'preact/hooks';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CQBreakpoint {
  /** Short identifier, e.g. "sidebar" | "list" | "grid" */
  name: string;
  /** Container width (px) at which this layout activates */
  minWidth: number;
  /** One-line description shown in the tooltip */
  description: string;
}

interface Props {
  breakpoints: CQBreakpoint[];
  defaultWidth?: number;
  minContainerWidth?: number;
  showComparison?: boolean;
}

interface CodeLine {
  text: string;
  /** Which breakpoint name this line belongs to (for highlighting) */
  bp?: string;
}

// ─── Code builders ────────────────────────────────────────────────────────────

function buildAfterCode(breakpoints: CQBreakpoint[]): CodeLine[] {
  const lines: CodeLine[] = [
    { text: '/* ✓ Responds to its own container width */' },
    { text: '.product-card-container {' },
    { text: '  container-type: inline-size;' },
    { text: '}' },
    { text: '' },
    { text: '.product-card {' },
    { text: '  display: flex;' },
    { text: '  flex-direction: column;' },
    { text: '}' },
  ];

  breakpoints.slice(1).forEach((bp) => {
    lines.push({ text: '' });
    lines.push({ text: `@container (min-width: ${bp.minWidth}px) {`, bp: bp.name });
    if (bp.name === 'list') {
      lines.push({ text: '  .product-card {', bp: bp.name });
      lines.push({ text: '    flex-direction: row;', bp: bp.name });
      lines.push({ text: '    gap: 1rem;', bp: bp.name });
      lines.push({ text: '  }', bp: bp.name });
    } else if (bp.name === 'grid') {
      lines.push({ text: '  .product-card {', bp: bp.name });
      lines.push({ text: '    display: grid;', bp: bp.name });
      lines.push({ text: '  }', bp: bp.name });
      lines.push({ text: '  .product-card__stats {', bp: bp.name });
      lines.push({ text: '    display: flex;', bp: bp.name });
      lines.push({ text: '  }', bp: bp.name });
    } else {
      lines.push({ text: `  /* ${bp.description} */`, bp: bp.name });
    }
    lines.push({ text: '}', bp: bp.name });
  });

  return lines;
}

function buildBeforeCode(breakpoints: CQBreakpoint[]): CodeLine[] {
  // Map semantic breakpoint names to approximate viewport equivalents
  const vpMap: Record<string, number> = { list: 768, grid: 1024 };

  const lines: CodeLine[] = [
    { text: '/* ✗ Responds to viewport — fails in sidebar */' },
    { text: '.product-card {' },
    { text: '  display: flex;' },
    { text: '  flex-direction: column;' },
    { text: '}' },
  ];

  breakpoints.slice(1).forEach((bp) => {
    const vw = vpMap[bp.name] ?? bp.minWidth * 2;
    lines.push({ text: '' });
    lines.push({ text: `@media (min-width: ${vw}px) {`, bp: bp.name });
    if (bp.name === 'list') {
      lines.push({ text: '  .product-card {', bp: bp.name });
      lines.push({ text: '    flex-direction: row;', bp: bp.name });
      lines.push({ text: '    gap: 1rem;', bp: bp.name });
      lines.push({ text: '  }', bp: bp.name });
    } else if (bp.name === 'grid') {
      lines.push({ text: '  .product-card {', bp: bp.name });
      lines.push({ text: '    display: grid;', bp: bp.name });
      lines.push({ text: '  }', bp: bp.name });
      lines.push({ text: '  .product-card__stats {', bp: bp.name });
      lines.push({ text: '    display: flex;', bp: bp.name });
      lines.push({ text: '  }', bp: bp.name });
    } else {
      lines.push({ text: `  /* ${bp.description} */`, bp: bp.name });
    }
    lines.push({ text: '}', bp: bp.name });
  });

  return lines;
}

// ─── ProductCard mock ─────────────────────────────────────────────────────────

function HeadphoneIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      style="width:100%;height:100%"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="64" fill="#1e293b" rx="8" />
      <circle cx="32" cy="24" r="11" fill="none" stroke="#818cf8" strokeWidth="2.5" />
      <rect x="20" y="33" width="4" height="11" rx="2" fill="#818cf8" />
      <rect x="40" y="33" width="4" height="11" rx="2" fill="#818cf8" />
      <path
        d="M20 37 Q32 46 44 37"
        fill="none"
        stroke="#4ade80"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ProductCard({ containerWidth }: { containerWidth: number }) {
  const isList = containerWidth >= 300;
  const isGrid = containerWidth >= 500;

  if (isGrid) {
    return (
      <div class="cqd-card cqd-card--grid">
        <div class="cqd-thumb cqd-thumb--lg">
          <HeadphoneIcon />
        </div>
        <div class="cqd-card-body">
          <span class="cqd-badge">Electronics</span>
          <p class="cqd-name">Wireless Headphones Pro</p>
          <div class="cqd-stats">
            <span class="cqd-stars">★★★★☆</span>
            <span class="cqd-reviews">(127 reviews)</span>
          </div>
          <div class="cqd-footer">
            <span class="cqd-price">$89.99</span>
            <button class="cqd-btn">Add to cart</button>
          </div>
        </div>
      </div>
    );
  }

  if (isList) {
    return (
      <div class="cqd-card cqd-card--list">
        <div class="cqd-thumb cqd-thumb--md">
          <HeadphoneIcon />
        </div>
        <div class="cqd-card-body">
          <p class="cqd-name">Wireless Headphones Pro</p>
          <span class="cqd-stars">★★★★☆</span>
          <div class="cqd-footer">
            <span class="cqd-price">$89.99</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div class="cqd-card cqd-card--sidebar">
      <div class="cqd-thumb cqd-thumb--sm">
        <HeadphoneIcon />
      </div>
      <div class="cqd-card-body cqd-card-body--compact">
        <p class="cqd-name cqd-name--sm">Headphones</p>
        <span class="cqd-price">$89.99</span>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ContainerQueryDemoInner({
  breakpoints,
  defaultWidth = 380,
  minContainerWidth = 160,
  showComparison = true,
}: Props) {
  const [containerWidth, setContainerWidth] = useState(defaultWidth);
  const [mode, setMode] = useState<'before' | 'after'>('after');
  const [isDragging, setIsDragging] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(defaultWidth);
  const maxWidthRef = useRef(680);

  // Track available width via ResizeObserver
  useEffect(() => {
    if (!wrapperRef.current) return;
    const update = () => {
      if (wrapperRef.current) {
        // Leave 32px margin so the handle is never flush with the stage edge
        maxWidthRef.current = Math.max(minContainerWidth + 80, wrapperRef.current.clientWidth - 32);
      }
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, [minContainerWidth]);

  // Derived: which breakpoints are currently active
  const activeBreakpoints = useMemo(
    () => breakpoints.filter((bp) => containerWidth >= bp.minWidth).map((bp) => bp.name),
    [containerWidth, breakpoints],
  );

  const currentBreakpoint =
    activeBreakpoints[activeBreakpoints.length - 1] ?? breakpoints[0]?.name ?? '';

  const afterCode = useMemo(() => buildAfterCode(breakpoints), [breakpoints]);
  const beforeCode = useMemo(() => buildBeforeCode(breakpoints), [breakpoints]);
  const codeLines = mode === 'after' ? afterCode : beforeCode;

  // ── Drag handlers (pointer capture) ────────────────────────────────────────
  const onPointerDown = useCallback(
    (e: PointerEvent) => {
      e.preventDefault();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      isDraggingRef.current = true;
      setIsDragging(true);
      startXRef.current = e.clientX;
      startWidthRef.current = containerWidth;
    },
    [containerWidth],
  );

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const delta = e.clientX - startXRef.current;
      setContainerWidth(
        Math.round(
          Math.max(minContainerWidth, Math.min(startWidthRef.current + delta, maxWidthRef.current)),
        ),
      );
    },
    [minContainerWidth],
  );

  const onPointerUp = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
  }, []);

  // ── Preset width jumps ──────────────────────────────────────────────────────
  const setPreset = (preset: 'narrow' | 'medium' | 'wide') => {
    if (preset === 'narrow') {
      setContainerWidth(minContainerWidth + 20);
    } else if (preset === 'medium') {
      const mid = breakpoints.find((bp) => bp.minWidth > 0);
      setContainerWidth((mid?.minWidth ?? 300) + 20);
    } else {
      setContainerWidth(maxWidthRef.current);
    }
  };

  return (
    <div class="cqd-inner" ref={wrapperRef}>
      {/* ── Before/After toggle ─────────────────────────────────── */}
      {showComparison && (
        <div class="cqd-modes">
          <button
            class={
              'cqd-mode-btn' + (mode === 'before' ? ' cqd-mode-btn--active cqd-mode-btn--bad' : '')
            }
            onClick={() => setMode('before')}
          >
            <span class="cqd-mode-icon">{mode === 'before' ? '✗' : '○'}</span>
            <span class="cqd-mode-label">@media</span>
            <em class="cqd-mode-sub">before</em>
          </button>
          <div class="cqd-mode-sep" aria-hidden="true" />
          <button
            class={
              'cqd-mode-btn' + (mode === 'after' ? ' cqd-mode-btn--active cqd-mode-btn--good' : '')
            }
            onClick={() => setMode('after')}
          >
            <span class="cqd-mode-icon">{mode === 'after' ? '✓' : '○'}</span>
            <span class="cqd-mode-label">@container</span>
            <em class="cqd-mode-sub">after</em>
          </button>
          <p class="cqd-mode-hint">
            {mode === 'before'
              ? 'Breakpoints fire at viewport widths — drag the handle and nothing in the code panel changes'
              : 'Breakpoints fire at container widths — watch the highlighted rules sync with the live layout'}
          </p>
        </div>
      )}

      {/* ── Resizable preview stage ─────────────────────────────── */}
      <div class="cqd-stage">
        <div
          class={'cqd-resizable' + (isDragging ? ' cqd-resizable--dragging' : '')}
          style={{ width: `${containerWidth}px` }}
        >
          <div class="cqd-resizable-inner">
            <ProductCard containerWidth={containerWidth} />
          </div>

          {/* Drag handle on right edge */}
          <div
            class="cqd-handle"
            role="separator"
            aria-label="Drag to resize container"
            aria-orientation="vertical"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <span class="cqd-grip" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* ── Width ruler + breakpoint pills + presets ────────────── */}
      <div class="cqd-ruler">
        <div class="cqd-ruler-left">
          <span class="cqd-width-badge">{containerWidth}px</span>
          <div class="cqd-pills">
            {breakpoints.map((bp) => {
              const active = activeBreakpoints.includes(bp.name);
              const current = bp.name === currentBreakpoint;
              return (
                <div
                  key={bp.name}
                  class={
                    'cqd-pill' +
                    (active ? ' cqd-pill--active' : '') +
                    (current ? ' cqd-pill--current' : '')
                  }
                  title={bp.description}
                >
                  <span class="cqd-pill-dot" aria-hidden="true" />
                  <span class="cqd-pill-name">{bp.name}</span>
                  <span class="cqd-pill-thresh">
                    {bp.minWidth === 0 ? 'default' : `≥${bp.minWidth}px`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div class="cqd-presets">
          <button class="cqd-preset" onClick={() => setPreset('narrow')}>
            Narrow
          </button>
          <button class="cqd-preset" onClick={() => setPreset('medium')}>
            Medium
          </button>
          <button class="cqd-preset" onClick={() => setPreset('wide')}>
            Wide
          </button>
        </div>
      </div>

      {/* ── Code panel ──────────────────────────────────────────── */}
      <div class="cqd-code-wrap">
        <div class="cqd-code-bar">
          <span class="cqd-code-filename">
            {mode === 'after' ? 'container-queries.css' : 'media-queries.css'}
          </span>
          {mode === 'before' && (
            <span class="cqd-code-note cqd-code-note--bad">responds to viewport width</span>
          )}
          {mode === 'after' && (
            <span class="cqd-code-note cqd-code-note--good">responds to container width</span>
          )}
        </div>
        <pre class="cqd-pre">
          <code>
            {codeLines.map((line, i) => {
              const highlighted = !!line.bp && activeBreakpoints.includes(line.bp);
              const showTag = highlighted && line.text.trimStart().startsWith('@');
              return (
                <div key={i} class={'cqd-ln' + (highlighted ? ' cqd-ln--hl' : '')}>
                  <span class="cqd-ln-num" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span class="cqd-ln-text">{line.text || '\u00a0'}</span>
                  {showTag && (
                    <span class="cqd-ln-tag" aria-label="currently active">
                      active
                    </span>
                  )}
                </div>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
}
